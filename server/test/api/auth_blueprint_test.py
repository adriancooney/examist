from server.test import assert_api_error
from json import dumps, loads

def test_login(user, client):
    resp = client.post("/login", data=dumps({
        "email": user.email,
        "password": "root"
    }), content_type="application/json");

    assert resp.status_code == 200

    # Check to see if a session exists for the user
    assert user.sessions[0]

    # Check we have the key returned and user
    data = loads(resp.get_data())
    assert data["key"] == user.sessions[0].key
    assert data["name"]
    assert data["id"]

def test_login_missing_params(client):
    resp = client.post("/login", data=dumps({ "email": "d@a.ie" }), content_type="application/json")
    assert_api_error(resp, 422, meta={"field": "password"})

def test_login_invalid_email(user, client):
    resp = client.post("/login", data=dumps({
        "email": "unknown@email.com",
        "password": "root"
    }), content_type="application/json");

    assert_api_error(resp, 403, meta={ "email": "unknown@email.com" })

def test_login_invalid_password(user, client):
    resp = client.post("/login", data=dumps({
        "email": user.email,
        "password": "foo"
    }), content_type="application/json");

    assert_api_error(resp, 403, "Invalid credentials")
