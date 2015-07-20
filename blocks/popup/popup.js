ReactBem.createComponent('popup', {
    __constructor : function() {
        this.__base.apply(this, arguments);
        this.rootBemjson.content = null;
        this.popupRoot = null;
    },

    componentDidMount : function() {
        this.__base.apply(this, arguments);
        this.popupRoot = React.findDOMNode(this);
        this.updatePopupContent();
    },

    blockDidMount : function() {
        this.__base.apply(this, arguments);
        this.block.setAnchor($(React.findDOMNode(this.props.getAnchor())));
    },

    updateBlockState : function() {
        this.updatePopupContent();
    },

    componentWillUnmount : function() {
        React.unmountComponentAtNode(this.popupRoot);
        this.__base.apply(this, arguments);
    },

    updatePopupContent : function() {
        React.render(React.createElement('div', null, this.props.content), this.popupRoot);
    }
});
