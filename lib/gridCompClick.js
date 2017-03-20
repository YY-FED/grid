(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.gridCompClick = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    /*
     * 双击/单击处理
     */
    var isDblEvent = function isDblEvent(eventname, dbFun, dbArg, Fun, Arg) {
        if (this.currentEventName != null && this.currentEventName == eventname) {
            dbFun.call(this, dbArg);
            this.currentEventName = null;
            if (this.cleanCurrEventName) clearTimeout(this.cleanCurrEventName);
        } else {
            var oThis = this;
            if (this.cleanCurrEventName) clearTimeout(this.cleanCurrEventName);
            this.currentEventName = eventname;
            this.cleanCurrEventName = setTimeout(function () {
                oThis.currentEventName = null;
                Fun.call(oThis, Arg);
            }, 250);
        }
    };
    /*
     * 双击处理
     */
    var dblClickFun = function dblClickFun(e) {
        if (typeof this.options.onDblClickFun == 'function') {
            var $tr = $(e.target).closest('tr');
            if ($tr[0].id == this.options.id + '_edit_tr') {
                return;
            }
            var index = 0;
            if ($tr.length > 0) {
                index = this.getTrIndex($tr);
            }
            var obj = {};
            obj.gridObj = this;
            obj.rowObj = this.dataSourceObj.rows[index];
            obj.rowIndex = index;
            this.options.onDblClickFun(obj);
        }
    };
    /*
     * 单击处理
     */
    var clickFun = function clickFun(e) {
        var oThis = this;

        // 处理focus事件
        var $tr = $(e.target).closest('tr');
        if ($tr.length > 0 && $tr[0].id == this.options.id + '_edit_tr') {
            return;
        }
        var index = this.getTrIndex($tr);
        if (typeof this.options.onBeforeClickFun == 'function') {
            var obj = {};
            obj.gridObj = this;
            obj.rowObj = this.dataSourceObj.rows[index];
            obj.rowIndex = index;
            obj.e = e;
            if (!this.options.onBeforeClickFun(obj)) {
                return;
            }
        }
        // 处理树表展开/合上
        this.clickFunTree(e);
        if ($tr.length > 0) {

            var row = oThis.dataSourceObj.rows[index];
            if (row) {
                if (oThis.options.rowClickBan) {
                    return;
                }
                this.clickFunEdit(e, index);
                var rowChildIndex = oThis.getChildRowIndex(row);
                if (oThis.options.contentFocus || !oThis.options.multiSelect) {
                    if (oThis.dataSourceObj.rows[index].focus && oThis.options.cancelFocus) {
                        oThis.setRowUnFocus(index);
                    } else {
                        if (!oThis.dataSourceObj.rows[index].focus) {
                            oThis.setRowFocus(index);
                        }
                    }
                }
                if (oThis.options.contentSelect || !oThis.options.multiSelect) {
                    if (oThis.dataSourceObj.rows[index].checked && oThis.options.cancelSelect) {
                        oThis.setRowUnselect(index);
                    } else {
                        if (!oThis.dataSourceObj.rows[index].checked) {
                            oThis.setRowSelect(index);
                        }
                    }
                }
            }
        }
    };
    var clickFunTree = function clickFunTree(e) {};
    var clickFunEdit = function clickFunEdit(e) {};

    var clickFunObj = exports.clickFunObj = {
        isDblEvent: isDblEvent,
        dblClickFun: dblClickFun,
        clickFun: clickFun,
        clickFunTree: clickFunTree,
        clickFunEdit: clickFunEdit
    };
});