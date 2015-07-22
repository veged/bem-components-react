ReactBem.createComponent('popup', {
    __constructor : function() {
        this.__base.apply(this, arguments);
        this.rootBemjson.content = null;
    },

    componentDidMount : function() {
        this.renderPopup(this.props);
        this.__base.apply(this, arguments);
    },

    blockDidMount : function() {
        this.__base.apply(this, arguments);
        this.block.setAnchor($(React.findDOMNode(this.props.getAnchor())));
    },

    blockUpdateState : function() {
        this.renderPopup(this.props);
    },

    componentWillUnmount : function() {
        console.log('popup unmount');
        React.unmountComponentAtNode(this.blockRoot);
        // NOTE: Doesn't use `__base`, as we need to `destruct` not to `detach` popup
        this.block && BemDom.destruct(this.block.domElem);
        this.blockRoot = null;
    },

    render : function() {
        return React.createElement('div');
    },

    renderPopup : function(props) {
        if(!this.isComponentMount) {
            var componentNode = React.findDOMNode(this);
            this.rootBemjson.block = 'bem-popup';
            componentNode.innerHTML = React.renderToStaticMarkup(ReactBem.createElement(this.rootBemjson));
            this.blockRoot = componentNode.firstChild;
            componentNode = null;
        }

        React.render(React.createElement('div', null, props.content), this.blockRoot);
    }
});

ReactBem.createComponent('bem-popup', {
    __constructor : function() {
        this.__base.apply(this, arguments);
        this.rootBemjson.block = 'popup';
    }
});
