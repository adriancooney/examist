from json import loads

def assert_api_error(resp, code, message = None):
    data = loads(resp.get_data())

    assert resp.status_code == code, "Unexpected status code %r, expected %r" % (resp.status_code, code)
    assert data["error"], "API has not errored."
    
    if message:
        assert message in data["message"], "Error message does not contain '%s'" % message