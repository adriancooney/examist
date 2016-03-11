from server.test import assert_api_error, assert_api_response
from json import dumps, loads

def test_course_search_no_query(auth_client):
    assert_api_error(auth_client.get("/course/search"), 422, meta={"field": "q"})

def test_course_search_no_login(client):
    assert_api_error(client.get("/course/search?q=foo"), 401)

def test_course_search_empty(auth_client, courses):
    resp = auth_client.get("/course/search?q=Ridiculous+query")

    with assert_api_response(resp) as data:
        assert len(data["courses"]) == 0

def test_course_search(auth_client, courses):
    resp = auth_client.get("/course/search?q=computer+security")

    with assert_api_response(resp) as data:
        assert len(data["courses"]) > 0

def test_course_get(auth_client, course_with_papers):
    course = course_with_papers
    resp = auth_client.get("/course/" + course.code.lower())

    with assert_api_response(resp) as data:
        co = data["course"]
        assert co
        assert co["id"] == course.id
        assert len(co["papers"]) == 5

def test_course_get_not_found(auth_client):
    resp = auth_client.get("/course/foobar")
    assert_api_error(resp, 404)