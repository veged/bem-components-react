var React = typeof require === 'undefined' ? global.React : require('react'),
    bemReactComponents = {},
    hasOwnProp = Object.prototype.hasOwnProperty;

function extend(target, source) {
    (typeof target !== 'object' || target === null) && (target = {});

    if(source) {
        for(var key in source) {
            hasOwnProp.call(source, key) && (target[key] = source[key]);
        }
    }

    return target;
}

function createComponent(block, spec) {
    return bemReactComponents[block] = React.createClass(extend({
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
    $ = null,
    BemComponentMixin = {
        componentDidMount : function() {
            var _this = this,
                lastProps = this.props;

            modules.require(['i-bem__dom', 'jquery', this.props.block], function(BemDom_, $_, blockCls) {
                BemDom = BemDom_;
                $ = $_;

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

                    _this.blockDidMount && _this.blockDidMount($);

                    if(_this.props !== lastProps) {
                        _this.updateBlock(lastProps, _this.props);
                    }
                }
            });

            this.mountBemjson && this.mountBemjson();
        },

        componentWillUnmount : function() {
            this.unmountBemjson && this.unmountBemjson();
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
                block = this.block,
                modName, modVal;

            if(nextMods) {
                for(modName in nextMods) {
                    if(hasOwnProp.call(nextMods, modName)) {
                        modVal = nextMods[modName];
                        if(!curMods || curMods[modName] !== modVal) {
                            block.setMod(modName, modVal);
                        }
                    }
                }
            }

            if(curMods) {
                for(modName in curMods) {
                    if(hasOwnProp.call(curMods, modName)) {
                        modVal = curMods[modName];
                        if(!nextMods || !(modName in nextMods)) {
                            block.delMod(modName);
                        }
                    }
                }
            }
        },

        shouldComponentUpdate : function() {
            return false;
        },

        getInitialState : function() {
            this.rootBemjson = propsToBemjson(this.props);
            this.processBemjson && this.processBemjson();
            return null;
        },

        render : function() {
            return bemjsonToReact(this.rootBemjson);
        }
    },
    ReactBem = {
        createElement : createElement,
        createComponent : createComponent
    };
