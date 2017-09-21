# READ THIS BITCH

## Dependencies
- `babel.js` - Chrome sucks so we have to use `babel.js` for transpilation of ECMAScript 6 JavaScript into JavaScript that the browser can handle.
- `webpack` - for ES6 module bundling and loading (i.e. `babel.js` allows us to use `import` and `export` statments, while `webpack` bundles the modules we create for use in the browser)

## Build system


## To test
1. After making changes to the code, you'll need to run webpack: `npm start`
    - *TODO*: This should be better... You shouldn't have to quit and restart webpack every time...
2. Load (or refresh) the extension
    - To load:
        - navigate [here](chrome://extensions/)
        - click 'Load Unpacked Extension' and select the `webgraph` folder
    - To refresh
        - navigate [here](chrome://extensions/)
        - refresh the page if already loaded, or use `CMD+R`
2. Open up the `background page` inspector by clicking the 'background page' link in the webgraph description on the extensions page
3. Your extension is running, and ready for use! Navigate to a new tab and try it out.
