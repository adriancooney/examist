from server.test import assert_api_error
from json import dumps, loads

def test_institution_search_no_domain(client):
    assert_api_error(client.get("/institution/search"), 422, meta={"field": "domain"})

def test_institution_search_no_institutions(client):
    resp = client.get("/institution/search?domain=foo.com")
    assert_api_error(resp, 404)

def test_institution_search_institution(institution, client):
    resp = client.get("/institution/search?domain=nuigalway.ie")
    assert resp.status_code == 200

    data = loads(resp.get_data())
    assert data["id"] == institution.id

def test_institution_get(institution, client):
    resp = client.get("/institution/" + str(institution.id))
    assert resp.status_code == 200

    data = loads(resp.get_data())
    assert data["id"] == institution.id

def test_institution_get_not_found(institution, client):
    resp = client.get("/institution/24097")
    assert_api_error(resp, 404)