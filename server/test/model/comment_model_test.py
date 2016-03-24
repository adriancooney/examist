from server.model import Comment
from server.model import Solution

def test_comment_with_entity(session):
    sol = Solution()
    com = Comment(sol)

    session.add(com)
    session.commit()

    session.refresh(com)
    assert com.entity
    assert isinstance(com.entity, Solution)

def test_comment_with_parent(session):
    parent = Comment(None)
    child = Comment(None, parent=parent)

    session.add(child)
    session.commit()

    session.refresh(parent)
    print parent.children