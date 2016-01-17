class HttpException(Exception):
    def __init__(self, code, message):
        self.code = code
        self.message = message

class NotFound(HttpException):
    def __init__(self, entity_name):
        HttpException.__init__(self, 404, "%s not found." % entity_name)

class InvalidRequest(HttpException):
    def __init__(self, message):
        HttpException.__init__(self, 401, message)

class MissingParameter(InvalidRequest):
    def __init__(self, parameter, type="body"):
        InvalidRequest.__init__(self, "Missing '%s' parameter in request %s" % (parameter, type))