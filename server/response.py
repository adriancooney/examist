def respond(code, data):
    pass

def success(message):
    """Return a 200 response with a success message. Useful for actions
    that do not return any data."""
    return respond(200, None)

def fail(code, message):
    """Return a error object when action fails."""
    return respond(code, { 'error': True, 'reason': message })