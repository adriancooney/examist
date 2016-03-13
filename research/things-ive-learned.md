# Design Decisions
- Already doing "State of the Art" Javascript before this article came out: https://medium.com/javascript-and-opinions/state-of-the-art-javascript-in-2016-ab67fc68eb0b#.l9enj9385

# Python
- SQL Alchemy.
    - Relationship loading techniques - joined, subquery, immediate
    - `__declare_last__` hook for creating custom schemas.
- Python logging.
    - Root logger.
    - Logger Heirarchy.
- Virtualenv.
    - Virtualenv wrapper extensions.
- Marshmallow python library.
    - Through every piece of document.
    - Looked through entire source.
- chr, ord functions
- py.test
    - `tmpdir` fixture.
    - conftest hooks (before each test is fun)

# API
- JSON API standard.
    - Schema.
    - Poor choice, didn't suit project.

# Continuous Integration
- Codeship.
    - Build notifications.
    - Integration with Github.
    - Build status.
- Importance of making your app environment independant.