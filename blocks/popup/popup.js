ReactBem.createComponent('popup', {
    processBemjson : function() {
        this.rootBemjson.content = null;
    },

    _renderPopupContent : function() {
        React.render(React.createElement('div', null, this.props.content), this.popupRoot);
    },

    componentDidMount : function() {
        this.popupRoot = React.findDOMNode(this);
        this._renderPopupContent();
    },

    updateBlockState : function() {
        this._renderPopupContent();
    },

    blockDidMount : function() {
        this.block.setAnchor($(React.findDOMNode(this.props.getAnchor())));
    },

    componentWillUnmount : function() {
        React.unmountComponentAtNode(this.popupRoot);
    }
});
