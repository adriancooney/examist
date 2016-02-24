from flask import Blueprint
from webargs import fields
from webargs.flaskparser import parser, use_kwargs
from server import model
from server.middleware import authorize
from server.library.schema import schema
from server.database import db
from server.response import respond, success
from server.exc import NotFound, LoginError, AlreadyExists, InvalidEntity

Module = Blueprint("module", __name__)

MODULE_RESULTS_LIMIT = 10

@Module.route("/module/search", methods=["GET"])
@use_kwargs({ "q": fields.Str(required=True) }, locations=("query",))
@authorize
def search_module(q):
    # Replace any + with spaces
    q = q.replace("+", " ")

    # Execute the query
    results = model.Module.query.filter(
        model.Module.name.ilike("%{}%".format(q)) | \
        model.Module.code.ilike("%{}%".format(q)) 
    ).limit(MODULE_RESULTS_LIMIT).all()

    moduleSchema = schema(model.Module)

    return respond({ 
        "modules": moduleSchema.dump(results, many=True).data if len(results) > 0 else []
    })

@Module.route("/module/<module>", methods=["GET"])
@use_kwargs({ "module": fields.Str(required=True) }, locations=("view_args",))
@authorize
def get_module(module):
    module = model.Module.getBy(db.session, code=module.upper())
    dump = module.dump()

    # Add the papers to the schema
    dump["papers"] = schema(model.Paper).dump(module.papers, many=True).data

    return respond({ "module": dump })