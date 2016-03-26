from server.test import assert_api_response, assert_api_error

def test_comment_create(questions, auth_client):
    question = questions[0]
    content = "Hello world!"

    resp = auth_client.post("/comment/%d" % question.id, data={
        "content": content
    })

    with assert_api_response(resp) as data:
        assert "comment" in data
        comment_data = data["comment"]
        assert comment_data["id"]
        assert comment_data["content"] == content

def test_comment_edit(question_with_comments, auth_client):
    question = question_with_comments
    comment = question.comments[0]
    content = "New hello world!"

    resp = auth_client.put("/comment/%d/%d" % (question.id, comment.id), data={
        "content": content
    })

    with assert_api_response(resp) as data:
        assert "comment" in data
        comment_data = data["comment"]
        assert comment_data["id"] == comment.id
        assert comment_data["content"] == content
        assert comment_data["updated_at"]

def test_comment_update_not_owner(users, second_auth_client, session, questions):
    author = users[0]
    non_author = users[1]
    entity = questions[0]

    comment = author.comment(entity, "Hello world!")
    session.add(comment)
    session.flush()

    resp = second_auth_client.delete("/comment/%d/%d" % (entity.id, comment.id))

    assert_api_error(resp, 401)

def test_comment_delete(question_with_comments, auth_client):
    question = question_with_comments
    comment = question.comments[0]

    resp = auth_client.delete("/comment/%d/%d" % (question.id, comment.id))

    with assert_api_response(resp) as data:
        assert "comment" in data
        comment_data = data["comment"]
        assert comment_data["id"] == comment.id
        assert comment_data["content"] == ""
        assert comment_data["updated_at"]
        assert comment_data["deleted"]

def test_comment_get_all(question_with_comments, auth_client):
    question = question_with_comments

    resp = auth_client.get("/comments/%d" % question.id)

    with assert_api_response(resp) as data:
        assert "comments" in data
        comments_data = data["comments"]