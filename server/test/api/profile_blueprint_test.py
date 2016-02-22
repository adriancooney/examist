from server.test import assert_api_error
from server.library.util import find
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

def test_profile_add_module(auth_client, user, modules, session):
    newModule = modules[0]
    resp = auth_client.patch("/profile/modules", data={ "module": newModule.id })
    assert resp.status_code == 200

    session.refresh(user)
    assert len(user.modules) > 0

def test_profile_add_module_existing(auth_client, user_with_modules, session):
    existingModule = user_with_modules.modules[0]
    resp = auth_client.patch("/profile/modules", data={ "module": existingModule.id })
    assert resp.status_code == 200
    session.refresh(user_with_modules)
    assert len(user_with_modules.modules) == 5

def test_profile_add_module(auth_client, user_with_modules, session):
    existingModule = user_with_modules.modules[0]
    resp = auth_client.delete("/profile/modules", data={ "module": existingModule.id })
    assert resp.status_code == 200
    session.refresh(user_with_modules)
    assert len(user_with_modules.modules) == 4
    assert not find(user_with_modules.modules, lambda mod: mod.id == existingModule.id)