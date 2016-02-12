from flask import jsonify
from server.exc import HttpException

def respond(data, code = 200):
    return jsonify(**data) if data else "", code

def success():
    """Return a 200 response with a success message. Useful for actions
    that do not return any data."""
    return respond(None)

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