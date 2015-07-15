ReactBem.createComponent('popup', {
    processBemjson : function() {
        console.log('???', this.rootBemjson);
        this.content = this.rootBemjson.content;
        delete this.rootBemjson.content;
    },

    mountBemjson : function() {
        console.log('!!!', this.content);
        React.render(
            React.createElement('div', null, this.content),
            React.findDOMNode(this));
    },

    blockDidMount : function() {
        this.block.setAnchor($(React.findDOMNode(this.props.getAnchor())));
    },

    unmountBemjson : function() {
        console.log('unmountBemjson popup');
    }
});
