from server.test import assert_api_error
from server.library.util import find
from json import loads

def test_profile_courses_empty(auth_client):
    resp = auth_client.get("/profile/courses")

    assert resp.status_code == 200

    data = loads(resp.get_data())
    assert isinstance(data["courses"], list)
    assert len(data["courses"]) == 0

def test_profile_courses(auth_client, user_with_courses):
    resp = auth_client.get("/profile/courses")

    assert resp.status_code == 200

    data = loads(resp.get_data())
    assert isinstance(data["courses"], list)
    assert len(data["courses"]) == 5

def test_profile_add_course(auth_client, user, courses, session):
    newModule = courses[0]
    resp = auth_client.patch("/profile/courses", data={ "course": newModule.id })
    assert resp.status_code == 200

    session.refresh(user)
    assert len(user.courses) > 0

def test_profile_add_course_existing(auth_client, user_with_courses, session):
    existingModule = user_with_courses.courses[0]
    resp = auth_client.patch("/profile/courses", data={ "course": existingModule.id })
    assert resp.status_code == 200
    session.refresh(user_with_courses)
    assert len(user_with_courses.courses) == 5

def test_profile_add_course(auth_client, user_with_courses, session):
    existingModule = user_with_courses.courses[0]
    resp = auth_client.delete("/profile/courses", data={ "course": existingModule.id })
    assert resp.status_code == 200
    session.refresh(user_with_courses)
    assert len(user_with_courses.courses) == 4
    assert not find(user_with_courses.courses, lambda mod: mod.id == existingModule.id)