/**
 * tools.js - Array
 * -- Copyright (c) 2015 huiye
 */

/*
 * 根据下标删除数组元素
 * dx - 数组下标
 */
Array.prototype.baoremove = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    this.splice(dx, 1);
}