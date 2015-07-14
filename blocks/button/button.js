reactBem.createComponent('button', {
    updateBlockState : function(prevProps, nextProps) {
        nextProps.text === prevProps.text || (this.block.setText(nextProps.text));
    }
});
