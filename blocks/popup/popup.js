ReactBem.createComponent('popup', {
    processBemjson : function() {
        this.content = this.rootBemjson.content;
        delete this.rootBemjson.content;
    },

    componentDidUpdate : function() {
        console.log('did update?');
    },

    updateBlockState : function(prevProps, nextProps) {
    },

    mountBemjson : function() {
        console.log('!!!', this.content);
        // TODO: pass state updates to inner react component
        React.render(
            React.createElement('div', null, this.content),
            React.findDOMNode(this));
    },

    blockDidMount : function() {
        this.block.setAnchor($(React.findDOMNode(this.props.getAnchor())));
    },

    unmountBemjson : function() {
        console.log('unmountBemjson popup');
        //React.unmountComponentAtNode(React.findDOMNode(this));
    }
});
