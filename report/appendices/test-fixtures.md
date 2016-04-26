# Appendix 1: List of Test fixtures
Below is the output from `py.test --fixtures test` which lists all the fixture available for testing. Only custom fixtures are shown. The implementation of the fixtures are located in `server/test/conftest.py`.

| Fixture                           | Description                                                       |
| --------------------------------- | ----------------------------------------------------------------- |
| user                              | A single user with no sessions.                                   |
| courses                           | A list of courses.                                                |
| papers                            | A list of papers without courses.                                 |
| questions                         | A list of questions without papers or author.                     |
| course_with_papers                | A course with multiple papers associated.                         |
| paper_with_course_and_questions   | A paper with an associated course and questions.                  |
| user_with_courses                 | A user with courses associated.                                   |
| auth_client                       | An API client to perform authorized requests.                     |
| output_logger                     | Fixture to mark the start and end of tests (autouse)              |
| app                               | The Flask API.                                                    |
| db                                | The app database with fresh set of tables.                        |
| client                            | Test API client to perform unauthorized requests.                 |
| session                           | Database session that rollbacks any data after test execution.    |
| institution                       | A single Institution.                                             |
