import csv
class Game():
    def __init__(self, id, name):
        self.id = id
        self.name = name

        assert isinstance(self.id, int), f"Game ID must be an integer, got {type(self.id)}"
        assert isinstance(self.name, str), f"Game name must be a string, got {type(self.name)}"

    @classmethod
    def from_id(cls, id):
        with open('./data/games.csv', 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if str(row['id']) == str(id):
                    return cls(int(row['id']), row['name'])
        return None
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }
