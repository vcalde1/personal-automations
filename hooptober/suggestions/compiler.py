import datetime
import json
import random

night_of_demons_picked = [
    {
        "title": "Night of the Demons 2",
        "fulfilled_categories": [
            "Horror comedies",
            "Alternate versions"
        ],
        "movie_score": 2,
        "countries": [
            "United States"
        ],
        "decade": 1990,
        "connections": [
            "Night of the Demons",
            "Night of the Demons III"
        ]
    },
    {
        "title": "Night of the Demons III",
        "fulfilled_categories": [
            "Alternate versions"
        ],
        "movie_score": 1,
        "countries": [
            "Canada"
        ],
        "decade": 1990,
        "connections": [
            "Night of the Demons",
            "Night of the Demons 2"
        ]
    },
    {
        "title": "Night of the Demons (remake)",
        "fulfilled_categories": [
            "Horror comedies",
            "Horror franchise",
        ],
        "movie_score": 2,
        "countries": [
            "United States"
        ],
        "decade": 2000,
        "connections": []
    }
]

piranha_picked = [
    {
        "title": "Piranha 3D",
        "fulfilled_categories": [
            "Horror comedies"
        ],
        "movie_score": 1,
        "countries": [
            "France",
            "Japan",
            "United States"
        ],
        "decade": 2010,
        "connections": [
            "Piranha 3DD"
        ]
    },
    {
        "title": "Piranha 3DD",
        "fulfilled_categories": [
            "Horror comedies"
        ],
        "movie_score": 1,
        "countries": [
            "Japan",
            "United States"
        ],
        "decade": 2010,
        "connections": [
            "Piranha 3D"
        ]
    },
    {
        "title": "Piranha (Remake TV Movie)",
        "fulfilled_categories": [],
        "movie_score": 0,
        "countries": [
            "Japan",
            "United States"
        ],
        "decade": 1990,
        "connections": []
    }
]

subspecies_picked = [
    {
        "title": "Bloodstone: Subspecies II",
        "fulfilled_categories": [],
        "movie_score": 0,
        "countries": [
            "Romania",
            "United States"
        ],
        "decade": 1990,
        "connections": [
            "Subspecies",
            "Bloodlust: Subspecies III",
            "Subspecies 4: Bloodstorm",
            "Subspecies V: Bloodrise"
        ]
    },
    {
        "title": "Bloodlust: Subspecies III",
        "fulfilled_categories": [],
        "movie_score": 0,
        "countries": [
            "Romania",
            "United States"
        ],
        "decade": 1990,
        "connections": [
            "Subspecies",
            "Bloodstone: Subspecies II",
            "Subspecies 4: Bloodstorm",
            "Subspecies V: Bloodrise"
        ]
    },
    {
        "title": "Subspecies 4: Bloodstorm",
        "fulfilled_categories": [
            "Alternate versions"
        ],
        "movie_score": 1,
        "countries": [
            "Romania",
            "United States"
        ],
        "decade": 1990,
        "connections": [
            "Subspecies",
            "Bloodstone: Subspecies II",
            "Bloodlust: Subspecies III",
            "Subspecies V: Bloodrise"
        ]
    },
    {
        "title": "Subspecies V: Bloodrise",
        "fulfilled_categories": [],
        "movie_score": 0,
        "countries": [
            "Romania",
            "United States"
        ],
        "decade": 2020,
        "connections": [
            "Subspecies",
            "Bloodstone: Subspecies II",
            "Bloodlust: Subspecies III",
            "Subspecies 4: Bloodstorm"
        ]
    }
]

house_picked = [
  {
    "title": "House III: The Horror Show",
    "fulfilled_categories": [
      "Alternate versions"
    ],
    "movie_score": 0,
    "countries": [
      "United States"
    ],
    "decade": 1980,
    "connections": [
      "House",
      "House II: The Second Story",
      "House IV"
    ]
  },
  {
    "title": "House IV",
    "fulfilled_categories": [
      "Alternate versions"
    ],
    "movie_score": 0,
    "countries": [
      "United States"
    ],
    "decade": 1990,
    "connections": [
      "House",
      "House II: The Second Story",
      "House III: The Horror Show"
    ]
  },
  {
    "title": "House II: The Second Story",
    "fulfilled_categories": [
      "Horror comedies",
      "Alternate versions",
      "New World Pictures"
    ],
    "movie_score": 2,
    "countries": [
      "United States"
    ],
    "decade": 1980,
    "connections": [
      "House",
      "House III: The Horror Show",
      "House IV"
    ]
  }
]

# Inputs
non_negotiable_file = open(f'../nonnegotiables_10:23:02.txt', 'r')
non_negotiable_movies = json.load(non_negotiable_file)
criteria = [
    {"name": "Horror comedies", "required": 2, "fulfilled": 0},
    {"name": "8 Decades", "required": 8, "fulfilled": 0},
    {"name": "6 Countries", "required": 6, "fulfilled": 0},
    {"name": "Wes Craven", "required": 1, "fulfilled": 0},
    {"name": "Horror franchise", "required": 1, "fulfilled": 0},
    {"name": "Worsened by weather", "required": 1, "fulfilled": 0},
    {"name": "New World Pictures", "required": 3, "fulfilled": 0},
    {"name": "Starring a black woman", "required": 1, "fulfilled": 0},
    {"name": "Donald Sutherland", "required": 1, "fulfilled": 0},
    {"name": "Indian", "required": 2, "fulfilled": 0},
    {"name": "Italian", "required": 4, "fulfilled": 0},
    {"name": "Made in Texas", "required": 2, "fulfilled": 0},
    {"name": "Alternate versions", "required": 1, "fulfilled": 0},
    {"name": "Robert Wiene", "required": 1, "fulfilled": 0},
    {"name": "Michele Soavi", "required": 1, "fulfilled": 0},
    {"name": "From 1984", "required": 1, "fulfilled": 0},
    {"name": "From 2011", "required": 1, "fulfilled": 0},
    {"name": "Tobe Hooper", "required": 1, "fulfilled": 0}
]
print("Starting unfulfilled criteria count:", [sum([c['required'] - c['fulfilled'] for c in criteria])])
criteria_names = [crit['name']for crit in criteria]

movies_file = open(f'../adjusted_movies_list_16:56:02.txt', 'r')
movies_pool = json.load(movies_file)
movies = [x for x in movies_pool]
random.shuffle(movies)
# print(movies)
# print("Starting movie pool:", [movie['title'] for movie in movies])
# print("Starting movie pool length:", len(movies))

# Track decades and countries
decades_fulfilled = set()
countries_fulfilled = set()

# Initialize the selected movie list and criteria
selected_movies = []
selected_movies.extend(non_negotiable_movies)
selected_movies.extend(house_picked)

# completed_categories = []
# selection_pool = [movie_option for movie_option in movies]
# print(selection_pool)
# print(len(selection_pool))

# while len(selected_movies) < 32:
#     print(len(selected_movies))
#     # print(selected_movies)
#     print(selection_pool)
#     for mov in selection_pool:
#         print(movies)
#         country_to_add = []
#         decade_to_add = []
#         categoreis_to_add = []
#         # is the movie decade already fulfilled?
#         if mov['decade'] in decades_fulfilled:
#             print("decade already fulfilled")
#             pass
#         else:
#             print("added decade to list")
#             decade_to_add.append(mov['decade'])
#         # is the movie country already fulfilled?
#         for country in mov['countries']:
#             if country in countries_fulfilled:
#                 print("country already fulfilled")
#                 pass
#             else:
#                 print("added country to list")
#                 country_to_add.append(country)
#         # does it fulfill any categories?
#         for categ in mov['fulfilled_categories']:
#             if categ not in completed_categories:
#                 print("added category to list")
#                 categoreis_to_add.append(categ)
#         if any([len(country_to_add) == 0, len(decade_to_add) == 0, len(categoreis_to_add) == 0]):
#             print("removed movie from pool")
#             if mov in selection_pool:
#                 selection_pool.remove(mov)
#         else:
#             if "Horror franchise" in mov['fulfilled_categories']:
#                 if "Subspecies" in mov['title']:
#                     # run loop on movies in franchise and return results
#                     # discard movie if other movies in the franchise do not do anything
#                     pass
#                 elif "House" in mov['title']:
#                     pass
#                 elif "Demon" in mov['title']:
#                     pass
#                 elif "Piranha" in mov['title']:
#                     pass
#             else:
#                 print("selected movie")
#                 selected_movies.append(mov)
#                 selection_pool.remove(mov)
#                 decades_fulfilled.add(decade_to_add[0])
#                 for country_add in country_to_add:
#                     countries_fulfilled.add(country_add)
#                 for category_add in categoreis_to_add:
#                     completed_categories.append(category_add)


# Step 1: Include the non-negotiable movie

# print("Selected movies after adding non-negotiable movies:", [s['title'] for s in selected_movies])
non_negot_titles = [title['title'] for title in non_negotiable_movies]
# Remove the movies added from the movie pool
movie_to_remove = next(m for m in movies if m['title'] in non_negot_titles)
movies.remove(movie_to_remove)
# print("Movie pool after removing non-negotiable movies:", [movie['title'] for movie in movies])
# print("Pool length:", len(movies))

# Update decades and countries
for nnm_movie_data in non_negotiable_movies:
    nnm_movie_decade = nnm_movie_data['decade']
    if nnm_movie_decade not in decades_fulfilled:
        decades_fulfilled.add(nnm_movie_decade)
    nnm_movie_countries = nnm_movie_data['countries']
    for nnm_country in nnm_movie_countries:
        if nnm_country not in countries_fulfilled:
            countries_fulfilled.add(nnm_country)
# print("Updated decades fulfilled after non-negotiable movies added:", decades_fulfilled)
# print("Updated countries fulfilled after non-negotiable movies added:", countries_fulfilled)

# Update criteria fulfillment with the non-negotiable movie
for nnm in non_negotiable_movies:
    for nnm_criteria in nnm['fulfilled_categories']:
        criteria_to_adjust = next(c for c in criteria if c['name'] == nnm_criteria)
        criteria_to_adjust['fulfilled'] += 1

criteria[1]['fulfilled'] = len(decades_fulfilled)
criteria[2]['fulfilled'] = len(countries_fulfilled)

# print("Updated criteria after non-negotiable movies added:", criteria)
# print("Unfulfilled criteria count:", [sum([c['required'] - c['fulfilled'] for c in criteria])])


# Step 2: Continue with the iterative selection for remaining movies
while len(selected_movies) < 31 and any(c['fulfilled'] < c['required'] for c in criteria):
    best_movie = {"title": ""}
    best_score = 0
    for movie in movies:
        print(f"STARTING {movie['title']}")
        print([c['fulfilled'] < c['required'] for c in criteria])
        # Calculate how many unfulfilled criteria this movie meets
        score = movie['movie_score']
        # print("Starting movie score:", score)
        for crit in criteria:
            unfulfilled_count = crit['required'] - crit['fulfilled']
            if unfulfilled_count > 0:
                matches_unfulfilled_criteria = any([movie_criteria == crit['name'] for movie_criteria in movie['fulfilled_categories']])
                if matches_unfulfilled_criteria:
                    score += movie['movie_score'] * unfulfilled_count
                    print(f"PROCESSED CRITERIA FOR {movie['title']}")

        # Factor in decades and countries
        movie_countries = movie['countries']
        movie_decade = movie['decade']

        for movie_country in movie_countries:
            if movie_country not in countries_fulfilled:
                score += movie["movie_score"] * 1.5  # Extra movie_score for new country
        # print(f"Updated {movie['title']} score after countries factored in:", score)

        if movie_decade not in decades_fulfilled:
            score += movie["movie_score"] * 1.5  # Extra movie_score for new decade
        # print(f"Updated {movie['title']} score after decades factored in:", score)

#         # Adjust score for franchises
#         franchise_size = 1 + len(movie["connections"])
#         score /= franchise_size

        # Check if this movie should be selected
        # print("Current best movie:", best_movie['title'])
        # print("Current best score:", best_score)
        if score > best_score:
            print(f"{movie['title']} won best score")
            best_movie = movie
            best_score = score
            # print("New best movie:", best_movie['title'])
            # print("New best score:", best_score)
            if best_movie not in selected_movies:
                selected_movies.append(best_movie)
                print("Updated selected movies length:", len(selected_movies))
                # Remove the movies added from the movie pool
                movies.remove(best_movie)
                print("Updated movie pool length:", len(movies))
                # Update decades and countries
                for country in movie_countries:
                    countries_fulfilled.add(country)
                if movie_decade not in decades_fulfilled:
                    decades_fulfilled.add(movie_decade)
            # print(f"Updated decades fulfilled after best movie ({best_movie['title']}) added:", decades_fulfilled)
            # print(f"Updated countries fulfilled after best movie ({best_movie['title']}) added:", countries_fulfilled)

            # Update criteria fulfillment
                for movie_criteria in movie['fulfilled_categories']:
                    criteria_to_adjust = next(c for c in criteria if c['name'] == movie_criteria)
                    print("adjusting", criteria_to_adjust['name'])
                    criteria_to_adjust['fulfilled'] += 1

                criteria[1]['fulfilled'] = len(decades_fulfilled)  # decades criteria
                criteria[2]['fulfilled'] = len(countries_fulfilled)  # countries criteria

                print(f"Updated criteria after best movie ({best_movie['title']}) added:", criteria)
                print("Updated unfulfilled criteria bool:", all(c['fulfilled'] > c['required'] for c in criteria))
        else:
            print(f"{movie['title']} was not selected as best movie for this round")
    #     if all(c['fulfilled'] > c['required'] for c in criteria):
    #         break
    # else:
    #     continue  # only executed if the inner loop did NOT break
    # break  # only executed if the inner loop DID break


            # If the movie is part of a franchise, add all related movies
            # if "Horror franchise" in best_movie['fulfilled_categories']:
            #     print("here", criteria[4]['fulfilled'])
            #     print(criteria[4]['required'])
            #     print(criteria[4]['fulfilled'] < criteria[4]['required'])
            #     if criteria[4]['fulfilled'] < criteria[4]['required']:
            #         franchise_movies = []
            #         if 'Subspecies' in best_movie['title']:
            #             franchise_movies.extend(subspecies_picked)
            #         elif 'Piranha' in best_movie['title']:
            #             franchise_movies.extend(piranha_picked)
            #         elif 'Demon' in best_movie['title']:
            #             franchise_movies.extend(night_of_demons_picked)
            #         elif 'House' in best_movie['title']:
            #             franchise_movies.extend(house_picked)
            #         for franchise_movie in franchise_movies:
            #             selected_movies.append(franchise_movie)
            #             # Update criteria and decades/countries for these movies as well
            #             franchise_movie_countries = set(x for x in franchise_movie['countries'] for franchise_movie in franchise_movies)
            #             franchise_movie_decades = set(franchise_movie['decade'] for franchise_movie in franchise_movies)
            #             for fm_country in franchise_movie_countries:
            #                 countries_fulfilled.add(fm_country)
            #             for fm_decade in franchise_movie_decades:
            #                 decades_fulfilled.add(fm_decade)
            #             print("Updated decades fulfilled after other movies in the franchise added:", decades_fulfilled)
            #             print("Updated countries fulfilled after other movies in the franchise added:", countries_fulfilled)
            #
            #             # Update criteria fulfillment
            #             for fm_criteria in franchise_movie['fulfilled_categories']:
            #                 criteria_to_adjust = next(c for c in criteria if c['name'] == fm_criteria)
            #                 criteria_to_adjust['fulfilled'] += 1
            #
            #             criteria[1]['fulfilled'] = len(decades_fulfilled)  # decades criteria
            #             criteria[2]['fulfilled'] = len(countries_fulfilled)  # countries criteria
            #
            #             print("Updated criteria after other movies in franchise added:", criteria)
            #             print("Updated unfulfilled criteria count:",
            #                   [sum([c['required'] - c['fulfilled'] for c in criteria])])

# Output the list of selected movies
final_list = []
# final_list_exp = []
for movie in selected_movies:
    final_list.append(movie["title"])
    # final_list_exp.append(movie)
print("FINAL LIST LENGTH", len(final_list))
# if len(final_list) == 31:
final_list_file = open(f'../final_2024_lists/final_list {datetime.datetime.now().strftime("%H:%M:%S")}.txt', 'w')
json.dump([final_list, criteria], final_list_file, indent=2)
final_list_file.close()
# else:
#     print("rerun it")
# print(selected_movies)
# print(len(selected_movies))
