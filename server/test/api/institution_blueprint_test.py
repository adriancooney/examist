from server.test import assert_api_error
from json import dumps, loads

def test_search_no_domain(client):
    assert_api_error(client.get("/institution/search"), 422, meta={"field": "domain"})

def test_search_no_institutions(client):
    resp = client.get("/institution/search?domain=foo.com")

    data = loads(resp.get_data())

    print resp
