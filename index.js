var MyInput = React.createClass({
    componentWillUnmount : function() {
        console.log('my input unmount!');
    },

    render : function() {
        return React.createElement('input', this.props);
    }
});

var myClass = React.createClass({
        getInitialState : function() {
            return {
                text : 'initial text',
                myKeySuffix : '123'
            };
        },

        //componentDidMount : function() {
        //    var _this = this;
        //    setTimeout(function() {
        //        _this.setState({ text : '1st update' });
        //        setTimeout(function() {
        //            _this.setState({ text : '2nd update', disabled : true });
        //        }, 2050);
        //    }, 50);
        //},

        render : function() {
            var _this = this;
            return React.createElement('div', null, [
                ReactBem.createElement({
                    block : 'popup',
                    key : 'p' + this.state.myKeySuffix,
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
                                console.log('popup visible');
                                _this.setState({ opened : false });
                            }
                        }
                    },
                    content : [
                        React.createElement(MyInput, { key : 'b1', type : 'hidden', value : this.state.text }),
                        ReactBem.createElement({
                            block : 'button',
                            key : 'b2',
                            mods : { theme : 'islands', size : 'l' },
                            text : this.state.text
                        })
                    ]
                }),
                ReactBem.createElement({
                    block : 'button',
                    key : 'b' + this.state.myKeySuffix,
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
                }),
                ReactBem.createElement({
                    block : 'button',
                    key : 'b1' + new Date().getTime(),
                    mods : { theme : 'islands', size : 'm' },
                    text : 'click to change',
                    on : {
                        click : function() {
                            _this.setState({ text : 'new state!' });
                            _this.setState({ myKeySuffix : Date.now() });
                        }
                    },
                    onMod : {
                        js : {
                            '' : function() {
                                console.log('UNMOUNT');
                            }
                        }
                    }
                })
            ]);
        }
    });

setTimeout(function() { React.render(React.createElement(myClass), document.getElementsByClassName('my-app')[0]) }, 50);
//setTimeout(function() { React.render(React.createElement('div'), document.getElementsByClassName('my-app')[0]) }, 2000); // TODO: check proper unmount of subtree

//console.log(React.renderToString(ReactBem.createElement({
//    block : 'popup',
//    key : 'p',
//    mods : {
//        theme : 'islands',
//        target : 'anchor',
//        autoclosable : true
//    },
//    content : [
//        React.createElement('button', { key : 'b1' }, 'button1'),
//        React.createElement('button', { key : 'b2' }, 'button2')
//    ]
//})))
