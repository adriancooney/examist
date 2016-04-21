# 3. Implementation
## 3.1 Project Structure

 * `client` - The entire frontend code.
   * `assets` - The project's assets (fonts, Icons and images).
   * `build` - The directory of the compiled frontend code.
   * `src` - The Javascript source code of the frontend.
     * `library` - Classes for the reducers and resources.
     * `model` - The reducers for the app.
     * `views` - The React components for the application.
     		* `app` - The "smart" components for the app.
     		* `pages` - The static pages within the site.
     		* `parser` - The "smart" components for the parser.
     		* `templates` - The templates used by both the app and parser.
     		* `ui` - The "dumb" components for every aspect of the app.
   * `style` - The SASS code for the app.
     * `app` - The styling for "smart" app components.
     * `common` - The common styles for all of the app. Contains theme information also.
     * `pages` - The styling for the static pages.
     * `ui` - The styling for all React components.
   * `test` - The tests for the frontend.
 * `server` - The Python source code for the server.
   * `api` - The Flask API Blueprints (endpoints).
   * `library` - Classes for the SQL Alchemy models and utility code.
   * `migrations` - Contains the code for database migrations.
     * `data` - Code to insert scraped data into the database.
     * `versions` - The database migrations (versions).
   * `model` - The SQL Alchemy models.
   * `test` - The API tests.

### Non-code directories

 * `data`
   * `dumps` - The database dumps as backups.
   * `papers` - Some example test papers.
 * `deploy` - The Dockerfiles for deployment.
 * `design` - The user interface design of the application (.sketch).
 * `report` - This report.
 * `research` - Some research (incl. IPython notebooks and database visualisations diagrams).