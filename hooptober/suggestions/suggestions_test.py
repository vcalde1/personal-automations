import datetime
import json
import time
from google.oauth2 import service_account
from googleapiclient.discovery import build
from imdb import Cinemagoer, IMDbError
import requests
from bs4 import BeautifulSoup

need_qc = []
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
    "Accept-Encoding": "gzip, deflate",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "DNT": "1",
    "Connection": "close",
    "Upgrade-Insecure-Requests": "1"
}


def get_group_suggestions_from_google_sheet():
    print("Beginning Google Sheet data request.")
    print("-------")
    sheet_id = "1qDi3LfLHd9jzOesVyBBHu0In6k9d3Q_1LjVdhrbwFFk"
    range_name = "B8:D"  # This is votes, movie title, and year. Adjust the range as needed.
    creds = service_account.Credentials.from_service_account_file("client_secret_googleusercontent.json")

    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API to get data
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=sheet_id, range=range_name).execute()

    # Extract the data
    values = result.get('values', [])
    dict_movies = {}
    for movie in values:
        voters = movie[0].split(", ")
        movie_title = movie[1]
        movie_year = movie[2]
        dict_movies[movie_title] = {"year": movie_year, "voters": voters, "categories": ""}
    print("Suggestions from Google Sheet acquired.")
    return dict_movies


def search_for_movie_by_title_year(imdb, title_with_year):
    print("Starting search on iMDB for", title_with_year)
    print("-------")
    movie_search = None
    # if "Ganja" in title_with_year:
    #     movie_id = "0068619"
    #     return movie_id
    # elif "Blacula" in title_with_year:
    #     movie_id = "0070656"
    #     return movie_id
    # elif "Storm of the Century" in title_with_year:
    #     movie_id = "0135659"
    #     return movie_id
    # elif "Subspecies" in title_with_year:
    #     movie_id = "0103002"
    #     return movie_id
    # elif "Piranha" in title_with_year:
    #     movie_id = "0078087"
    # else:
    try:
        movie_search = imdb.search_movie(title=title_with_year, _episodes=False)
    except IMDbError as e:
        print("Movie search failed with", e, "Rerunning.")
        time.sleep(60)
        movie_search = imdb.search_movie(title=title_with_year, _episodes=False)
    movie_search_list = []
    for search_result in movie_search:
        try:
            kind_movie = imdb.get_movie(search_result.movieID)["kind"]
            if kind_movie == "movie":
                movie_search_list.append(search_result)
                print(f"Added an option titled '{search_result}' the list from the search results.")
                break
        except:
            print(f"Discarded an option titled '{search_result}' from the search results.")
    print("Search complete.")
    try:
        movie_id = movie_search_list[0].movieID
        return movie_id
    except Exception as e:
        need_qc.append(title_with_year)
        print(e, "No movies returned in the list.", title_with_year, "needs to be rerun")


def get_movie_data_for_compiler(imdb, movie_id, votes):
    print("Beginning data scraper")

    movie = imdb.get_movie(movieID=movie_id, info=['main'])
    base_url = f'https://www.imdb.com/title/tt{movie_id}/'

    data_errors = [f"ERROR REPORT FOR {movie}:"]

    directors = []
    try:
        director_query = movie.get('director')
        directors.extend([d.get('name').replace(".", "") for d in director_query if d['name'] is not None])
    except:
        data_errors.append(("Need to manually grab directors for", movie))

    robert_bool = True if "Robert Wiene" in directors else False
    tobe_bool = True if "Tobe Hooper" in directors else False
    michele_bool = True if "Michele Soavi" in directors else False
    craven_bool = True if "Wes Craven" in directors else False

    title = movie.get('title')

    genres = []
    try:
        genres.extend(movie.get('genres'))
    except:
        data_errors.append("Need to manually grab genres")
    genre_bool = True if "Comedy" in genres else False

    cast = []
    try:
        cast_query = movie.get('cast')
        cast.extend([a['name'] for a in cast_query if a['name'] is not None])
    except:
        data_errors.append("Need to manually grab cast")
    cast_bool = True if "Donald Sutherland" in cast else False

    countries = []
    try:
        countries.extend(movie.get('countries'))
    except:
        data_errors.append("Need to manually grab countries")
    india_bool = True if "India" in countries else False
    italy_bool = True if "Italy" in countries else False

    languages = []
    try:
        languages.extend(movie.get('languages'))
    except:
        data_errors.append("Need to manually grab languages")

    year = 0
    try:
        year += movie.get('year')
    except:
        data_errors.append("Need to manually grab year")
    bool_2011 = True if year == 2011 else False
    bool_1984 = True if year == 1984 else False
    decade = (year // 10) * 10

    production_companies = []
    try:
        production_company_query = movie.get('production companies')
        if production_company_query is not None:
            production_companies.extend([c['name'] for c in production_company_query if c['name'] is not None])
    except:
        data_errors.append("Need to manually grab production companies")
    new_world_bool = True if "New World Pictures" in production_companies else False

    connections = []
    try:
        franchise_url_substr = 'movieconnections/'
        franchise_req = requests.get(base_url + franchise_url_substr, headers=headers)
        franchise_soup = BeautifulSoup(franchise_req.content, 'html.parser')
        followed_by_scrape = franchise_soup.select('div[data-testid="sub-section-followed_by"] a')
        followed_by = [a.text for a in followed_by_scrape]
        following_scrape = franchise_soup.select('div[data-testid="sub-section-follows"] a')
        following = [a.text for a in following_scrape]
        connections.extend(following)
        connections.extend(followed_by)
    except Exception as e:
        print(e)
        data_errors.append("Need to manually grab connectionss... or movie has none?")

    locations = []
    try:
        locations_url_substr = 'locations/'
        locations_req = requests.get(base_url + locations_url_substr, headers=headers)
        locations_soup = BeautifulSoup(locations_req.content, 'html.parser')
        locations_scrape = locations_soup.select(
            'div[data-testid="sub-section-flmg_locations"] a[data-testid="item-text-with-link"]')
        locations.extend([a.text for a in locations_scrape])
    except Exception as e:
        print(e)
        data_errors.append("Need to manually grab locations")

    keywords = []
    try:
        keywords_url_substr = 'keywords/'
        keywords_req = requests.get(base_url + keywords_url_substr, headers=headers)
        keywords_soup = BeautifulSoup(keywords_req.content, 'html.parser')
        keywords_scrape = keywords_soup.select(
            'div[data-testid="sub-section"] a[class="ipc-metadata-list-summary-item__t"]')
        keywords.extend(a.text for a in keywords_scrape)
    except Exception as e:
        print(e)
        data_errors.append("Need to manually grab keywords")

    versions = []
    try:
        versions_url_substr = 'alternateversions/'
        versions_req = requests.get(base_url + versions_url_substr, headers=headers)
        versions_soup = BeautifulSoup(versions_req.content, 'html.parser')
        versions_scrape = versions_soup.select('div[data-testid="sub-section"] div[class="ipc-html-content-inner-div"]')
        versions.extend([a.text for a in versions_scrape])
    except Exception as e:
        print(e)
        data_errors.append("Need to manually grab keywords")

    data_to_append_to_cache = {"title": title, "genres": genres, "cast": cast, "directors": directors,
                               "production companies": production_companies,
                               "countries": countries, "year": year, "languages": languages, "votes": votes,
                               "movie_score": 0, "fulfilled_categories": [], "starring black woman": False,
                               "worsened by weather": False}

    data_to_append_to_cache_2 = {"title": title, "horror comedy": genre_bool, "Wes Craven": craven_bool,
                                 "Donald Sutherland": cast_bool, "Robert Wiene": robert_bool,
                                 "New World Pictures": new_world_bool, "Michele Soavi": michele_bool,
                                 "Tobe Hooper": tobe_bool, "2011": bool_2011, "1984": bool_1984, "countries": countries,
                                 "Indian": india_bool, "Italian": italy_bool, "year": year, "decade": decade,
                                 "votes": votes, "made in texas": False, "starring black woman": False,
                                 "alternate versions": versions, "locations": locations, "worsened by weather": False,
                                 "connections": connections, "keywords": keywords, "movie_score": 0,
                                 "fulfilled_categories": []}
    print("Data scraping complete.")
    need_qc.append(data_errors)
    return data_to_append_to_cache_2


def add_new_movie_data_to_file(suggested_movies_list):
    print("Beginning Data File Operations.")
    print("-------------------------")
    # Get data from file
    cache_file_reader = open('suggestions_file.txt', 'r')
    data_cache = json.load(cache_file_reader)
    cache_file_reader.close()

    # Re-write data to file after appending new entries
    for movie_suggestion in suggested_movies_list:
        cache_file_writer = open(f'suggestions {datetime.datetime.now().strftime("%H:%M:%S")}.txt', 'w')
        if any(movie_suggestion in cached_movies for cached_movies in data_cache):
            print(movie_suggestion, "already on list. Adding original data back to file.")
            json.dump(data_cache, cache_file_writer, indent=4)
        else:
            print(movie_suggestion, "is not in the cached file. It will need to be queried on iMDB.")
            # title_with_year = movie_suggestion + " " + str(suggested_movies_list[movie_suggestion]['year'])
            title_with_year = movie_suggestion
            # votes = suggested_movies_list[movie_suggestion]['voters']
            # categories = suggested_movies_list[movie_suggestion]['categories']
            imdby = Cinemagoer(results=3, timeout=90)
            # imdb_movie_object = search_for_movie_by_title_year(imdby, title_with_year)
            # if imdb_movie_object is not None:
            data_to_append_to_cache = get_movie_data_for_compiler(imdby, movie_suggestion, votes=[])
            if data_to_append_to_cache is not None:
                data_cache.append(data_to_append_to_cache)
                json.dump(data_cache, cache_file_writer, indent=4)
            else:
                print(data_to_append_to_cache)
                print("Need to QC", movie_suggestion, ", it's data did not get added.")
        cache_file_writer.close()
        print("File closed.")
    print("Operation Complete. Check your file for new data.")


# suggested_movies_from_gsheet = get_group_suggestions_from_google_sheet()
franchise_file = open('../franchise_23:01:57.txt', 'r')
franchise_data = json.load(franchise_file)
add_new_movie_data_to_file(franchise_data)
f = open('qc_needed_new.txt', 'a')
for qcmovie in need_qc:
    f.writelines(str(qcmovie))
f.close()
