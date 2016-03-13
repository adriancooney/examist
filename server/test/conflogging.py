import logging
import sys
import math
import pytest
from textwrap import wrap
from termcolor import colored

# Show the SQL Alchemy output for fixtures
SHOW_FIXTURE_SQLALCHEMY_OUTPUT = False

SQLA_LOGGER_NAME = "sqlalchemy.engine.base.Engine"
TEST_LOGGER_NAME = "server.test.conftest"

def set_formatter(logger, fmt):
    handler = logging.StreamHandler(sys.stdout)
    fmt = logging.Formatter(fmt)
    handler.setFormatter(fmt)
    logger.addHandler(handler)
    return handler

def setup_logging():
    # Setup the Root logger to output to stdout
    logging.basicConfig(format=colored("\n[%(levelname)s] %(name)s:\n\n", color="magenta") + "%(message)s", stream=sys.stdout, level=logging.INFO)

    # SQL Alchemy
    sqla = logging.getLogger(SQLA_LOGGER_NAME)
    sqla.addFilter(SQLFilter())
    sqla.propagate = False
    handler = set_formatter(sqla, colored("\n[%(levelname)s] %(name)s:", color="green") + " %(message)s")

    # We set it to critical initially because we don't want to
    # see the initial fixture setup (session scoped) output from
    # sqlalchemy. We show the test output when we set the logging
    # level to INFO right before each test the reset it to CRITICAL
    # thereafter. See py.test hooks in conftest.
    if not SHOW_FIXTURE_SQLALCHEMY_OUTPUT:
        handler.setLevel(logging.CRITICAL) 

    # Testing output
    test = logging.getLogger(TEST_LOGGER_NAME)
    test.propagate = False
    set_formatter(test, colored("%(message)s", color="cyan"))
    
def dash(length=25):
    return "-" * 25

class SQLFilter(logging.Filter):
    def __init__(self, term_width=100):
        self.term_width = term_width

    def filter(self, record):
        if record.msg == "%r":
            record.msg = colored(record.msg, color="blue")
        else:
            record.msg = colored("\n\n" + self.format_sql(record.msg), color="yellow")

        return True

    def format_sql(self, sql):
        lines = wrap(sql, width=self.term_width)
        lines = map(SQLFilter.indent, lines)
        return "\n".join(lines)

    @staticmethod
    def indent(line, size=1):
        return "\t"*size + line