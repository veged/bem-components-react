ReactBem.createComponent('popup', {
    processBemjson : function() {
        this.rootBemjson.content = null;
    },

    _renderPopupContent : function() {
        React.render(React.createElement('div', null, this.props.content), this.popupRoot);
    },

    mountBemjson : function() {
        this.popupRoot = React.findDOMNode(this);
        this._renderPopupContent();
    },

    updateBlockState : function(prevProps, nextProps) {
        this._renderPopupContent();
    },

    blockDidMount : function() {
        this.block.setAnchor($(React.findDOMNode(this.props.getAnchor())));
    },

    unmountBemjson : function() {
        console.log('unmountBemjson popup');
        //React.unmountComponentAtNode(React.findDOMNode(this));
    }
});
