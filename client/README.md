# Routes
The following are routes within the app.

### /
The dashboard. It shows all your modules and any recent activity within the modules such as solutions or comments.

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
* Modules - The modules you have selected as yours.

### /modules
View your modules.

### /module/:module
View the main page for the module.

### /module/:module/paper/:year/:period
The paper for that module, year and period.

### /module/:module/paper/:year/:period/question/:question
Link directly to a question. Alternatively, the user can omit the `:question` id and insert the question path into the query parameters for the URL e.g. `/module/:module/paper/:year/:period/question?q=1.1`.

### /module/:module/paper/:year/:period/solution/:solution
Link directly to a solution.

### /module/:module/paper/:year/:period/comment/:comment
Link directly to a comment.

### /module/:module/paper/:year/:period/link/:link
Link directly to a link.

### /module/:module/paper/:year/:period/parse
Open the parser for the paper.