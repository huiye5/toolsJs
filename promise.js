/**
 * Created by 灰也 on 2015/11/17.
 */
;(function(global){
	'use strict'

	//if (global.Promise) {return;};
	function isType(type){
		return function (obj){
			return Object.prototype.toString.call(obj) === '[object '+type+']';
		}
	}
	var isFunction=isType('Function');

	//-------------------------------------------------------------
	//参考：http://www.tuicool.com/articles/RzQRV3

	var isThen = function(obj){
		return obj && typeof obj['then'] == 'function';
	}

	//resolves reject 状态修改
	var transition = function(status,value){
		var promise = this;
		if (promise._status !== 0) {
			return;
		}
		setTimeout(function(){
			promise._status = status;
			publish.call(promise,value)
		},0);
	}

	//根据状态执行回调函数函数
	var publish = function(val){
		var promise = this,
			fn,
			st = promise._status === 1,
			queue = promise[st?'_resolves':'_rejects'];

		while(fn = queue.shift()){
			val = fn.call(promise,val) || val;
		}
		promise[st?'_value':'_reason'] = val;
		promise['_resolves'] = promise['_rejects'] = undefined;
	}
	//-------------------------------------------------------------

	var Promise = function(resolver){
		if (!isFunction(resolver)) {
			throw new TypeError('请传入一个函数');
		}
		if (!(this instanceof Promise)) {
			return new Promise(resolver);
		}
		var promise = this;
		promise._value;
		promise._reason;
		promise._status = 0;//pending : 0 初始化; fulfilled = 1 成功; rejected = 2 失败
		promise._resolves = [];//成功回调
		promise._rejects = [];//失败回调

		var resolve = function(val){
			//更改状态：fulfilled
			transition.apply(promise,[1].concat([val]))
		}
		var reject = function(val){
			//更改状态：rejected
			transition.apply(promise,[2].concat([val]))
		}

		resolver(resolve,reject);
	}

	//装载
	Promise.prototype.then = function(onFunl,onReje){
		var promise = this;
		return Promise(function(resolve,reject){
			//装载成功回调
			function callback(val){
				var ret = isFunction(onFunl) && onFunl(val) || val;
				if (isThen(ret)) {
					ret.then(function(value){
						resolve(value);
					},function(reason){
						reject(reason);
					})
				}else{
					resolve(ret);
				}
			}

			//装载失败回调
			function errback(reason){
				reason = isFunction(onReje) && onReje(reason) || reason;
				reject(reason);
			}

			if(promise._status === 0) {
				promise._resolves.push(callback);
				promise._rejects.push(errback);
			}else if (promise._status === 1) {
				callback(promise._value);
			}else if (promise._status === 2) {
				errback(promise._reason);
			}

		});
	}

	global.Promise = Promise;

})(window);