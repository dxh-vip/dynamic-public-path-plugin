/**
 * @author web-daddy zhuchunyong
 * @createTime 2022/1/24
 */

function DynamicPublicPath(options) {
  this.options = options;
  this._name = "dynamicPublicPathPlugin";
}
function buf(path, source) {
  var buf = [];
  buf.push(source);
  buf.push("");
  buf.push("// Dynamic assets path override (webpack5-dynamic-public-path)");
  buf.push(`
        if(typeof window !== 'undefined') {
            __webpack_require__.p = (${path}) || "";
        }
    `);
  return buf.join("\n");
}
DynamicPublicPath.prototype.apply = function (compiler) {
  var DynamicPublicPathStr = this.options && this.options.dynamicPublicPath;
  if (!DynamicPublicPathStr) {
    console.error(
      "DynamicPublicPathStr: no output.runtimePublicPath is specified. This plugin will do nothing."
    );
    return;
  }
  if (compiler.hooks && compiler.hooks.thisCompilation) {
    compiler.hooks.thisCompilation.tap(this._name, function (compilation) {
      if (typeof compilation.mainTemplate.plugin === "function") {
        //   兼容webpack4
        compilation.mainTemplate.plugin(
          "require-extensions",
          function (source, chunk, hash) {
            return buf(DynamicPublicPathStr, source);
          }
        );
      } else {
        //   兼容webpack5
        compilation.mainTemplate.hooks.requireExtensions.tap(
          "require-extensions",
          function (source, chunk, hash) {
            return buf(DynamicPublicPathStr, source);
          }
        );
      }
    });
  } else {
    //   兼容webpack4之前的
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
