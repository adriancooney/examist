from server.model import Solution
from server.model import Entity

def test_solution(session):
    sol = Solution()
    session.add(sol)
    session.commit()

    entities = session.query(Entity).all()

    print entities