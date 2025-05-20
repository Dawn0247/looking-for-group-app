import csv
import time
from post import Post
from game import Game

def getUserFromFile(user_id):
    with open('./data/users.csv', 'r') as f:
        reader = csv.reader(f)
        next(reader)
        for row in reader:
            if not row: continue
            if row[0] == str(user_id):
                return row
    return None

def getUserByUsername(username):
    with open('./data/users.csv', 'r') as f:
        reader = csv.reader(f)
        next(reader)
        for row in reader:
            if not row: continue
            if row[1] == username:
                return row
    return None

def writeUserToFile(user_id, username, password):
    with open('./data/users.csv', 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([user_id, username, password])

def getGameById(id):
    with open('./data/games.csv', 'r') as f:
        reader = csv.reader(f)
        next(reader)
        for row in reader:
            if not row: continue
            if int(row[0]) == int(id):
                return row[1]
    return None

def getAllPosts():
    posts = []
    with open('./data/posts.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            tags = row['tags']
            if isinstance(tags, str):
                # Always parse as list of ints (IDs)
                tags = [int(tag.strip()) for tag in tags.strip("[]").replace("'", "").split(",") if tag.strip().isdigit()]
            meta = {
                'id': int(row['id']),
                'title': row['title'],
                'description': row['description'],
                'tags': tags,
                'game': int(row['game']),
                'postedBy': int(row['postedBy']),
                'postedAt': int(row['postedAt']),
                'type': int(row['type'])
            }
            posts.append(Post(meta))
    return posts



def getAllGames():
    games = []
    with open('./data/games.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            games.append(Game(int(row['id']), row['name']))

    return games


def getAllActiveGames():
    all_games = getAllGames()
    active_game_ids = set()

    with open('./data/posts.csv', 'r', encoding='utf-8') as posts_file:
        reader = csv.DictReader(posts_file)
        for row in reader:
            active_game_ids.add(int(row['game']))

    active_games = [game for game in all_games if game.id in active_game_ids]

    return active_games

def getEachGamesCount():
    gamesCount = {}
    for post in getAllPosts():
        print(post.game.id, post.type)
        if post.game.id not in gamesCount:
            gamesCount[post.game.id] = [0, 0]
        if post.type == 0:
            gamesCount[post.game.id][0] += 1
        else:
            gamesCount[post.game.id][1] += 1

    return gamesCount
