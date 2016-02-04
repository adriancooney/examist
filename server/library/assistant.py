from sqlalchemy.orm.exc import NoResultFound
from fyp.server.exc import NotFound

class Assistant:
    @classmethod
    def get(model, session, **kwargs):
        where = None
        for attr, value in kwargs.iteritems():
            comp = model[attr] == value
            where = comp if not where else where & comp

        try:
            return session.query(model).filter(**where).one()
        except NoResultFound:
            raise NotFound(model.__name__, "%s not found where %s not found." % (model.__name__, str(where)))