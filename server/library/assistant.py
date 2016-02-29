from sqlalchemy.orm import class_mapper, ColumnProperty
from sqlalchemy.orm.exc import NoResultFound
from server.exc import NotFound
from server.library.util import classproperty
from server.library.schema import create_schema, schema as __schema__

class Assistant:
    @classproperty
    def __schema__(cls):
        cachedSchema = getattr(cls, "__schema__cache__", None)

        if cachedSchema:
            return cachedSchema

        schema = create_schema(cls, getattr(cls, "Meta", {}))
        setattr(cls, "__schema__cache__", schema)
        return schema
    
    @classmethod
    def getBy(model, session, **kwargs):
        print "GET BY: ", kwargs
        where = None
        for attr, value in kwargs.iteritems():
            try:
                print "Comparing attr %s with" % attr, value
                comp = model.__dict__[attr] == value
            except Exception, e:
                raise AttributeError("Attribute '%s' not found on model '%s'." % (attr, model.__name__))                

            where = comp if where is None else where & comp

        try:
            return session.query(model).filter(where).one()
        except NoResultFound:
            raise NotFound(model.__name__, kwargs)

    def dump(self, schema=None, **kwargs):
        if not schema:
            schema = __schema__(self.__class__, **kwargs)

        return schema.dump({ prop.key: getattr(self, prop.key) for prop in class_mapper(self.__class__).iterate_properties 
            if isinstance(prop, ColumnProperty) }).data
