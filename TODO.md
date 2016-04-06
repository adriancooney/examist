# Features
* Enable adding tags to questions.
* On the module option add topics to study.
* Highlight keywords in questions. Annotations style.
* Paper generation tool.
* Changelog.
* Search exam paper.
* Enable uploading exam papers.
* Enable mark extraction.
* Add markers for when a course changes.
* Allow students to take exams:
    * Timer.
    * Create a random exam from past questions.
    * See solution.
    * Show questions not completed.
* Users.
    - Save their modules or join classes.
* Allow users to give tips on upcoming exam.
* Allow users to add modules to "My Modules".

# Future
* Support 

# Standard
* User login system (for 4BCT only).
* Invite system.

# UI Elements
* Numeric notification on papers to indicate activity such as solutions or comments.

# Dependencies and upgrades
* Install `react-router-redux` instead of `redux-simple-router`.
* Use `react`, `es2015` and `stage-0` preset with Babel.

# BUGS
## Editor bugs
- [ ] Code blocks in preview cause overflow.

## Navigational bugs
- Moving from one course to another
    - Repo:
        1. Got to one course homepage
        2. Back to homepage
        3. To another course homepage
        Result: No popular questions loaded