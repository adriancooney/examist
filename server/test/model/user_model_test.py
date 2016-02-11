from server.model import User, Institution

def test_institution_extration():
    instit = User.extract_domain("a.cooney10@nuigalway.ie")

    assert instit == "nuigalway.ie", "Institution domain incorrect."
