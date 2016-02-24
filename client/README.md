# Routes
The following are routes within the app.

### /
The dashboard. It shows all your courses and any recent activity within the courses such as solutions or comments.

### /login
Login to the app.

### /logout
Logout of the app.

### /profile
View and update your information.

* Name
* Email
* Password
* Course
* Year
* courses - The courses you have selected as yours.

### /courses
View your courses.

### /course/:course
View the main page for the course.

### /course/:course/paper/:year/:period
The paper for that course, year and period.

### /course/:course/paper/:year/:period/question/:question
Link directly to a question. The question parameter is the path to the question e.g. `1.1.5`.

### /course/:course/paper/:year/:period/solution/:solution
Link directly to a solution.

### /course/:course/paper/:year/:period/comment/:comment
Link directly to a comment.

### /course/:course/paper/:year/:period/link/:link
Link directly to a link.

### /course/:course/paper/:year/:period/parse
Open the parser for the paper.