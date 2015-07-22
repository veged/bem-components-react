ReactBem.createComponent('input', {
    blockUpdateState : function(prevProps, nextProps) {
        nextProps.val === prevProps.val || (this.block.setVal(nextProps.val));
    }
});
