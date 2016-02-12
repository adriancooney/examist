from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from marshmallow import Schema, fields
from server.library import Assistant

base = declarative_base()

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

def test__schema__():
    class Foo(base, Assistant):
        __tablename__ = "foo"
        a = Column(Integer, primary_key=True)
        b = Column(String)

        def __init__(self):
            self.a = 1
            self.b = 2

    schema = Foo.__schema__(exclude=("a",))
    assert schema

    dump = schema.dump(Foo()).data
    assert dump["b"]
    assert str(type(dump["b"])) == "<type 'unicode'>"
    assert "__DEFAULT__" == getattr(dump, "a", "__DEFAULT__")