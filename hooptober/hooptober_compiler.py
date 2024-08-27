import random
from suggestions.suggestions_2023 import movies_data
from criteria.criteria_2023 import hooptober_criteria


def calculate_movie_score():
    suggested_movies_list = movies_data()
    print(suggested_movies_list)

    for movie in suggested_movies_list:
        print(movie)
        # setting up the data
        score = 0
        pref_score = 1
        for info_bit in suggested_movies_list[movie]:
            if info_bit != "movie_score":
                if info_bit != "year":
                    print("info bit", info_bit)
                    suggested_movie_info_bit = suggested_movies_list[movie][info_bit]
                    print("suggested movie info bit", suggested_movie_info_bit)

                    criteria_info_bit = hooptober_criteria[info_bit]['requirements']
                    criteria_preferences = hooptober_criteria[info_bit]['preferences']
                    print("criteria info bit", criteria_info_bit)
                    print("criteria preferences", criteria_preferences)

                    # preference weight calculation
                    if len(criteria_preferences) > 0:
                        for pref in criteria_preferences:
                            print("pref", pref)
                            if info_bit in pref:
                                pref_score += criteria_preferences[pref]['weight']

                    # score calculation
                    if type(suggested_movie_info_bit) == list:
                        for suggested_bit in suggested_movie_info_bit:
                            print("suggested bit", suggested_bit)
                            for criteria_bit in criteria_info_bit:
                                print("criteria bit", criteria_bit)
                                if suggested_bit in criteria_bit:
                                    score += 10
                                else:
                                    if type(criteria_bit) == tuple:
                                        for x in criteria_bit:
                                            if suggested_bit in x:
                                                score += 10
                    elif type(suggested_movie_info_bit) == int:
                        for criteria_bit in criteria_info_bit:
                            print("criteria bit", criteria_bit)
                            if suggested_movie_info_bit in criteria_bit:
                                score += 10
                            else:
                                if type(criteria_bit) == tuple:
                                    for x in criteria_bit:
                                        if suggested_movie_info_bit in x:
                                            score += 10

                    score *= pref_score
                    suggested_movies_list[movie]['movie_score'] += score
                    print("score", score)
    return suggested_movies_list


print(calculate_movie_score())

#
#
# # Formula to determine if a movie should be included
# def include_movie(movie_score, threshold=20, randomness_factor=0.1):
#     # Calculate a random factor to add some variability
#     random_adjustment = random.uniform(-randomness_factor, randomness_factor)
#     adjusted_score = movie_score + random_adjustment
#
#     # Determine if the movie should be included based on the adjusted score
#     return adjusted_score >= threshold
#
#
# # Build the final Hooptober list using the formula
# final_hooptober_list = []
# for movie in movies:
#     score = calculate_score(movie, criteria)
#
#     # Check if the movie should be included
#     if include_movie(score):
#         final_hooptober_list.append((movie, score))
#
#     # Stop when we have 31 movies
#     if len(final_hooptober_list) == 31:
#         break
#
# # If less than 31 movies are selected, fill the list with random selections
# if len(final_hooptober_list) < 31:
#     remaining_movies = [movie for movie in movies if movie not in [m[0] for m in final_hooptober_list]]
#     random.shuffle(remaining_movies)
#     final_hooptober_list.extend(
#         [(movie, calculate_score(movie, criteria)) for movie in remaining_movies[:31 - len(final_hooptober_list)]])
#
# # Output the final list
# print("Final Hooptober List:")
# for i, (movie, score) in enumerate(final_hooptober_list, 1):
#     print(f"{i}. {movie['title']} - Score: {score}")
#
# # Example output:
# # Final Hooptober List:
# # 1. The Thing - Score: 39
# # 2. Halloween - Score: 34
# # 3. Audition - Score: 25
# # (and so on, until 31 movies)
