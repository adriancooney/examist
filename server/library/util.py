from functools import wraps

def middleware(middlewareFunc):
    """Simple function to abstract the middleware decoration process. This function itself
    is a decorator to create middleware. Example:

        @middleware
        def authorize():
            # Do middlewary stuff
            pass

        @app.route("/")
        @authorize
        def my_route(my_args):
            pass

    """
    @wraps(middlewareFunc)
    def middlewareDecorater(viewFunc):

        @wraps(viewFunc)
        def viewDecorated(*args, **kwargs):
            view = middlewareFunc()

            # Return the middlewares response if any otherwise continue to the route
            return view if view else viewFunc(*args, **kwargs)

        return viewDecorated

    return middlewareDecorater

def find(items, predicate):
    """Simple find in array function. Returns first match."""
    for item in items:
        if predicate(item):
            return item

    return None # Defaults to None

def merge(*dicts):
    assert len(dicts) > 1, "merge: Two or more dicts required to merge."

    # Make a copy of the first dict
    master = dicts[0].copy()

    for di in dicts[1:]:
        # Update the master with each dict thereafter
        master.update(di)

    return master

class classproperty(object):
    def __init__(self, getter):
        self.getter = getter

    def __get__(self, owner_self, owner_cls):
        return self.getter(owner_cls)