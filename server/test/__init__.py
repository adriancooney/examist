from json import loads

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

