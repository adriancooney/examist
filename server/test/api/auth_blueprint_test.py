from server.middleware import AUTH_HEADER_NAME
from server.test import assert_api_error
from json import dumps, loads

def test_login(user, client):
    resp = client.post("/login", data={
        "email": user.email,
        "password": "root"
    });

    assert resp.status_code == 200

    # Check we have the key returned and user
    data = loads(resp.get_data())

    # Check to see if a session exists for the user
    assert user.sessions[0]
    assert data["key"] == user.sessions[0].key
    assert data["name"]
    assert data["id"]

def test_login_missing_params(client):
    resp = client.post("/login", data={ "email": "d@a.ie" })
    assert_api_error(resp, 422, meta={"field": "password"})

def test_login_invalid_email(user, client):
    resp = client.post("/login", data={
        "email": "unknown@email.com",
        "password": "root"
    });

    assert_api_error(resp, 403, meta={ "email": "unknown@email.com" })

def test_login_invalid_password(user, client):
    resp = client.post("/login", data={
        "email": user.email,
        "password": "foo"
    });

    assert_api_error(resp, 403, "Invalid credentials")

def test_auth_check_no_key(client):
    resp = client.get("/auth")
    assert_api_error(resp, 422, "Missing", meta={ "field": AUTH_HEADER_NAME })

def test_auth_check_invalid_key(client):
    resp = client.get("/auth", headers=[(AUTH_HEADER_NAME, "INVALID_LOL")])
    assert_api_error(resp, 401, "Unauthorized")

def test_auth_check_expired_key(auth_client, user, session):
    currentSession = user.sessions[0]
    currentSession.active = False

    session.add(currentSession)
    session.commit()

    resp = auth_client.get("/auth")
    assert_api_error(resp, 401, "Unauthorized")

def test_auth_check(auth_client):
    resp = auth_client.get("/auth")
    assert resp.status_code == 200

        # Check we have the key returned and user
    data = loads(resp.get_data())

    # Check to see if a session exists for the user
    assert data["key"] == getattr(auth_client, "key")
    assert data["name"]
    assert data["id"]

