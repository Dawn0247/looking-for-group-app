import csv
class User():
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password
        assert isinstance(self.id, int), f"User ID must be a int, got {type(self.id)}"
        assert isinstance(self.username, str), f"Username must be a string, got {type(self.username)}"
        assert isinstance(self.password, str), f"Password must be a string, got {type(self.password)}"
    
    @classmethod
    def from_id(cls, id):
        with open('./data/users.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if str(row['id']) == str(id):
                    return cls(int(row['id']), row['username'], row['password'])
        return None

    @classmethod
    def from_username(cls, username):
        with open('./data/users.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['username'] == username:
                    return cls(int(row['id']), row['username'], row['password'])
        return None
