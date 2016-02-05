from flask import Blueprint

auth = Blueprint("auth", __name__)

@auth.route("/login", methods=["POST"])
def auth_login():
    """Log a user in."""
    pass

@auth.route("/auth", methods=["POST"])
def auth_test():
    """Test an existing session key to see if it's still valid."""
    pass