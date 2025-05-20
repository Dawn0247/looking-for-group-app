from post import Post
import helpers
from pprint import pprint as print
import csv

newPost = Post.from_id(3)
print(newPost.to_dict())

posts = helpers.getAllPosts()
print(posts)

activeGames = helpers.getAllActiveGames()
print(activeGames)