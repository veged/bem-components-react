(function(global) {

var React = global.React,
    BEMHTML = global.BEMHTML,
    modules = global.modules,

    bemReactComponents = {};

function createComponent(block, spec) {
    return bemReactComponents[block] = React.createClass(objects.extend({
        mixins : [BemComponentMixin]
    }, spec));
}

function createElement(bemjson) {
    return React.createElement(
        bemReactComponents[bemjson.block],
        bemjson);
}

function toBemCssClasses(json, base, parentBase) {
    var mods, mod, res = '', i;

    if (parentBase !== base) {
        if (parentBase) res += ' ';
        res += base;
    }

    if (mods = json.mods || json.elem && json.elemMods) {
        for (i in mods) {
            mod = mods[i];
            if (mod || mod === 0) {
                res += ' ' + base + '_' + i + (mod === true ? '' : '_' + mod);
            }
        }
    }
    return res;
}

function toReact(json) {
    var i;
    //if (typeof json.tag !== 'undefined' && !json.tag) {
    //    return json.content ? toReact(json.content) : '';
    //}
    if (json.mix && !Array.isArray(json.mix)) {
        json.mix = [json.mix];
    }
    var cls = '',
        jattr, jval, attrs = {}, jsParams, hasMixJsParams = false;

    var renameAttr = {
        'for' : 'htmlFor'
    };

    if (jattr = json.attrs) {
        for (i in jattr) {
            jval = jattr[i];
            if (jval !== null && jval !== undefined) {
                attrs[renameAttr[i] || i] = jval;
            }
        }
    }

    var base = json.block + (json.elem ? '__' + json.elem : '');

    if (json.block) {
        cls = toBemCssClasses(json, base);
        if (json.js) {
            (jsParams = {})[base] = json.js === true ? {} : json.js;
        }
    }

    var addJSInitClass = jsParams && !json.elem;

    var mixes = json.mix;
    if (mixes && mixes.length) {
        for (i = 0, l = mixes.length; i < l; i++) {
            var mix = mixes[i];
            if (mix && mix.bem !== false) {
                var mixBlock = mix.block || json.block || '',
                    mixElem = mix.elem || (mix.block ? null : json.block && json.elem),
                    mixBase = mixBlock + (mixElem ? '__' + mixElem : '');

                if (mixBlock) {
                    cls += toBemCssClasses(mix, mixBase, base);
                    if (mix.js) {
                        (jsParams = jsParams || {})[mixBase] = mix.js === true ? {} : mix.js;
                        hasMixJsParams = true;
                        if (!addJSInitClass) addJSInitClass = mixBlock && !mixElem;
                    }
                }
            }
        }
    }

    if (jsParams) {
        if (addJSInitClass) cls += ' i-bem';
        var jsData = !hasMixJsParams && json.js === true ?
            '{&quot;' + base + '&quot;:{}}' :
            JSON.stringify(jsParams);
        attrs['data-bem'] = jsData;
    }

    if (json.cls) {
        cls = cls ? cls + ' ' + json.cls : json.cls;
    }

    cls && (attrs['className'] = cls);

    var tag = json.tag || 'div',
        jcontent = json.content;

    jcontent != null &&
        (attrs.dangerouslySetInnerHTML = { __html : BEMHTML.toHtml(jcontent) });

    return React.createElement(tag, attrs);
}

function bemjsonToReact(bemjson) {
    bemjson = BEMHTML.processBemJson(bemjson);
    return toReact(bemjson);
}

function propsToBemjson(props) {
    var res = {};
    for(var i in props) {
        if(i !== 'on' && i !== 'onMod' && i !== 'key') {
            res[i] = props[i];
        }
    }
    return res;
}

var BemDom = null,
    BemComponentMixin = {
        componentDidMount : function() {
            var _this = this,
                lastProps = this.props;

            modules.require(['i-bem__dom', 'jquery', this.props.block], function(BemDom_, $, blockCls) {
                BemDom = BemDom_;

                if(_this.isMounted()) {
                    _this.block = BemDom_.init($(React.findDOMNode(_this))).bem(blockCls.getName())
                        .on('*', function(e, data) {
                            var fn;

                            if(data && data.modName) {
                                var onMod = _this.props.onMod;
                                if(onMod) {
                                    var propsFn = onMod[data.modName] && onMod[data.modName][data.modVal];
                                    e.type === '_' + data.modName + '_' + data.modVal && (fn = propsFn);
                                }
                            } else {
                                var on = _this.props.on;
                                fn = on && on[e.type];
                            }

                            fn && fn.apply(this, arguments);
                        });

                    if(_this.props !== lastProps) {
                        _this.updateBlock(lastProps, _this.props);
                    }
                }
            });
        },

        componentWillUnmount : function() {
            this.block && BemDom.destruct(this.block.domElem);
        },

        componentWillReceiveProps : function(nextProps) {
            if(!this.block) {
                return;
            }
            this.updateBlock(this.props, nextProps);
        },

        updateBlock : function(curProps, nextProps) {
            this.updateBlockMods(curProps, nextProps);
            this.updateBlockState && this.updateBlockState(curProps, nextProps);
        },

        updateBlockMods : function(curProps, nextProps) {
            var nextMods = nextProps.mods,
                curMods = curProps.mods,
                block = this.block;

            if(nextMods) {
                for(var modName in nextMods) {
                    if(obj.hasOwnProperty(key)) {
                        if(!curMods || curMods[modName] !== modVal) {
                            block.setMod(modName, modVal);
                        }
                    }
                }
            }

            nextMods && objects.each(nextMods, function(modVal, modName) {
                if(!curMods || curMods[modName] !== modVal) {
                    block.setMod(modName, modVal);
                }
            });

            curMods && objects.each(curMods, function(modVal, modName) {
                if(!nextMods || !(modName in nextMods)) {
                    block.delMod(modName);
                }
            });
        },

        shouldComponentUpdate : function() {
            return false;
        },

        render : function() {
            return bemjsonToReact(propsToBemjson(this.props));
        }
    },
    reactBem = {
        createElement : createElement,
        createComponent : createComponent
    };

var defineAsGlobal = true;
if(typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = reactBem;
    defineAsGlobal = false;
}

if(typeof modules === 'object' && typeof modules.define === 'function') {
    modules.define('react-bem', function(provide) {
        provide(reactBem);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = reactBem;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.reactBem = reactBem);

})(this);
