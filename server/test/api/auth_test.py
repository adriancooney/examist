from fyp.server.test import assert_api_error
from json import dumps, loads

def test_login(user, client):
    resp = client.post("/login", data=dumps({
        "email": user.email,
        "password": "root"
    }), content_type="application/json");

    assert resp.status_code == 200

    # Check to see if a session exists for the user
    assert user.sessions[0]

    # Check we have the key returned
    data = loads(resp.get_data())

    assert data["key"] == user.sessions[0].key

def test_login_missing_params(client):
    resp = client.post("/login", content_type="application/json")
    assert_api_error(resp, 422)

def test_login_invalid_email(user, client):
    resp = client.post("/login", data=dumps({
        "email": "unknown@email.com",
        "password": "root"
    }), content_type="application/json");

    assert_api_error(resp, 403, "email")

def test_login_invalid_password(user, client):
    resp = client.post("/login", data=dumps({
        "email": user.email,
        "password": "foo"
    }), content_type="application/json");

    assert_api_error(resp, 403, "Invalid credentials")
