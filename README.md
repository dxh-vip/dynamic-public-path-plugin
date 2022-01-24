# dynamic-public-path-plugin

A plugin that lets you override the Webpack modules public path in webpage runtime.
plugin : webpack-runtime-public-path-plugin Upgraded version, compatible with webpack5

# Configuration

```
const dynamicPublicPathPlugin = require("dynamic-public-path-plugin")
```

```json
    plugins: [
        ...
        new dynamicPublicPathPlugin({
            dynamicPublicPath: "'/foo/bar/'"
        })
        ...
    ]
```

# Result

```js
/******/        // __webpack_public_path__
/******/        __webpack_require__.p = "/dist/";

/******/        // Dynamic assets path override (webpack5-dynamic-public-path)
/******/        __webpack_require__.p = ('/foo/bar/') || __webpack_require__.p;

```