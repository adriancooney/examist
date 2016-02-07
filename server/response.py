from flask import jsonify

def respond(data, code = 200):
    return jsonify(**data) if data else "", code

def success():
    """Return a 200 response with a success message. Useful for actions
    that do not return any data."""
    return respond(None)

def fail(code, message):
    """Return a error object when action fails."""
    return respond({ 'error': True, 'message': message }, code)