from marshmallow import Schema, fields
from server.library import Assistant

class Example(Assistant):
    foo = 1

    def __init__(self):
        self.foo = "bar"

class Session:
    def one(self):
        return self

    def query(self, model):
        return self

    def filter(self, where):
        assert where
        return self

def test_get_method():
    # Make sure the classmethod exists
    assert bool(Example.getBy)

    session = Session()
    Example.getBy(session, foo=1)