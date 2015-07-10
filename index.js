modules.require(['i-bem__dom', 'jquery', 'BEMHTML'], function(BemDom, $, BEMHTML) {
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
        var res, i, l, item;
        if (json === false || json == null) return '';
        if (typeof json !== 'object') {
            return json;
        } else if (Array.isArray(json)) {
            res = [];
            for (i = 0, l = json.length; i < l; i++) {
                item = json[i];
                if (item !== false && item != null) {
                    res.push(toReact(item));
                }
            }
            return res;
        } else {
            var isBEM = json.bem !== false;
            if (typeof json.tag !== 'undefined' && !json.tag) {
                return json.content ? toReact(json.content) : '';
            }
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

            if (isBEM) {
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
            }

            if (json.cls) {
                cls = cls ? cls + ' ' + json.cls : json.cls;
            }

            cls && (attrs['className'] = cls);

            var tag = json.tag || 'div',
                content = [],
                jcontent = json.content;

            if (jcontent != null) {
                if (Array.isArray(jcontent)) {
                    for (i = 0, l = jcontent.length; i < l; i++) {
                        item = jcontent[i];
                        if (item !== false && item != null) {
                            content.push(toReact(item));
                        }
                    }
                } else {
                    content.push(toReact(jcontent));
                }
            }

            return React.createElement(tag, attrs, content);
        }
    }

    function bemjsonToReact(bemjson) {
        bemjson = BEMHTML.processBemJson(bemjson);
        return toReact(bemjson);
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
                        _this.setState({ text : ' !!! ' });
                    }, 50)
                }, 50)
            },

            render : function() {
                return React.createElement(
                    Button,
                    {
                        mods : { theme : 'islands', size : 'm', type : 'link' },
                        url : 'https://bem.info/',
                        text : this.state.text
                    });
            }
        }),
        Button = React.createClass({
            componentDidMount : function() {
                this.block = BemDom.init($(this.getDOMNode())).bem('button');
            },
            componentWillUnmount : function() {
                BemDom.destruct(this.block.domElem);
            },
            componentWillReceiveProps : function(nextProps) {
                nextProps.text === this.props.text || (this.block.setText(nextProps.text));
            },
            shouldComponentUpdate : function() {
                return false;
            },
            render : function() {
                var props = this.props;
                return bemjsonToReact({
                    block : 'button',
                    mods : props.mods,
                    url : props.url,
                    text : props.text
                });
            }
        })


    setTimeout(function() { React.render(React.createElement(myClass), document.getElementsByClassName('my-app')[0]) }, 50);
});
