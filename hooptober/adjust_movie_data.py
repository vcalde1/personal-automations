import datetime
import json

movie_data_dict = open('suggestions/suggestions 22:55:39.txt', 'r')
movies = json.load(movie_data_dict)

movies_starring_black_women = ['Vampire in Brooklyn', 'The Front Room', 'Ganja & Hess',
                               'Pet Sematary: Bloodlines', 'Scream Blacula Scream', 'Gothika', 'Antebellum']
franchise_nominated = ['Night of the Demons', 'Lake Placid', 'Subspecies', 'Hatchet' 'Piranha', 'House']
# made_in_texas = ['Texas Chainsaw Massacre 2', 'Race with the Devil', 'Bloodsuckers from Outer Space', 'Deadly Blessing', 'The Faculty', 'The Dark and the Wicked', 'Teeth', 'Piranha', 'VFW']
nonnegotiable_movies = ['Lifeforce', 'Genuine: The Tragedy of a Vampire', 'Scream Blacula Scream']
nonnegotiables_data = []
franchise_data = []


def score_for_horror_genre():
    for movie in movies:
        if movie['horror comedy']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Horror comedies")


def score_for_cast():
    for movie in movies:
        if movie['Donald Sutherland']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Donald Sutherland")


def score_for_production_company():
    for movie in movies:
        if movie['New World Pictures']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("New World Pictures")


def score_for_countries():
    for movie in movies:
        if movie['Indian']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Indian")
        elif movie['Italian']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Italian")


def score_for_location():
    for movie in movies:
        if any(x for x in movie['locations'] if "Texas" in x):
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Made in Texas")


def score_for_alternate_versions():
    for movie in movies:
        if len(movie['alternate versions']) > 0:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Alternate versions")


def score_for_directors():
    for movie in movies:
        if movie['Robert Wiene']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Robert Wiene")
        elif movie["Michele Soavi"]:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Michele Soavi")
        elif movie["Tobe Hooper"]:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Tobe Hooper")
        elif movie["Wes Craven"]:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Wes Craven")


def score_for_year():
    for movie in movies:
        movie_decade = (movie['year'] // 10) * 10
        movie['decade'] = movie_decade
        if movie['2011']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("From 2011")
        elif movie['1984']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("From 1984")


# def score_for_languages():
#     for movie in movies:
#         if "None" in movie['languages']:
#             movie['movie_score'] += -1


def score_for_weather():
    for movie in movies:
        if "storm" in movie['keywords']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Worsened by weather")
        elif "weather" in movie['keywords']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Worsened by weather")
        elif "tornado" in movie['keywords']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Worsened by weather")
        elif "snow" in movie['keywords']:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Worsened by weather")


def score_for_franchise():
    for movie in movies:
        if movie['title'] in franchise_nominated:
            movie['movie_score'] += 1
            movie['fulfilled_categories'].append("Horror franchise")
            # for x in movie['connections']:
            #     franchise_data.append(x)


def score_for_votes():
    for movie in movies:
        scored = len(movie['votes']) - 1
        if "Virginia" in movie['votes']:
            scored += 1
        movie['movie_score'] += scored


def score_for_starring_black_woman():
    for movie in movies:
        if movie['title'] in movies_starring_black_women:
            movie['movie_score'] += 1
            movie['starring black woman'] = True
            movie['fulfilled_categories'].append("Starring a black woman")


def score_for_nonnegotiables():
    for movie in movies:
        if movie['title'] in nonnegotiable_movies:
            movie['movie_score'] += 10
            nonnegotiables_data.append({
                'title': movie['title'],
                'fulfilled_categories': movie['fulfilled_categories'],
                'movie_score': movie['movie_score'],
                'countries': movie['countries'],
                'decade': movie['decade'],
                'connections': movie['connections']
            })


def score_movies():
    score_for_horror_genre()
    score_for_franchise()
    score_for_year()
    score_for_weather()
    score_for_alternate_versions()
    score_for_cast()
    score_for_countries()
    score_for_directors()
    score_for_location()
    score_for_production_company()
    score_for_votes()
    score_for_starring_black_woman()
    score_for_nonnegotiables()


score_movies()
listfile = open(f'adjusted_movies_list_{datetime.datetime.now().strftime("%H:%M:%S")}.txt', 'w')
adjusted_data = []
for m in movies:
    score_category = {
        'title': m['title'],
        'fulfilled_categories': m['fulfilled_categories'],
        'movie_score': m['movie_score'],
        'countries': m['countries'],
        'decade': m['decade'],
        'connections': m['connections']
    }
    adjusted_data.append(score_category)
json.dump(adjusted_data, listfile, indent=2)
listfile.close()

# nonnegotiables_listfile = open(f'nonnegotiables_{datetime.datetime.now().strftime("%H:%M:%S")}.txt', 'w')
# json.dump(nonnegotiables_data, nonnegotiables_listfile, indent=2)
# nonnegotiables_listfile.close()

# franchise_listfile = open(f'franchise_{datetime.datetime.now().strftime("%H:%M:%S")}.txt', 'w')
# json.dump(franchise_data, franchise_listfile, indent=2)
# franchise_listfile.close()

movie_data_dict.close()


