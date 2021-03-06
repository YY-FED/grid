/*
 * 将固定列放入gridCompColumnFixedArr
 */
const re_initGridCompFixedColumn = function() {
    var oThis = this;
    var w = 0;
    var removeArr = [];
    $.each(this.gridCompColumnArr, function(i) {
        if (this.options.fixed == true) {
            oThis.gridCompColumnFixedArr.push(this);
        }
    });
    $.each(this.gridCompColumnFixedArr, function(i) {
        if (this.options.fixed != true) {
            oThis.gridCompColumnArr.push(this);
            removeArr.push(this)
        }
    })
    $.each(removeArr, function(i) {
        for (var i = oThis.gridCompColumnFixedArr.length; i > -1; i--) {
            if (this == oThis.gridCompColumnFixedArr[i]) {
                oThis.gridCompColumnFixedArr.splice(i, 1);
                break;
            }
        }
    })
    $.each(this.gridCompColumnFixedArr, function(i) {
        for (var i = oThis.gridCompColumnArr.length; i > -1; i--) {
            if (oThis.gridCompColumnArr[i] == this) {
                oThis.gridCompColumnArr.splice(i, 1);
                break;
            }
        }
    });
};

const fixed_columnsVisibleFun = function() {
    // 扩展方法
    var oThis = this,
        fixW = 0,
        fixW_R = 0;
    $.each(this.gridCompColumnFixedArr, function() {
        if (this.options.visible) {
             //NC轻量化在fixedFloat为right的时候，会导致没法拖拽宽度
             if(oThis.options.fixedFloat!=="right"){
                fixW_R += parseInt(this.options.width);
            }
            fixW += parseInt(this.options.width);
            this.firstColumn = oThis.firstColumn;
            oThis.firstColumn = false;
        }
    });
    //新增加fixedWidth_R为mousemove
    this.fixedWidth_R = fixW_R;
    this.fixedRealWidth = fixW;
    this.fixedWidth = fixW;
};

const re_createHeaderTableFixed = function() {
    return this.createHeaderTable('fixed');
};

const re_createContentTableFixed = function() {
    return this.createContentTable('fixed');
}
const re_createContentOneRowFixed = function(rowObj) {
    return this.createContentOneRow(rowObj, 'fixed')
}
const re_widthChangeGridFunFixed = function(halfWholeWidth) {
    // 固定区域宽度不大于整体宽度的一半
    if (this.fixedRealWidth > halfWholeWidth) {
        this.fixedWidth = halfWholeWidth;
    } else {
        this.fixedWidth = this.fixedRealWidth;
    }
}

const setColumnFixed = function(field, fixed) {
    var gridCompColumn = this.getColumnByField(field);
    gridCompColumn.options.fixed = fixed;
    this.initGridCompFixedColumn();
    this.repaintDivs();
}

export const fixFunObj = {
    initGridCompFixedColumn: re_initGridCompFixedColumn,
    fixed_columnsVisibleFun: fixed_columnsVisibleFun,
    createHeaderTableFixed: re_createHeaderTableFixed,
    createContentTableFixed: re_createContentTableFixed,
    createContentOneRowFixed: re_createContentOneRowFixed,
    widthChangeGridFunFixed: re_widthChangeGridFunFixed,
    setColumnFixed: setColumnFixed
}
