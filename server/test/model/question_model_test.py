from server.model import Question
from server.model import Comment
from server.model.question import Similar

def test_question(questions, session):
    print questions
    question = Question(None, 1)

    session.add(question)
    session.commit()

def test_question_aggregates(questions, session):
    question = questions[0]
    comment = Comment(None, question, "Hello world!")
    session.add(comment)

    similar = Similar(question_id=question.id, similar_question_id=questions[1].id, similarity=0.5)
    question.similar.append(similar)
    session.add(similar)
    session.commit()
