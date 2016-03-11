from flask.json import JSONEncoder
from flask.ext.jsontools import JsonResponse
from server.exc import HttpException

def respond(data=None, code = 200):
    return JsonResponse(data, code) if data else ""

__SUCCESS__ = { "success": True }

def success():
    """Return a 200 response with a success message. Useful for actions
    that do not return any data."""
    return respond(__SUCCESS__)

__EMPTY__ = {} # Save allocating one every time no meta exists

def abort(httpException):
    assert isinstance(httpException, HttpException), "Abort response requires HttpException"
    return fail(httpException.code, httpException.message, httpException.meta)

def fail(code, message, meta = None):
    """Return a error object when action fails."""

    return respond({ 
        "error": True, 
        "message": message,
        "meta": meta if meta else __EMPTY__
    }, code)

class DynamicJSONEncoder(JSONEncoder):
    def default(self, o):
        if hasattr(o, "__json__"):
            return o.__json__()

        return super(DynamicJSONEncoder, self).default(o)