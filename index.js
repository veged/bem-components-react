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
                        mods : { theme : 'islands', size : 'm', disabled : !this.state.disabled },
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
                <!--ReactBem.createElement(-->
                    <!--{-->
                        <!--block : 'select',-->
                        <!--key : 's',-->
                        <!--mods : { mode : 'radio-check', theme : 'islands', size : 'm' },-->
                        <!--val : 2,-->
                        <!--text : '—',-->
                        <!--options : [-->
                            <!--{ val : 1, text : 'Доклад' },-->
                            <!--{ val : 2, text : 'Мастер-класс' },-->
                            <!--{ val : 3, text : 'Круглый стол' }-->
                        <!--]-->
                    <!--})-->
            ]);
        }
    });

setTimeout(function() { React.render(React.createElement(myClass), document.getElementsByClassName('my-app')[0]) }, 50);
setTimeout(function() { React.render(React.createElement('div'), document.getElementsByClassName('my-app')[0]) }, 2000); // TODO: check proper unmount of subtree
