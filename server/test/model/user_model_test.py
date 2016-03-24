from server.model import User, Institution

def test_user_institution_extraction():
    instit = User.extract_domain("a.cooney10@nuigalway.ie")

    assert instit == "nuigalway.ie", "Institution domain incorrect."

def test_user_comment(user, questions, session):
    question = questions[0]
    content = "Hello world!"
    user.comment(question, "Hello world!")
    session.add(user)
    session.commit()

    session.refresh(question)
    assert len(question.comments)
    assert question.comments[0].content == content

def test_user_like(user, questions, session):
    question = questions[0]
    user.like(question)
    session.add(user)
    session.commit()

    session.refresh(question)
    assert len(question.likes)