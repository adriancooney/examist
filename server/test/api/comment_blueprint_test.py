from server.test import assert_api_response

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
