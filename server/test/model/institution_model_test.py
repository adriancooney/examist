from server.model import Institution

def test_institution_papers(institution, courses, papers, session):
    course = courses[0]
    institution.courses.append(course)
    session.add(institution)
    session.commit()

    course.papers = papers
    session.add(course)
    session.commit()

    session.refresh(institution)

def test_institution_users(institution, courses, user, session):
    session.refresh(institution)

    course = courses[0]
    user.courses.append(course)
    session.add(user)
    session.commit()