import { gridBrowser } from './gridBrowser';

/*
 * 对宽度和高度进行处理
 */
var formatWidth = function formatWidth(w) {
    // 获得宽度
    if (w) {
        return (w + "").indexOf("%") > 0 ? w : parseInt(w) + "px";
    } else {
        return '';
    }
};
/*
 * 两个元素交换位置，要求传入参数e1在e2之前
 */
var swapEle = function swapEle(e1, e2) {
    var n = e1.next(),
        p = e2.prev();
    e2.insertBefore(n);
    e1.insertAfter(p);
};
var getString = function getString(value, defaultValue) {
    if (value === null || value === undefined || value === 'null' || value === 'undefined' || value === "") {
        value = defaultValue;
    }
    if (gridBrowser.isIE8) {
        return [value].join("");
    } else {
        return value + "";
    }
};
var getInt = function getInt(value, defaultValue) {
    if (value === null || value === undefined || value === 'null' || value === 'undefined' || value === "" || isNaN(value)) {
        value = defaultValue;
    }
    return value;
};
var getFloat = function getFloat(value, defaultValue) {
    if (value === null || value === undefined || value === 'null' || value === 'undefined' || value === "" || isNaN(value)) {
        value = defaultValue;
    }
    return value;
};
/*
 * 克隆对象
 */
var cloneObj = function cloneObj(obj) {
    var o;
    if ((typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj)) == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(this.cloneObj(obj[i]));
                }
            } else {
                o = {};
                for (var k in obj) {
                    o[k] = this.cloneObj(obj[k]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
};
/*
 * 处理精度
 */
var DicimalFormater = function DicimalFormater(obj) {
    var value = obj.value + '',
        precision = obj.precision;
    for (var i = 0; i < value.length; i++) {
        if ("-0123456789.".indexOf(value.charAt(i)) == -1) return "";
    }
    return checkDicimalInvalid(value, precision);
};
var checkDicimalInvalid = function checkDicimalInvalid(value, precision) {
    if (value == null || isNaN(value)) return "";
    // 浮点数总位数不能超过10位
    var digit = parseFloat(value);
    var result = (digit * Math.pow(10, precision) / Math.pow(10, precision)).toFixed(precision);
    if (result == "NaN") return "";
    return result;
};
var accAdd = function accAdd(v1, v2) {
    var r1, r2, m;
    try {
        r1 = v1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = v2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (v1 * m + v2 * m) / m;
};
var getTrIndex = function getTrIndex($tr) {
    return $('tr[id!="' + this.options.id + '_edit_tr"][role="row"]', $tr.parent()).index($tr);
};

var getDataTableRowIdByRow = function getDataTableRowIdByRow(row) {
    return row.value['$_#_@_id'];
};

/**
 * 按字节数截取字符串 例:"e我是d".nLen(4)将返回"e我"
 */
String.prototype.substrCH = function (nLen) {
    var i = 0;
    var j = 0;
    while (i < nLen && j < this.length) {
        // 循环检查制定的结束字符串位置是否存在中文字符
        var charCode = this.charCodeAt(j);
        if (charCode > 256 && i == nLen - 1) {
            break;
        }
        //      else if(charCode >= 0x800 && charCode <= 0x10000){
        //          i = i + 3;
        //      }
        else if (charCode > 256) {
                // 返回指定下标字符编码，大于265表示是中文字符
                i = i + 2;
            } //是中文字符，那计数增加2
            else {
                    i = i + 1;
                } //是英文字符，那计数增加1
        j = j + 1;
    };
    return this.substr(0, j);
};

var SortByFun = function SortByFun(field, sortType, eqCall) {
    var oThis = this;
    return function (a, b) {
        var v1 = $(a.value).attr(field);
        var v2 = $(b.value).attr(field);
        var dataType = oThis.getColumnByField(field).options.dataType;
        if (dataType == 'Float') {
            v1 = parseFloat(v1);
            v2 = parseFloat(v2);
            if (isNaN(v1)) {
                return 1;
            }
            if (isNaN(v2)) {
                return -1;
            }
            if (v1 == v2 && eqCall) {
                return eqCall.apply(oThis, arguments);
            }
            return sortType == 'asc' ? v1 - v2 : sortType == 'desc' ? v2 - v1 : 0;
        } else if (dataType == 'Int') {
            v1 = parseInt(v1);
            v2 = parseInt(v2);
            if (isNaN(v1)) {
                return 1;
            }
            if (isNaN(v2)) {
                return -1;
            }
            if (v1 == v2 && eqCall) {
                return eqCall.apply(oThis, arguments);
            }
            return sortType == 'asc' ? v1 - v2 : sortType == 'desc' ? v2 - v1 : 0;
        } else {
            v1 = oThis.getString(v1, '');
            v2 = oThis.getString(v2, '');
            try {
                var rsl = v1.localeCompare(v2);
                if (rsl === 0 && eqCall) {
                    return eqCall.apply(oThis, arguments);
                }
                if (rsl === 0) {
                    return 0;
                }
                return sortType == 'asc' ? rsl : sortType == 'desc' ? -rsl : 0;
            } catch (e) {
                return 0;
            }
        }
    };
};

var getGridRow = function getGridRow(row) {
    var obj = {};
    var nullField = this.options.nullField;
    if (nullField) {
        if (nullField.indexOf(';') > 0) {
            var nullFields = nullField.split(';');
            for (var i = 0; i < nullFields.length; i++) {
                var f = nullFields[i];
                row[f] = null;
            }
        } else {
            row[nullField] = null;
        }
    }
    return row;
};

export var utilFunOjb = {
    formatWidth: formatWidth,
    swapEle: swapEle,
    getString: getString,
    getInt: getInt,
    getFloat: getFloat,
    cloneObj: cloneObj,
    DicimalFormater: DicimalFormater,
    accAdd: accAdd,
    getTrIndex: getTrIndex,
    getDataTableRowIdByRow: getDataTableRowIdByRow,
    SortByFun: SortByFun,
    getGridRow: getGridRow
};