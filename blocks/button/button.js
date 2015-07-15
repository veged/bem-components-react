ReactBem.createComponent('button', {
    unmountBemjson : function() {
        console.log('!!!! unmountBemjson button');
    },
    updateBlockState : function(prevProps, nextProps) {
        nextProps.text === prevProps.text || (this.block.setText(nextProps.text));
    }
});
