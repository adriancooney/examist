import json
from os import path
from server.migrations.data import db
from server.model import Paper, Course, Question

# Data generation
with open(path.join(path.dirname(__file__), "../../../data/questions.json")) as data_file:
    data = json.load(data_file)

    paper = data["paper"]
    paper = db.session.query(Paper).filter(
        (Course.code == paper["course"]) & \
        (Paper.course_id == Course.id) & \
        (Paper.year_start == paper["year"]) & \
        (Paper.period == paper["period"])
    ).one()

    questions = []

    def push_question(question_data, index, parent=None):
        content = question_data.get("content", None)
        marks = question_data.get("marks", None)
        index_type = question_data.get("index_type")

        question = Question(paper, index, index_type, parent=parent)

        if content:
            question.set_content(None, content)

        if marks:
            question.marks = marks

        questions.append(question)

        if "questions" in question_data:
            for i, child_question_data in enumerate(question_data["questions"]):
                push_question(child_question_data, i + 1, parent=question)

    for i, question in enumerate(data["questions"]):
        push_question(question, i + 1)

    db.session.add_all(questions)
    db.session.commit()