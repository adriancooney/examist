# Models
The following are the models involved in the project and their function.

## User
Table: "user". The user table holds information about every user.

### Attributes
* id
* first_name
* last_name
* username
* email
* password - Password hash.
* salt - Password salt.
* created_at

### Computed attributes
* full_name - First and last name together.

## Visit
Table: "visit". The visit table holds all the visits to the site. We record visitors for analytics.

### Attributes
* session_id - Optional.
* created_at
* ip
* referrer
* user_agent
* url - The url on the site requested.

## Session
Table: "session". The session table holds all the data related to users sessions.

### Attributes
* id
* user_id
* created_at
* key
* valid - Boolean. Whether the session key is valid or not.

## Institution
Table: "insititution". The institution the exam papers and authors are under.

## Paper
Table: "paper"

### Attributes

## Solution
Table: "solution". The solutions for questions.

### Attributes
* author_id - The user who contributed the solution.


