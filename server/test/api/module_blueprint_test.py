from server.test import assert_api_error
from json import dumps, loads

def test_course_search_no_query(auth_client):
    assert_api_error(auth_client.get("/course/search"), 422, meta={"field": "q"})

def test_course_search_no_login(client):
    assert_api_error(client.get("/course/search?q=foo"), 401)

def test_course_search_empty(auth_client, courses):
    resp = auth_client.get("/course/search?q=Ridiculous+query")
    data = loads(resp.get_data())
    assert len(data["courses"]) == 0

def test_course_search(auth_client, courses):
    resp = auth_client.get("/course/search?q=computer+security")
    data = loads(resp.get_data())
    assert len(data["courses"]) > 0

def test_course_get(auth_client, course_with_papers):
    course = course_with_papers
    resp = auth_client.get("/course/" + course.code.lower())
    assert resp.status_code == 200

    data = loads(resp.get_data())["course"]
    assert data["id"] == course.id
    assert len(data["papers"]) == 5

def test_course_get_not_found(auth_client):
    resp = auth_client.get("/course/foobar")
    assert_api_error(resp, 404)