# Testability
Testing for me is the foundation of software development. Without it, code is written in fear and defense which makes for an unproductive and wasteful environment. Bugs and regressions can go unnoticed and bite when it's least expected which leads to wasted time down a rabbit hole of git logs and downgrading.

## Backend
The API has a large suite of tests to ensure any changes to models or blueprints don't break anything. Whenever a change is made to any part of the codebase, the entire suite of tests must be run to check each endpoint is returning the data is supposed to. For each endpoint within the app, there is an average of 3 tests that ensure to test three things:

1. **A request with invalid parameters fails.**

   These are usually POST or PUT requests that send data to the server. The body of these requests must follow a strict schema and each field must have the correct data type. This includes parameters within the endpoint's URL itself. These tests are designed for security purposes to prevent SQL injection and meddling with parameters that are not publicly accessible. 

2. **A request with invalid data fails.**

   Again, these are usually POST or PUT requests that send data to the server intending to be processed in some way. The endpoint has to be tested to ensure the integrity of the existing data is not compromed by incoming valid data. Examples are when trying to create new users when an email already exists for that user or trying to update an entity that voilates a constraint within the database.

3. **The response returned the correct data.**

   Probably the most important test of the three is that given a valid request, the API returns the expected data. This is to ensure that interfaces built for the API can rely on the server to always return data in the same format and structure.

### Fixtures


### Assertions