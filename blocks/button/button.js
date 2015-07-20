ReactBem.createComponent('button', {
    blockUpdateState : function(prevProps, nextProps) {
        nextProps.text === prevProps.text || (this.block.setText(nextProps.text));
    }
});
