import csv, helpers
import time
from flask import jsonify
from game import Game
from user import User
from tag import Tag
from pprint import pprint as pprint

'''
    {
      id: 3,
      title: 'Need DPS for Dungeon',
      description: 'We are running dungeons and need a DPS player. Preferably level 50+.',
      tags: ['MMORPG', 'Dungeon', 'DPS'],
      game: 'Final Fantasy XIV',
      postedBy: 'DungeonMaster',
      postedAt: '2025-05-13 09:15',
    },
'''

class Post():
    def __init__(self, meta):
        self.id = meta['id']
        self.title = meta['title']
        self.description = meta['description']
        # tags: list of tag ids
        self.tags = meta['tags']
        self.game = Game.from_id(int(meta['game']))
        self.postedBy = User.from_id(int(meta['postedBy']))
        self.postedAt = int(meta['postedAt'])
        self.type = meta['type']

        print("\n\n\n\n",meta)

        assert isinstance(self.id, int), f"Post ID must be an integer, got {type(self.id)}"
        assert isinstance(self.title, str), f"Post title must be a string, got {type(self.title)}"
        assert isinstance(self.description, str), f"Post description must be a string, got {type(self.description)}"
        assert isinstance(self.tags, list), f"Post tags must be a list, got {type(self.tags)}"
        assert all(isinstance(tag, int) for tag in self.tags), "All tags must be tag IDs (int)"
        assert isinstance(self.game, Game), f"Post game must be a Game object, got {type(self.game)}"
        assert isinstance(self.postedBy, User), f"Post postedBy must be a User object, got {type(self.postedBy)}"
        assert isinstance(self.postedAt, int), f"Post postedAt must be an integer, got {type(self.postedAt)}"
        assert isinstance(self.type, int), f"Post type must be an integer, got {type(self.type)}"

    @classmethod
    def new_post(cls, meta):
        import csv
        with open('./data/posts.csv', 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            ids = [int(row['id']) for row in reader if row['id'].isdigit()]
            next_id = max(ids) + 1 if ids else 1
        meta = meta.copy()
        meta['id'] = next_id

        return cls(meta)

    @classmethod
    def from_id(cls, id):
        import csv
        with open('./data/posts.csv', 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if str(row['id']) == str(id):
                    tags = row['tags']
                    if isinstance(tags, str):
                        tags = [int(tag.strip()) for tag in tags.strip("[]").replace("'", "").split(",") if tag.strip().isdigit()]
                    meta = {
                        'id': int(row['id']),
                        'title': row['title'],
                        'description': row['description'],
                        'tags': tags,
                        'game': row['game'],
                        'postedBy': row['postedBy'],
                        'postedAt': row['postedAt'],
                        'type': int(row['type'])
                    }
                    return cls(meta)
        return None

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'tags': [Tag.from_id(tag_id).to_dict() for tag_id in self.tags if Tag.from_id(tag_id)],
            'game': self.game.to_dict() if self.game else None,
            'postedBy': {'id': self.postedBy.id, 'username': self.postedBy.username} if self.postedBy else None,
            'postedAt': self.postedAt,
            'type': self.type
        }
    
    def write_to_csv(self):
        import csv
        with open('./data/posts.csv', 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                self.id, self.title, self.description, str(self.tags), self.game.id, self.postedBy.id, self.postedAt, self.type
            ])
    
    def to_json(self):
        return jsonify(self.to_dict())

    @staticmethod
    def list_to_json(posts):
        return jsonify([post.to_dict() for post in posts])



