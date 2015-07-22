ReactBem.createComponent('popup', {
    __constructor : function() {
        this.__base.apply(this, arguments);
        this.rootBemjson.content = null;
        this.popupDOMNode = null;
    },

    getBlockDOMNode : function() {
        if(!this.popupDOMNode) {
            this.popupDOMNode = this.__base().firstChild;
        }
        return this.popupDOMNode;
    },

    componentDidMount : function() {
        this.renderPopup(this.props);
        this.__base.apply(this, arguments);
    },

    blockDidMount : function() {
        this.__base.apply(this, arguments);
        this.block.setAnchor($(React.findDOMNode(this.props.getAnchor())));
    },

    blockUpdateState : function(_, nextProps) {
        this.renderPopup(nextProps);
    },

    componentWillUnmount : function() {
        React.unmountComponentAtNode(this.getBlockDOMNode());
        // NOTE: Doesn't use `__base`, as we need to `destruct` not to `detach` popup
        if(this.block) {
            this.block.delMod('visible');
            BemDom.destruct(this.block.domElem);
        }
    },

    render : function() {
        return React.createElement('div');
    },

    renderPopup : function(props) {
        if(!this.isComponentMount) {
            this.rootBemjson.mods && (this.rootBemjson.mods.visible = false);
            React.findDOMNode(this).innerHTML = BEMHTML.apply(this.rootBemjson);
        }

        // NOTE: additional `div` is needed, because `props.content` may contains array
        React.render(React.createElement('div', null, props.content), this.getBlockDOMNode());
    }
});
