# FYP
![Codeship](https://codeship.com/projects/cbaa04d0-b1be-0133-3eff-7e5a34091697/status?branch=master)

# Client
## Installation
To install the client, you need Node.js installed (with `npm`). 

    $ cd client
    $ npm install

This will probably take a while. It will install all the necessary dependencies in the `node_modules` folder. Once the installation is complete, we need to build the app.

    $ npm run build

## File Structure
The client is a pretty large app. It's built using React so we have great composability between elements. We have the following folders:

- `build/` - This directory is created by webpack that outputs the built app.
- `src/` - This contains the source for the client side.
- `src/components` - This directory contains all the reusable components of the app such as buttons and inputs.
- `src/views` - Views are collections of components that can be composed to form pages.
- `src/pages` - Pages views composed to display data on the screen.
- `style/` - This directory contains all the SASS (CSS) for the project. Each SCSS file corresponds to a React component that requires it.

## Python style guide
* Double quotes always.
* Package imports first, local package imports second.