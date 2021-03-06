class HttpException(Exception):
    """General purpose HTTP Exception."""
    def __init__(self, code, message, meta=None):
        self.code = code
        self.message = message
        self.meta = meta

class NotFound(HttpException):
    """404 Not Found Exception."""
    def __init__(self, entity_name="Item", fields=None):
        HttpException.__init__(self, 404, "%s not found." % entity_name, { 
            "entity": entity_name,
            "fields": fields
        })

class InvalidRequest(HttpException):
    """400 Invalid Request."""
    def __init__(self, message, meta=None):
        HttpException.__init__(self, 400, message, meta)

class MissingParameter(InvalidRequest):
    """400 Invalid request, specifically missing parameters."""
    def __init__(self, parameter, type="body"):
        InvalidRequest.__init__(self, "Missing '%s' parameter in request %s" % (parameter, type), {
            "parameter": parameter,
            "type": type
        })

class Forbidden(HttpException):
    """403 Forbidden."""
    def __init__(self, reason):
        HttpException.__init__(self, 403, "Operation is forbidden.", {
            "reason": reason
        })

class UnacceptableParameter(HttpException):
    """403 Invalid parameter, valid parameter found but unacceptable"""
    def __init__(self, parameter, reason):
        HttpException.__init__(self, 403, "Unacceptable value for '%s' parameter. %s", {
            "parameter": parameter
        })

class LoginError(HttpException):
    """403, Bad credentials"""
    def __init__(self, username):
        HttpException.__init__(self, 403, "Login failed. Invalid credentials for '%s'." % username, {
            "username": username    
        })

class Unauthorized(HttpException):
    """401, Unauthorized"""
    def __init__(self):
        HttpException.__init__(self, 401, "Unauthorized.")

class AlreadyExists(HttpException):
    """409, Conflict"""
    def __init__(self, entity, key, value):
        message = "%s already exists" % (entity)
        meta = { "entity": entity }

        if key and value:
            message += " with %s '%s'" % (key, value)
            meta["key"] = key
            meta["value"] = value

        HttpException.__init__(self, 409, message + ".", meta)

class InvalidEntity(HttpException):
    """422 Unprocessable Entity, specifically entity does not exist."""
    def __init__(self, entity, field, id):
        HttpException.__init__(self, 422, "%s with %s '%s' does not exist." % (entity, field, id), {
            "entity": entity,
            "field": field,
            "id": id    
        })

class InvalidEntityField(InvalidRequest):
    def __init__(self, field_name):
        InvalidRequest.__init__(self, "Invalid value for field '%s'." % field_name)