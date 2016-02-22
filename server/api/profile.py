from flask import Blueprint, g, request
from webargs import fields
from webargs.flaskparser import parser
from server import model
from server.library.util import find
from server.database import db
from server.response import respond, fail, success
from server.middleware import authorize
from server.library.schema import schema
from server.exc import NotFound, UnacceptableParameter

Profile = Blueprint("Profile", __name__)

moduleSchema = schema(model.Module)

# Add via ID
patchParams = { "module": fields.Int(required=True) }

@Profile.route("/profile/modules/", methods=["GET", "PATCH", "DELETE"], strict_slashes=False)
@authorize
def get_and_update_modules():
    if request.method == "GET":
        # Return the user's modules
        return respond({ 
            "modules": moduleSchema.dump(g.user.modules, many=True).data
        })
    else:
        args = parser.parse(patchParams, request)
        id = args["module"]

        try:
            module = model.Module.getBy(db.session, id=id)
        except NotFound:
            return UnacceptableParameter("Module with id '%d' does not exist." % id)

        # Find the module
        userModule = find(g.user.modules, lambda mod: mod.id == module.id)

        if request.method == "PATCH":
            # Patch request i.e. append to the collection
            # Ensure it's not already in the users modules
            if userModule:
                return success() # Ignorance is bliss

            # Add the module
            g.user.modules.append(module)
        else:
            # Delete the module from the collection
            # Ensure we have the module
            if not userModule:
                return success()
            
            # Remove the module
            g.user.modules.remove(userModule)

        db.session.add(g.user)
        db.session.commit()
        return success()