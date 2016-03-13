import shutil
from os import path
from server.test import assert_api_error, assert_api_response
from server.config import APP_DOWNLOAD_DIR
from json import dumps, loads

def test_paper_get(auth_client, paper_with_course_and_questions):
    paper = paper_with_course_and_questions
    resp = auth_client.get("/course/{code}/paper/{year}/{period}".format(
        code=paper.course.code.lower(), 
        year=paper.year_start,
        period=paper.period.lower()
    ))

    with assert_api_response(resp) as data:
        assert "paper" in data
        assert "questions" in data
        assert "course" in data

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

# def test_paper_get_html(auth_client, course_with_papers):
#     course = course_with_papers
#     paper = course.papers[0]
#     file_name = path.basename(paper.link).replace(".PDF", "")

#     # Cleanup
#     download_dir = path.join(APP_DOWNLOAD_DIR, file_name)
#     if path.isdir(download_dir):
#         shutil.rmtree(download_dir)

#     resp = auth_client.get("/course/{code}/paper/{year}/{period}.html".format(
#         code=paper.course.code.lower(), 
#         year=paper.year_start,
#         period=paper.period.lower()
#     ))

#     assert "text/html" in resp.headers["Content-Type"]
#     assert resp.status_code == 200
