from server.test import assert_api_error
from json import dumps, loads

def test_module_search_no_query(auth_client):
    assert_api_error(auth_client.get("/module/search"), 422, meta={"field": "q"})

def test_module_search_no_login(client):
    assert_api_error(client.get("/module/search?q=foo"), 401)

def test_module_search_empty(auth_client, modules):
    resp = auth_client.get("/module/search?q=Ridiculous+query")
    data = loads(resp.get_data())
    assert len(data["modules"]) == 0

def test_module_search(auth_client, modules):
    resp = auth_client.get("/module/search?q=computer+security")
    data = loads(resp.get_data())
    assert len(data["modules"]) > 0

def test_module_get(auth_client, module_with_papers):
    module = module_with_papers
    resp = auth_client.get("/module/" + str(module.id))
    assert resp.status_code == 200

    data = loads(resp.get_data())
    assert data["id"] == module.id
    assert len(data["papers"]) == 5

def test_module_get_not_found(auth_client):
    resp = auth_client.get("/module/24097")
    assert_api_error(resp, 404)