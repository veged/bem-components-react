modules.require(
    ['i-bem__dom', 'jquery', 'objects', 'functions', 'BEMHTML'],
    function(BemDom, $, objects, functions, BEMHTML) {

var bemReactComponents = {};

function createBemComponent(block, spec) {
    return bemReactComponents[block] = React.createClass(objects.extend({
        mixins : [BemComponentMixin]
    }, spec));
}

function createBemElement(bemjson) {
    return React.createElement(
        bemReactComponents[bemjson.block],
        bemjson);
};

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
};

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

var myClass = React.createClass({
        getInitialState : function() {
            return { text : ' !!! ' };
        },

        componentDidMount : function() {
            var _this = this;
            setTimeout(function() {
                _this.setState({ text : ' ??? ' });
                setTimeout(function() {
                    _this.setState({ text : ' !!! ', disabled : true });
                }, 50)
            }, 50)
        },

        render : function() {
            return React.createElement('div', null, [
                createBemElement(
                    {
                        block : 'button',
                        key : 'b',
                        mods : { theme : 'islands', size : 'm', disabled : this.state.disabled },
                        text : this.state.text,
                        on : {
                            'click' : function() {
                                console.log('click');
                            }
                        },
                        onMod : {
                            'disabled' : {
                                'true' : function() {
                                    console.log('disable');
                                }
                            }
                        }
                    }),
                createBemElement(
                    {
                        block : 'select',
                        key : 's',
                        mods : { mode : 'radio-check', theme : 'islands', size : 'm' },
                        val : 2,
                        text : '—',
                        options : [
                            { val : 1, text : 'Доклад' },
                            { val : 2, text : 'Мастер-класс' },
                            { val : 3, text : 'Круглый стол' }
                        ]
                    })
            ]);
        }
    }),

    BemComponentMixin = {
        componentDidMount : function() {
            var _this = this,
                eventsMap = _this.eventsMap || {};

            this.block = BemDom.init($(this.getDOMNode())).bem(this.props.block)
                .on('*', function(e, data) {
                    var fn;

                    if(data && data.modName) {
                        var onMod = _this.props.onMod;
                        if(onMod) {
                            var propsFn = onMod[data.modName] && onMod[data.modName][data.modVal]
                            e.type === '_' + data.modName + '_' + data.modVal && (fn = propsFn);
                        }
                    } else {
                        var on = _this.props.on;
                        fn = on && on[e.type];
                    }

                    fn && fn.apply(this, arguments);
                });
        },

        componentWillUnmount : function() {
            BemDom.destruct(this.block.domElem);
        },

        componentWillReceiveProps : function(nextProps) {
            var nextMods = nextProps.mods,
                curMods = this.props.mods,
                block = this.block;

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

            this.updateBlockState && this.updateBlockState(this.props, nextProps);
        },

        shouldComponentUpdate : function() {
            return false;
        },

        render : function() {
            return bemjsonToReact(propsToBemjson(this.props));
        }
    },

    Button = createBemComponent('button', {
        updateBlockState : function(prevProps, nextProps) {
            nextProps.text === prevProps.text || (this.block.setText(nextProps.text));
        }
    }),

    Select = createBemComponent('select', {
    });

setTimeout(function() { React.render(React.createElement(myClass), document.getElementsByClassName('my-app')[0]) }, 50);

window.ondblclick = function() {
    React.render(React.createElement('div'), document.getElementsByClassName('my-app')[0]);
};

});
