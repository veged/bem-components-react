(function(global) {

var BEMHTML = (function(module) {
    /* borschik:include:../../libs/bem-components-dist/desktop/bem-components.dev.bh.js */
    return module.exports
})({});

/* borschik:include:../../blocks/react-bem/react-bem.js */
/* borschik:include:../../blocks/button/button.js */
/* borschik:include:../../blocks/popup/popup.js */

var defineAsGlobal = true;
if(typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = ReactBem;
    defineAsGlobal = false;
}

if(typeof modules === 'object' && typeof modules.define === 'function') {
    modules.define('react-bem', function(provide) {
        provide(ReactBem);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = ReactBem;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.ReactBem = ReactBem);

/* borschik:include:../../libs/bem-components-dist/desktop/bem-components.dev.js */

})(this);

