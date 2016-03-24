from server.model import Question
from server.model import Entity

def test_question(questions, session):
    print questions
    question = Question(None, 1)

    session.add(question)
    session.commit()