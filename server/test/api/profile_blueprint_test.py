from server.test import assert_api_error
from json import loads

def test_profile_modules_empty(auth_client):
    resp = auth_client.get("/profile/modules")

    assert resp.status_code == 200

    data = loads(resp.get_data())
    assert isinstance(data["modules"], list)
    assert len(data["modules"]) == 0

def test_profile_modules(auth_client, user_with_modules):
    resp = auth_client.get("/profile/modules")

    assert resp.status_code == 200

    data = loads(resp.get_data())
    assert isinstance(data["modules"], list)
    assert len(data["modules"]) == 5
