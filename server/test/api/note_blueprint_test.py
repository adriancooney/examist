from server.model import NoteLink, NoteUpload
from server.test import assert_api_response
from server.library.util import find

def test_question_create_note(auth_client, paper_with_course_and_questions):
    paper = paper_with_course_and_questions
    course = paper.course
    question = paper.questions[0]

    resp = auth_client.post("/course/{code}/paper/{year}/{period}/q/{question}/note".format(
        code=paper.course.code.lower(), 
        year=paper.year_start,
        period=paper.period.lower(),
        question=".".join(map(str, question.path))
    ), data={
        "link": "http://google.com",
        "description": "Use Google, dumbass."
    })

    with assert_api_response(resp) as data:
        assert "question" in data
        assert "note" in data
        note_data = data["note"]

        assert "id" in note_data
        assert note_data["type"] == "note_link"

def test_question_get_notes(auth_client, paper_with_course_and_questions, session):
    paper = paper_with_course_and_questions
    course = paper.course
    question = paper.questions[0]

    note_link = NoteLink(link="http://foo.com", question=question)
    note_upload = NoteUpload(file_path="/foo/bar", question=question)
    session.add_all([note_link, note_upload])
    session.commit()

    resp = auth_client.get("/course/{code}/paper/{year}/{period}/q/{question}/notes".format(
        code=paper.course.code.lower(), 
        year=paper.year_start,
        period=paper.period.lower(),
        question=".".join(map(str, question.path))
    ))

    with assert_api_response(resp) as data:
        assert "question" in data
        assert "notes" in data
        notes = data["notes"]
        assert len(notes) == 2
        assert find(notes, lambda n: n["type"] == "note_link")
        assert find(notes, lambda n: n["type"] == "note_upload")