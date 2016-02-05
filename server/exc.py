class HttpException(Exception):
    """General purpose HTTP Exception."""
    def __init__(self, code, message):
        self.code = code
        self.message = message

class NotFound(HttpException):
    """404 Not Found Exception."""
    def __init__(self, entity_name):
        HttpException.__init__(self, 404, "%s not found." % entity_name)

class InvalidRequest(HttpException):
    """400 Invalid Request."""
    def __init__(self, message):
        HttpException.__init__(self, 401, message)

class MissingParameter(InvalidRequest):
    """400 Invalid request, specifically missing parameters."""
    def __init__(self, parameter, type="body"):
        InvalidRequest.__init__(self, "Missing '%s' parameter in request %s" % (parameter, type))

class LoginError(HttpException):
    """403, Bad credentials"""
    def __init__(self, username):
        HttpException.__init__(self, 403, "Login failed. Invalid credentials for '%s'." % username)