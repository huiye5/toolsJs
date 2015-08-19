/**
 * LinkedList.js - 链表数据结构
 * -- Copyright (c) 2015 huiye
 */

define(function () {
    'use strict';
    /**
      * next - 下一个元素的指针
      * data - 当前存储的信息
      * @param data
      * @constructor
      */
    function Node(element) {
        this.data = element;
        this.next = null;
        if (element.constructor === this.constructor) {
            this.data = element.data;
        }
    }
    Node.prototype.valueOf = function () {
        return this.data;
    }
    Node.prototype.toString = function () {
        return '[object LinkedList.Node]';
    };
    /**
     * 迭代器
     * @param List
     * @constructor
     */
    function Iterator(List) {
        this.list = List;
        this.last = null;//上一个点
        this.start = List.head;//当前点
    }
    Iterator.prototype.hasNext = function () {
        return this.start !== null;
    };
    Iterator.prototype.next = function () {
        this.last = this.start;
        this.start = this.start.next;
        return this.last;
    };
    Iterator.prototype.getLast = function () {
        return this.last;
    };
    Iterator.prototype.getCurrent = function () {
        return this.start;
    };

    /**
     * LinkedList数据结构
     * @constructor
     */
    function LinkedList() {
        this.head = this.end = null;
        this.count = 0;
    }
    LinkedList.prototype.clear = function () {
        this.constructor.call(this);//此想法存在性能bug
    }
    LinkedList.prototype.each = function (iteratee) {
        var iter = this.iterator();
        var item = state = null;
        while (iter.hasNext()) {
            item = iter.getCurrent();//当前节点
            state = iteratee(item, iter.getLast(), item.next);//当前节点，上一个节点，下一个节点
            if (state == 'break') { break; }
            iter.next();
        }
        return this;
    }
    LinkedList.prototype.add = function (data) {
        return this.addEnd(data);
    }
    LinkedList.prototype.addFirst = function (data) {
        var node = new Node(data);
        this.count++;
        if (!this.head) {
            return this._addOne(node);
        }
        var cur = this.head;
        this.head = node;
        this.head.next = cur;
        return this;
    }
    LinkedList.prototype.addEnd = function (data) {
        var node = new Node(data);
        this.count++;
        if (!this.head) {
            return this._addOne(node);
        }
        this.end.next = node;
        this.end = node;
        return this;
    }
    LinkedList.prototype._addOne = function (node) {
        this.head = node;
        this.end = node;
        return this;
    }
    LinkedList.prototype.remove = function (data) {
        var _this = this;
        return this.each(function (itemNode, lastNode, nextNode) {
            if (itemNode.data === data) {
                if (!lastNode && !nextNode) {//只剩最后一个节点
                    _this.clear();//说明全部删除了
                    return 'break';
                }
                else if (!lastNode) {//第一个节点
                    _this.head = nextNode;
                }
                else if (!nextNode) {//最后一个节点
                    lastNode.next = null;
                    _this.end = lastNode;
                } else {
                    lastNode.next = nextNode;
                }
                _this.count--;
                return 'break';
            }
        });
    };
    LinkedList.prototype.insert = function (find, data, front) {
        var _this = this;
        var node = new Node(data);
        var jud = true;
        this.each(function (itemNode, lastNode) {
            if (itemNode.data === find) {
                if (!!front) {//插入到前面
                    if (!lastNode) {
                        node.next = itemNode;
                        _this.head = node;
                    } else {
                        var laNode = lastNode.next;
                        lastNode.next = node;
                        node.next = laNode;
                    }
                } else {//插入到后面
                    var itNode = itemNode.next;
                    itemNode.next = node;
                    node.next = itNode;
                    if (!node.next) {
                        _this.end = node;
                    }
                }
                _this.count++;
                jud = false;
                return 'break';
            }
        });
        if (jud) { throw 'Unable to find the node'; }
        return this;
    };
    LinkedList.prototype.iterator = function () {
        return new Iterator(this);
    };
    LinkedList.prototype.valueOf = function () {
        var arr = [];
        var iter = this.iterator();
        this.each(function (itemNode) {
            arr.push(itemNode);
        });
        return arr;
    };
    LinkedList.prototype.toString = function () {
        return '[object LinkedList]';
    };
    LinkedList.Node = Node;
    LinkedList.Iterator = Iterator;
    return LinkedList;
});