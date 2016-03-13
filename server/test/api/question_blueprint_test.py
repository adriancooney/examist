from server.test import assert_api_error, assert_api_response
from server.model.revision import Revision
from server.model.question import Question

def test_question_get(auth_client, paper_with_course_and_questions):
    paper = paper_with_course_and_questions
    question = paper.questions[0]

    resp = auth_client.get("/course/{code}/paper/{year}/{period}/q/{question}".format(
        code=paper.course.code.lower(), 
        year=paper.year_start,
        period=paper.period.lower(),
        question=".".join(map(str, question.path))
    ))

    with assert_api_response(resp) as data:
        assert "question" in data
        assert "children" in data

def test_question_update(auth_client, session, paper_with_course_and_questions):
    paper = paper_with_course_and_questions
    question = paper.questions[0]

    resp = auth_client.put("/course/{code}/paper/{year}/{period}/q/{question}".format(
        code=paper.course.code.lower(), 
        year=paper.year_start,
        period=paper.period.lower(),
        question=".".join(map(str, question.path))
    ), data={
        "content": "Hello world!",
        "marks": 1238
    })

    with assert_api_response(resp) as data:
        session.refresh(question)
        assert question.revision.content == "Hello world!"
        assert len(question.revisions) > 0
        assert question.marks == 1238
