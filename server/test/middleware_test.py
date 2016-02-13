from server.middleware import middleware

def test_middleware():
    called = [False] # Python 2 doesn't like setting variables in nested scopes

    @middleware
    def my_middleware():
        """middleware"""
        called[0] = True

    @my_middleware
    def my_route(a):
        """route"""
        assert a == 1

    my_route(1)
    assert called[0]