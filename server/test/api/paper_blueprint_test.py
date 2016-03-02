from server.test import assert_api_error
from json import dumps, loads

def test_paper_get(auth_client, course_with_papers):
    course = course_with_papers
    paper = course.papers[0]
    resp = auth_client.get("/course/{code}/paper/{year}/{period}".format(
        code=paper.course.code.lower(), 
        year=paper.year_start,
        period=paper.period.lower()
    ))
    assert resp.status_code == 200

    data = loads(resp.get_data())["paper"]
    assert data["course_id"]
    assert data["period"]

def test_paper_get_invalid_period(auth_client):
    resp = auth_client.get("/course/{code}/paper/{year}/{period}".format(
        code="CT360", 
        year="2014",
        period="non-period"
    ))

    assert_api_error(resp, 422, meta={"field": "period"})

def test_paper_get_invalid_paper(auth_client, course_with_papers):
    course = course_with_papers
    paper = course.papers[0]
    resp = auth_client.get("/course/{code}/paper/{year}/{period}".format(
        code=course.code, 
        year=2020,
        period=paper.period.lower()
    ))

    assert_api_error(resp, 404, message="Paper not found.")

def test_paper_get_html(auth_client, course_with_papers):
    course = course_with_papers
    paper = course.papers[0]
    resp = auth_client.get("/course/{code}/paper/{year}/{period}.html".format(
        code=paper.course.code.lower(), 
        year=paper.year_start,
        period=paper.period.lower()
    ))

    print resp.get_data()
    assert resp.status_code == 200