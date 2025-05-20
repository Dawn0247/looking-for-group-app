from flask import Flask, json, jsonify, request 
from auth import Auth
from helpers import *
from post import Post
from tag import Tag
import jwt
import time
import csv

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask server!"})

@app.route('/api/login', methods=['POST'])
def post_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    auth = Auth(username=username, password=password)
    response = auth.login()
    if response[1] == 200:
        return jsonify({"token": response[0]['token'], "id": response[0]['id'], "username": response[0]['username']}), 200
    elif response[1] == 404:
        return jsonify({"message": "User not found"}), 404
    elif response[1] == 401:
        return jsonify({"message": "Invalid password"}), 401
    else:
        return jsonify({"message": "Login failed"}), 500

@app.route('/api/register', methods=['POST'])
def post_register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    auth = Auth(username=username, password=password)
    response = auth.register()
    if response[1] == 201:
        return jsonify({"message": response[0]["message"], "token": response[0]["token"], "id": response[0]['id'], "username": response[0]['username']}), 201
    elif response[1] == 409:
        return jsonify({"message": "User already exists"}), 409
    else:
        return jsonify({"message": "Registration failed"}), 500
    
@app.route('/api/user', methods=['GET'])
def get_user():
    authorization = request.headers.get('Authorization')
    if not authorization:
        return jsonify({"message": "Missing token"}), 401
    token = authorization.split(" ")[1]
    try:
        auth = Auth.from_token(token)
        if auth:
            return jsonify({"id": auth.user_id, "username": auth.username}), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = getAllPosts()
    post_type = request.args.get('type')
    post_type = int(post_type) if post_type else None
    post_filter = request.args.get('filter')
    post_filter = [int(x) for x in post_filter.split("~")] if post_filter else []
    filtered_posts = [_post for _post in posts if _post.type == post_type] if post_type in [0,1] else posts
    if post_filter:
        filtered_posts = [_post for _post in filtered_posts if _post.game.id in post_filter]

    return Post.list_to_json(filtered_posts), 200
   # return jsonify(filtered_posts), 200


@app.route('/api/users', methods=['GET'])
def get_users():
    users = []
    with open('./data/users.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            users.append({"id": row['id'], "username": row['username']})
    return jsonify(users), 200

@app.route('/api/games', methods=['GET'])
def get_games():
    active = request.args.get('active')
    active = int(active) if active else 0
    if active:
        games = getAllActiveGames()
    else:
        games = getAllGames()
    print([g.to_dict() for g in games])
    return jsonify([g.to_dict() for g in games]), 200

@app.route('/api/gamescount', methods=['GET'])
def get_games_count():
    return jsonify(getEachGamesCount()), 200

@app.route('/api/makepost', methods=['POST'])
def post_new_post():
    data = request.get_json()
    data['postedAt'] = int(time.time())
    post = Post.new_post(data)
    post.write_to_csv()
    return post.to_json(), 201

@app.route('/api/tags', methods=['GET'])
def get_tags():
    tags = Tag.all()
    return jsonify([t.to_dict() for t in tags]), 200

@app.route('/api/tags', methods=['POST'])
def create_tag():
    data = request.get_json()
    tag_name = data.get('tag')
    if not tag_name:
        return jsonify({'message': 'Tag name required'}), 400
    tag = Tag.create(tag_name)
    return jsonify(tag.to_dict()), 201

if __name__ == '__main__':
    app.run(debug=True)