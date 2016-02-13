from werkzeug.test import Client, EnvironBuilder
from json import loads, dumps

def assert_api_error(resp, code, message = None, meta = None):
    data = loads(resp.get_data())

    assert resp.status_code == code, "Unexpected status code %r, expected %r" % (resp.status_code, code)
    assert data["error"], "API has not errored."
    
    if message:
        assert data["message"], "API did not return expected message"
        assert message in data["message"], "Error message '%s' does not contain '%s'" % (data["message"], message)

    if meta:
        respMeta = data["meta"]
        for key, value in meta.iteritems():
            assert key in respMeta, "Response meta does not contain expected key '%s'" % key
            assert value == respMeta[key], "Respone meta key value does not contain expected value '%s'" % value

class APIClient(Client):
    default_environ = dict(
        content_type = "application/json"
    )

    def __init__(self, *args, **kwargs):
        self.default_environ = APIClient.default_environ
        return super(APIClient, self).__init__(*args, **kwargs)

    def open(self, *args, **environ):
        # Apply the base environ
        environ["environ_base"] = self.default_environ

        # Convert any data to JSON
        data = environ.get("data", None)

        if data:
            environ["data"] = dumps(data)

        print "\n[CLIENT] ----> %s %s %r" % (environ["method"], args[0] if args[0] else environ["path"], environ.get("data", None))

        # Fix for `content_type` being overridden by Werkzerug (bug)
        # TODO: Report bug to werkzeug repo.
        if not environ.get("content_type", None):
            environ["content_type"] = self.default_environ.get("content_type", None)

        # Call the open on the Werkzeug client
        return super(APIClient, self).open(*args, **environ)