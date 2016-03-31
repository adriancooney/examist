from server.model import Comment
from server.model import Solution

def test_comment_with_entity(session):
    sol = Solution()
    com = Comment(None, sol, None)

    session.add(com)
    session.commit()

def test_comment_with_parent(session):
    sol = Solution()
    parent = Comment(None, sol, None)
    child = Comment(None, sol, None, parent=parent)

    session.add(child)
    session.commit()

    session.refresh(parent)
    assert parent.children