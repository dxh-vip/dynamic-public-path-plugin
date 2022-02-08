/**
 * @author web-daddy zhuchunyong
 * @createTime 2022/1/24
 */

function DynamicPublicPath(options) {
  this.options = options;
  this._name = "dynamicPublicPathPlugin";
}
function buf(path, source) {
  if (!source) {
    return source;
  }
  var newSource = [];
  newSource.push(source);
  newSource.push('if( typeof __webpack_require__ !== "undefined" ) {');
  newSource.push("    __webpack_require__.p = " + path + ";");
  newSource.push("}");
  return newSource.join("\n");
}
DynamicPublicPath.prototype.apply = function (compiler) {
  const self = this;
  var DynamicPublicPathStr = self.options && self.options.dynamicPublicPath;
  if (!DynamicPublicPathStr) {
    console.error(
      "DynamicPublicPathStr: no output.runtimePublicPath is specified. This plugin will do nothing."
    );
    return;
  }
  if (compiler.hooks && compiler.hooks.thisCompilation) {
    compiler.hooks.thisCompilation.tap(self._name, function (compilation) {
      compilation.mainTemplate.hooks.requireExtensions.tap(
        self._name,
        function (source, chunk, hash) {
          return buf(DynamicPublicPathStr, source);
        }
      );
    });
  } else {
    //   兼容webpack4之前版本
    compiler.plugin("this-compilation", function (compilation) {
      compilation.mainTemplate.plugin(
        "require-extensions",
        function (source, chunk, hash) {
          return buf(DynamicPublicPathStr, source);
        }
      );
    });
  }
};
module.exports = DynamicPublicPath;
