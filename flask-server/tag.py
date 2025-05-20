import csv
class Tag():
    def __init__(self, id, tag):
        self.id = id
        self.tag = tag
        assert isinstance(self.id, int), f"Tag ID must be an integer, got {type(self.id)}"
        assert isinstance(self.tag, str), f"Tag name must be a string, got {type(self.tag)}"

    @classmethod
    def from_id(cls, id):
        with open('./data/tags.csv', 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if str(row['id']) == str(id):
                    return cls(int(row['id']), row['tag'])
        return None

    @classmethod
    def from_name(cls, tag):
        with open('./data/tags.csv', 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['tag'].lower() == tag.lower():
                    return cls(int(row['id']), row['tag'])
        return None

    @classmethod
    def all(cls):
        tags = []
        with open('./data/tags.csv', 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                tags.append(cls(int(row['id']), row['tag']))
        return tags

    @classmethod
    def create(cls, tag):
        # Check if tag already exists
        existing = cls.from_name(tag)
        if existing:
            return existing
        # Find next id
        with open('./data/tags.csv', 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            ids = [int(row['id']) for row in reader if row['id'].isdigit()]
            next_id = max(ids) + 1 if ids else 1
        with open('./data/tags.csv', 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([next_id, tag])
        return cls(next_id, tag)

    def to_dict(self):
        return {
            'id': self.id,
            'tag': self.tag
        }
