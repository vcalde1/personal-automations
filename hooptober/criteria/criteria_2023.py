
hooptober_criteria = {
    "directors": {
        "requirements": {
            "Tobe Hooper": {"count": 1},
            "Mario Bava": {"count": 1},
            ("Brian De Palma", "Wes Craven", "Ken Russell", "Alfred Hitchcock", "Moorhead & Benson"): {"count": 5},
            "Undefined": {"count": 6}},
        "preferences": {}},
    "year": {
        "requirements": {
            (range(2020, 2024), range(2010, 2019), range(1990, 1999), range(1980, 1989),
             range(1970, 1979), range(1960, 1969), range(1950, 1959), range(1940, 1949),
             range(1930, 1939), range(1920, 1929), range(1910, 1919), range(1900, 1909)): {"count": 7},
            2001: {"count": 1}},
        "preferences": {range(2020, 2024): {"weight": 5},
                        range(1980, 1989): {"weight": 5}}},
    "countries": {
        "requirements": {"count": 6},
        "preferences": {}},
    "genres": {
        "requirements": {
            "Post Apocalyptic or Natural Disaster": {"count": 2},
            "Something Underground": {"count": 1},
            "Satan/Devil": {"count": 3},
            "Dracula": {"count": 1, "detail": "worst"},
            "LGBTQ": {"count": 1}},
        "preferences": {}},
    "cast": {
        "requirements": {
            "Robert Englund": {"count": 1},
            "Peter Cushing": {"count": 2}},
        "preferences": {}},
    "title": {
        "requirements": {
            "contains X": {"count": 1}},
        "preferences": {}},
    "production companies": {
        "requirements": {
            "Amicus": {"count": 1}},
        "preferences": {}},
    "story by": {
        "requirements": {"Clive Barker": {"count": 1},
                         "Bram Stoker": {"count": 1}},
        "preferences": {}}
}
