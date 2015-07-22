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
                    React.createElement('div', { key : 'd1' }, _this.state.text),
                    ReactBem.createElement({
                        block : 'input',
                        key : 'i1',
                        mods : { theme : 'islands', size : 'm', 'has-clear' : true },
                        val : _this.state.text,
                        on : {
                            'change' : function(e) {
                                _this.setState({ text : e.target.getVal() });
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
