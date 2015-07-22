/*
 Currently only `button`, `input` and `popup` blocks from bem/bem-components are available.
 See https://en.bem.info/libs/bem-components/v2.2.1/ for BEMJSON API.
*/

var App = React.createClass({
    getInitialState : function() {
        return {
            text : 'initial text'
        };
    },

    render : function() {
        var _this = this;
        return React.createElement('div', null, [
            ReactBem.createElement({
                block : 'popup',
                key : 'p',
                getAnchor : function() { return _this.refs.button; },
                mods : {
                    theme : 'islands',
                    target : 'anchor',
                    autoclosable : true,
                    visible : this.state.opened
                },
                onMod : {
                    visible : {
                        '' : function(e) {
                            _this.setState({ opened : false });
                        }
                    }
                },
                content : [
                    // Any React component can be used here
                    React.createElement('div', { key : 'd1' }, _this.state.text),
                    ReactBem.createElement({
                        block : 'input',
                        key : 'i1',
                        mods : { theme : 'islands', size : 'm', 'has-clear' : true },
                        val : _this.state.text,
                        on : {
                            'change' : function(e) {
                                var newVal = e.target.getVal(); // See bem.info for `input`'s  API
                                _this.setState({ text : newVal });
                            }
                        }
                    })
                ]
            }),
            ReactBem.createElement({
                block : 'button',
                key : 'b',
                ref : 'button',
                mods : { theme : 'islands', size : 'm' },
                text : this.state.text,
                on : {
                    'click' : function(e) {
                        _this.setState({ opened : true });
                    }
                }
            })
        ]);
    }
});

React.render(React.createElement(App), document.getElementsByClassName('app')[0]);
