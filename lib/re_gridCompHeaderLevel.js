var re_resetThVariableHeaderLevel = function re_resetThVariableHeaderLevel() {
    var oThis = this,
        oldParentHeaderStr = '',
        parentWidth = 0,
        maxHeaderLevel = this.options.maxHeaderLevel,
        columnWidthArr = [];
    // 遍历所有已经创建的th创建对象记录column的width
    $('#' + this.options.id + '_header_table th', this.$ele).each(function (i) {
        var gridCompColumn = oThis.gridCompColumnArr[i];
        var field = gridCompColumn.options.field;
        var w = 0;
        if (gridCompColumn.options.visible) {
            w = parseInt(gridCompColumn.options.width);
        }
        var obj = {
            field: field,
            width: w
        };
        columnWidthArr.push(obj);
    });
    // 遍历所有headerLevel > 1的column，创建div并设置top及width值
    var firstColumnField = this.getColumnByVisibleIndex(0).options.field;
    for (var i = 0; i < this.gridCompLevelColumn.length; i++) {
        var column = this.gridCompLevelColumn[i];
        var field = column.field;
        var title = column.title;
        var startField = column.startField;
        var endField = column.endField;
        if (startField && endField) {
            var startTh = $('th[field=' + startField + ']', this.$ele.find('#' + this.options.id + '_header_thead'));
            var styleStr = ' style="';
            var classStr = '';
            var linkStyleStr = '';
            var headerLevel = column.headerLevel;
            var top = (parseInt(maxHeaderLevel) - parseInt(headerLevel)) * this.baseHeaderHeight;
            styleStr += 'top:' + top + 'px;z-index:' + headerLevel + ';';
            var width = 0;
            var startFlag = false;
            for (var j = 0; j < columnWidthArr.length; j++) {
                var nowColumn = columnWidthArr[j];
                var nowField = nowColumn.field;
                if (nowField == startField || startFlag) {
                    startFlag = true;
                    width += nowColumn.width;
                    if (nowField == endField) {
                        break;
                    }
                }
            }
            styleStr += 'width:' + width + 'px;';
            styleStr += '" ';
            if (firstColumnField == startField) {
                classStr += ' grid-no-left-border ';
            }
            if (maxHeaderLevel == headerLevel) {
                classStr += ' grid-max-level-div ';
            }

            if (this.options.headerHeight) linkStyleStr = 'style="height:' + this.options.headerHeight + 'px;line-height:' + this.options.headerHeight + 'px;"';
            var htmlStr = '<div id="' + this.options.id + field + '" class="u-gird-parent ' + classStr + '" ' + styleStr + '><div class="u-grid-header-link" ' + linkStyleStr + ' title="' + title + '">' + title + '</div></div>';
            startTh[0].insertAdjacentHTML('afterBegin', htmlStr);
        }
    }
};

var re_initGridCompColumnHeaderLevelFun = function re_initGridCompColumnHeaderLevelFun(columnOptions) {
    // 扩展方法
    if (columnOptions.headerLevel > 1) {
        this.gridCompLevelColumn.push(columnOptions);
        var oldLength = this.gridCompColumnArr.length;
        this.gridCompColumnArr.length = oldLength - 1;
        if (this.basicGridCompColumnArr && this.basicGridCompColumnArr.length > 0) {
            this.basicGridCompColumnArr.length = oldLength - 1;
        }
    }
};
/*
 * 按照hiddenLevel对column进行排序
 */
var initGridHiddenLevelColumn = function initGridHiddenLevelColumn() {
    if (!this.options.overWidthHiddenColumn) return;
    var oThis = this;
    var w = 0;

    this.gridCompHiddenLevelColumnArr = this.gridCompColumnArr.slice(0);

    this.gridCompHiddenLevelColumnArr.sort(function (a, b) {
        var hiddenLevel1 = a.options.hiddenLevel;
        var hiddenLevel2 = b.options.hiddenLevel;
        if (hiddenLevel1 > hiddenLevel2) {
            return -1;
        } else {
            return 1;
        }
    });
};

var getLevelTitleByField = function getLevelTitleByField(field) {
    for (var i = 0; i < this.gridCompLevelColumn.length; i++) {
        var columnField = this.gridCompLevelColumn[i].field;
        if (columnField == field) {
            return this.gridCompLevelColumn[i].title;
        }
    }
    return '';
};
export var headerLevelFunObj = {
    resetThVariableHeaderLevel: re_resetThVariableHeaderLevel,
    initGridCompColumnHeaderLevelFun: re_initGridCompColumnHeaderLevelFun,
    // initGridHiddenLevelColumn : initGridHiddenLevelColumn,
    getLevelTitleByField: getLevelTitleByField
};