var myClass = React.createClass({
        getInitialState : function() {
            return { text : 'initial text' };
        },

        componentDidMount : function() {
            var _this = this;
            setTimeout(function() {
                _this.setState({ text : '1st update' });
                setTimeout(function() {
                    _this.setState({ text : '2nd update', disabled : true });
                }, 2050);
            }, 50);
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
                            '' : function() {
                                _this.setState({ opened : false });
                            }
                        }
                    },
                    content : ReactBem.createElement({
                        block : 'button',
                        key : 'b',
                        mods : { theme : 'islands', size : 'l' },
                        text : this.state.text
                    })
                }),
                ReactBem.createElement(
                    {
                        block : 'button',
                        key : 'b',
                        ref : 'button',
                        mods : { theme : 'islands', size : 'm' },
                        text : this.state.text,
                        on : {
                            'click' : function(e) {
                                console.log('click');
                                _this.setState({ opened : true });
                            }
                        },
                        onMod : {
                            'disabled' : {
                                'true' : function() {
                                    console.log('disable');
                                }
                            }
                        }
                    })
            ]);
        }
    });

setTimeout(function() { React.render(React.createElement(myClass), document.getElementsByClassName('my-app')[0]) }, 50);
//setTimeout(function() { React.render(React.createElement('div'), document.getElementsByClassName('my-app')[0]) }, 2000); // TODO: check proper unmount of subtree
