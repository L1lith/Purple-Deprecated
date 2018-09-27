# Purple
Purple is a Isomorphic React based Web Framework.

##### What does this mean?

When your browser makes a request for a webpage Purple finds your corresponding HTML files and React elements/components in the `/pages` directory. It renders all of the React elements into HTML then merges it with your HTML files to create the final HTML.

Purple then caches the page under the `/cache` directory, and all subsequent requests to that URL are served that raw HTML without having to render those components server side again.

This approach maximizes both server side and client side performance by only serving plain HTML while not having to evaluate large quantities of React/Javascript.

After the client loads the initial HTML it then loads your React Components and add interactivity. This maximizes client side performance by not requiring slow Javascript evaluation before the initial HTML is rendered.

The server creates a unique Javascript bundle (which is also cached for maximum server performance) for  every URL which only includes the React components which are being rendered to your current page. This is much faster than the traditional method of including the entire application (every React element for every page).

## Getting Started
Purple makes it very easy to get rolling. Simply install Purple globally,
```
npm i -g purple
```
Then run the create command (you may supply a target directory).
```
purple create <directory>
```
If you do not supply a directory it will create a new project in `./Purple-Project`.

All you have to do now is cd into the directory you just created and run
```
npm start
```
