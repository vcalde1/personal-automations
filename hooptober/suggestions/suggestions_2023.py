from imdb import Cinemagoer


def movies_data():
    # movie_titles = ['cabin fever', 'as above so below', 'Grave Encounters', 'The Wailing', 'Hidden',
    #                 'The Last Exorcism', 'Sputnik', 'Maniac 2012', 'Sisters 1972', 'Malum', 'The Omen', 'Body Bags',
    #                 'Resolution', 'Onibaba', 'Sleepaway Camp', '[REC]', 'Good Manners', 'Toolbox Murders',
    #                 'Tales from the Crypt 1972', 'The Midnight Meat Train', 'The Curse of Frankenstein',
    #                 'X: The Man with the X-Ray Eyes 1963', 'Asylum', 'The Hills Have Eyes', 'Frenzy',
    #                 'Kill, Baby... Kill!', 'Wolf Creek', 'The Funhouse Massacre', 'The Last House on the Left', 'Crawl',
    #                 'Wendigo', 'Dracula 3D']
    movie_titles = ['The Host 2006', 'Onibaba 1964', 'Eyes Without a Face 1960', 'Black Sunday 1960',
                    'Nosferatu the Vampyre 1979', 'The Devil’s Backbone 2001', 'Freaks 1932',
                    'The Fly 1958', 'Repulsion 1965', 'The Wicker Man 1973',
                    'Hellraiser 1987', 'Candyman 1992', 'Let the Right One In 2008', 'The Witch 2015',
                    'Titane 2021', 'A Quiet Place 2018', '28 Days Later 2002',
                    'A Nightmare on Elm Street 1984', 'The Descent 2005',
                    'The Devil Rides Out 1968', 'Prince of Darkness 1987',
                    'The House That Dripped Blood 1971', 'Dracula 3000 2004',
                    'The Hunger 1983', 'Carrie 1976', 'The Hills Have Eyes 1977',
                    'The Lair of the White Worm 1988', 'Psycho 1960', 'The Endless 2017',
                    'Horror of Dracula 1958', 'The Mummy 1959', 'Bram Stoker’s Dracula 1992',
                    'Hellbound Hellraiser II 1988', 'The Mist 2007', 'Kill, Baby, Kill 1966',
                    'X 2022', 'The Omen 1976', 'Quatermass and the Pit 1967', 'Phenomena 1985',
                    'Nightbreed 1990', 'The Others 2001', 'The Brood 1979']
    suggestions = {}

    imdby = Cinemagoer()

    for m in movie_titles:
        search_movie = imdby.search_movie(m, _episodes=False)
        movie_id = search_movie[0].movieID
        movie = imdby.get_movie(movieID=movie_id, info=['main'])
        directors = [d.get('name') for d in movie.get('director')]
        title = movie.get('title')
        genres = movie.get('genres')
        cast = [a['name'] for a in movie.get('cast')]
        countries = movie.get('countries')
        languages = movie.get('languages')
        year = movie.get('year')
        story_by = [x.get('name') for x in movie.get('writer')]
        production_companies = [c['name'] for c in movie.get('production companies')]
        suggestions[title] = {"genres": genres, "cast": cast, "directors": directors,
                              "production companies": production_companies, "story by": story_by,
                              "countries": countries, "year": year, "languages": languages, "movie_score": 0}

    return suggestions

