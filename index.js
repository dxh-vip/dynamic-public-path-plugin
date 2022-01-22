
/**
 * Created by web-daddy on 2021/1/23.
 */

function DynamicPublicPath(options) {
    this.options = options;
    this._name = "webpack5DynamicPublicPath";
}

function buf(path, source) {
    var buf = [];
    buf.push(source);
    buf.push('');
    buf.push('// Dynamic assets path override (webpack5-dynamic-public-path)');
    buf.push(`
        if(typeof window !== 'undefined') {
            __webpack_require__.p = (${path}) || "";
        }
    `);
    return buf.join('\n');
}

DynamicPublicPath.prototype.apply = function (compiler) {
    var DynamicPublicPathStr = this.options && this.options.dynamicPublicPath;
    if (!DynamicPublicPathStr) {
        console.error('dynamicPublicPath: no output.dynamicPublicPath is specified. This plugin will do nothing.');
        return;
    }

    if (compiler.hooks && compiler.hooks.thisCompilation) {
        compiler.hooks.thisCompilation.tap(this._name, function (compilation) {
            compilation.mainTemplate.hooks.requireExtensions.tap('require-extensions', function (source, chunk, hash) {
                return buf(DynamicPublicPathStr, source)
            });
        });
    }
};

module.exports = DynamicPublicPath;
