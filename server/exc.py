class HttpException(Exception):
    """General purpose HTTP Exception."""
    def __init__(self, code, message, meta = None):
        self.code = code
        self.message = message
        self.meta = meta

class NotFound(HttpException):
    """404 Not Found Exception."""
    def __init__(self, entity_name):
        HttpException.__init__(self, 404, "%s not found." % entity_name, { "entity": entity_name })

class InvalidRequest(HttpException):
    """400 Invalid Request."""
    def __init__(self, message):
        HttpException.__init__(self, 401, message)

class MissingParameter(InvalidRequest):
    """400 Invalid request, specifically missing parameters."""
    def __init__(self, parameter, type="body"):
        InvalidRequest.__init__(self, "Missing '%s' parameter in request %s" % (parameter, type), {
            "parameter": parameter,
            "type": type
        })

class LoginError(HttpException):
    """403, Bad credentials"""
    def __init__(self, username):
        HttpException.__init__(self, 403, "Login failed. Invalid credentials for '%s'." % username, {
            "username": username    
        })

class AlreadyExists(HttpException):
    """409, Conflict"""
    def __init__(self, entity, key, value):
        HttpException.__init__(self, 409, "%s already exists with %s '%s'." % (entity, key, value), {
            "entity": entity,
            "key": key,
            "value": value    
        })