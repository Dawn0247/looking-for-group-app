import bcrypt
import jwt
import csv
from helpers import getUserFromFile, getUserByUsername, writeUserToFile

class Auth():
    def __init__(self, user_id=None, username=None, password=None):
        self.user_id = user_id
        self.username = username
        self.password = password

    @classmethod
    def from_token(cls, token):
        decoded_token = jwt.decode(token, 'secret', algorithms=['HS256'])
        user_id = decoded_token['id']
        user = getUserFromFile(user_id)
        if user:
            return cls(user_id=user[0], username=user[1], password=None)
        return None

    @staticmethod
    def encode_token(user_id):
        return jwt.encode({"id": user_id}, 'secret', algorithm='HS256')

    def login(self):
        user = getUserByUsername(self.username)
        if user is None:
            return {"message": "User not found"}, 404
        stored_password = user[2].encode('utf-8')
        if bcrypt.checkpw(self.password.encode('utf-8'), stored_password):
            token = self.encode_token(user[0])
            return {"token": token, "id": user[0], "username": user[1]}, 200
        else:
            return {"message": "Invalid password"}, 401

    def register(self):
        if getUserByUsername(self.username) is None:
            # Find max id and increment
            max_id = 0
            with open('./data/users.csv', 'r') as f:
                reader = csv.reader(f)
                next(reader)
                for row in reader:
                    if row and row[0].isdigit():
                        max_id = max(max_id, int(row[0]))
            new_id = str(max_id + 1)
            hashed_password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt())
            writeUserToFile(new_id, self.username, hashed_password.decode('utf-8'))
            token = self.encode_token(new_id)
            return {"message": "User registered successfully", "token": token, "id": new_id, "username": self.username}, 201
        else:
            return {"message": "User already exists"}, 409


