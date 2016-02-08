from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int()
    name = fields.Str(default="")
    email = fields.Email(required=True)
    password = fields.Str(required=True)

    class Meta:
        strict = True