import logging
from functools import wraps
from flask import current_app
from flask.ext.cache import Cache 

logger = logging.getLogger(__name__)

# Setup the cache. See init.py for attaching to app.
cache = Cache(config=dict(
    CACHE_TYPE="simple"
))

def get_view_func(name):
    return current_app.view_functions.get(name)

def invalidate_view(name, *args, **kwargs):
    cache.delete_memoized(get_view_func(name), *args, **kwargs)

def cache_view(f=None, timeout=None, make_name=None, unless=None):
    def decorator(f):
        logger.debug("Caching view function: %s" % f.__name__)
        return cache.memoize(timeout, make_name, unless)(f)

    if f:
        return decorator(f)
    else:
        return decorator