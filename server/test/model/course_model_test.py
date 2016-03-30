from server.model import Course
from server.model.question import Similar

def test_question_index(paper_with_course_and_questions, session):
    paper = paper_with_course_and_questions
    course = paper.course

    indexed_questions = course.index_questions()
    session.add_all(indexed_questions)

    print session.query(Similar).all()
