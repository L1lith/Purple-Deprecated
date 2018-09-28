# Purple
Purple is a Isomorphic React based Web Framework focused on High Performance. Skip to [Getting Started](#getting-started)

#### What does this mean?

When your browser makes a request for a webpage Purple finds your corresponding HTML files and React elements/components in the `/pages` directory. It renders all of the React elements into HTML then merges it with your HTML files to create the final HTML.

Purple then caches the page under the `/cache` directory, and all subsequent requests to that URL are served that raw HTML without having to render those components server side again.

This approach maximizes the client side performance by only serving plain HTML for the initial render and not having to evaluate large quantities of React/Javascript, and maximizes the server side performance by caching every response so pages are only generated once.

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
## The Pages Directory
All of your HTML and React lives under the `/pages` directory of your project. The paths of these files represents how they are rendered under the web root. To read more about these paths see the [Paths Section](#paths). All files whose file path match the request URL path will be combined to form an HTML page. All React Components/Elements will be rendered to HTML as well. Once the page loads it will request all the relevant React Components from the server and become interactive.

## Paths
Purple has its own set of unique characters which can be used on the paths of your pages files.
| Path String | Meaning                                   |
| :---------: |:------------------------------------------|
| \*          | Any path (not including subpaths)         |
| \*\+        | Any path except / (not including subpaths |
| \*\*        | Any path (including subpaths)             |
| \*\*\+      | Any path except / (including subpaths)    |

Let's look at some examples.
1. `/pages/index.html` This path matches
```
/index.html
/
/index
/.html
```
But it does not match
```
/index.txt
```
2. `/pages/*.html` This path matches

```
/
/index
/index.html
/.html
/mystictomato.html
```
But it does not match
```
/ban/firewalldragon.html
/helloworld/
```
3. `/pages/tony*.html` This page matches
```
/tony
/tony.html
/tonytiger
/tonytiger.html
```
4. `/pages/*+.html` This page matches exactly the same as the second example, except it does not match
```
/
```
5. `/pages/**.html` This path matches any request with no extension or the .html extension.
```
/index.html
/ice/ice/baby
```
6. `/pages/**+.html` This path matches exactly the same as the fifth example, except that it doesn't match
```
/
```
7. `/pages/abc/index.html` This path functions exactly the same as the first example except the path must be prefaced with `/abc/` to match. This path matches
```
/abc/
/abc/index.html
/abc/index
```
But does not match
```
/
/index.html
/abc
/abc.html
```
## Static Files
Purple will automatically serve all static files (css, images, whatever) that are placed under the `/static` directory. DO NOT place these resources under the `/pages` directory.

## To Do
1. Custom store implementation which automatically stores the state in localStorage and loads it upon navigation
2. Currently Purple does not support running more than one app at a time.
