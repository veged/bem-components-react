var MyInput = React.createClass({
    componentWillUnmount : function() {
        console.log('unmount MyInput');
    },

    render : function() {
        return React.createElement('input', { className : this.props.className, type : 'text' });
    }
});

var MyClass = React.createClass({
    getInitialState : function() {
        return { text : 'my text' };
    },

    componentDidMount : function() {
        var _this = this;
        console.log('did mount');
        //$('.' + this.props.id).replaceWith('<input type="hidden"><input type="hidden">');
        //$('.' + this.props.id).replaceWith('<span>');
        $('.' + this.props.id).appendTo($('body'));

        setTimeout(function() {
            if(_this.isMounted()) {
                console.log('update state!');
                //console.log(React.unmountComponentAtNode($('.' + _this.props.id)[0]));
                _this.setState({ text : 'new text!!' });
            } else {
                console.log('was unmounted');
            }
        }, 1000);
    },

    componentWillUnmount : function() {
        console.log('unmount MyClass');
    },

    render : function() {
        console.log('render', this.state.text);
        return React.createElement(this.props.tag, { id : 'my-component-root' },
            React.createElement(this.props.tag, null, this.state.text),
            React.createElement(MyInput, { className : this.props.id }),
            //React.createElement('span', { className : this.props.id }),
            React.createElement(this.props.tag, null, 'text3')
        );
    }
});

React.render(React.createElement(MyClass, { id : 'myid1', tag : 'div' }), document.querySelector('.my-app'));

setTimeout(function() {
    React.render(React.createElement(MyClass, { id : 'myid1', tag : 'span' }), document.querySelector('.myid1'));
}, 500);

setTimeout(function() {
    React.render(React.createElement('div'), document.querySelector('.my-app'));
    //React.unmountComponentAtNode(document.querySelector('#my-component-root'));
}, 500);
