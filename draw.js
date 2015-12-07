/**
 * draw.js
 * -- Copyright (c) 2015.12 灰也
 * -- email : oncoy5@163.com
 */
//----------------------------------------------------------------------------------
define('draw',[],function(){
  'use strict';

  function noop(){}

  function isPc(){  
    var userAgentInfo = navigator.userAgent;  
    var agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
    var flag = true;  
    for (var i = 0; i < agents.length; i++) {  
      if (userAgentInfo.indexOf(agents[i]) > 0) { flag = false; break; }  
    }  
    return flag;  
  }

  if (isPc()) {return noop;};

  //返回角度
  function GetSlideAngle(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }
 
  
  /*
   *根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
   *  start-[x,y]  :开始位置
   *  end-[x,y]  :结束位置
   *  sign-[Dx,Dy]  :是否判定为滑动的标识距离
   */
  function GetSlideDirection(startX, startY, endX, endY, signDx, signDy) {
    var dy = startY - endY;
    var dx = endX - startX;
    var result = 0;
    //如果滑动距离太短 - 2,2
    if(Math.abs(dx) < signDx && Math.abs(dy) < signDy) {
      return result;
    }
    var angle = GetSlideAngle(dx, dy);
    if(angle >= -45 && angle < 45) {
      result = 4;
    }else if (angle >= 45 && angle < 135) {
      result = 1;
    }else if (angle >= -135 && angle < -45) {
      result = 2;
    }else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      result = 3;
    }
     return result;
  }

  /*
   *  判断结果执行
   *  start-[x,y]  :开始位置
   *  end-[x,y]  :结束位置
   *  sign-[Dx,Dy]  :是否判定为滑动的标识距离
   *  [null,top,bottom,left,right]-Fn  :各方位执行函数
   */
  function drawEndCallback(options){
    var direction = GetSlideDirection(
      options.startX, options.startY, 
      options.endX, options.endY,
      options.signDx, options.signDy);
    switch(direction) {
      case 0:
        !!options.nullFn && options.nullFn(options.startX, options.startY, options.endX, options.endY);
        break;
      case 1:
        !!options.topFn && options.topFn(options.startX, options.startY, options.endX, options.endY);
        break;
      case 2:
        !!options.bottomFn && options.bottomFn(options.startX, options.startY, options.endX, options.endY);
        break;
      case 3:
        !!options.leftFn && options.leftFn(options.startX, options.startY, options.endX, options.endY);
        break;
      case 4:
        !!options.rightFn && options.rightFn(options.startX, options.startY, options.endX, options.endY);
        break;
    }
  }
  var win = window;
  var doc = document;
  var Draw = function(element, options){
    this.element = element;
    
    this.options = $.extend({},{
      //四个方位结束fn
      nullFn: '',
      topFn: '',
      bottomFn: '',
      leftFn: '',
      rightFn: '',
      //开始fu
      startFn: '',
      //移动中
      moveFn: '',
      //是否判断成立四个方位距离标准
      signDx: 2, 
      signDy: 2
    },options);
    this.tmoveX, this.tmoveY, this.startX, this.startY;
    this._into();
  }

  Draw.prototype._into=function(){
    var _this = this;
    this.element.addEventListener('touchstart',function(ev){
      _this._execStart.call(_this, ev.touches[0].pageX, ev.touches[0].pageY);
    },false);
    this.element.addEventListener('touchmove',function(ev){
      _this._execMove.call(_this, ev.touches[0].pageX, ev.touches[0].pageY);
    },false);
    this.element.addEventListener('touchend',function(ev){
      _this._execEnd.call(_this, ev.changedTouches[0].pageX, ev.changedTouches[0].pageY);
    },false);
  }
  Draw.prototype._execStart = function(startX, startY){
    this.options.startX = this.tmoveX = this.startX = startX;
    this.options.startY = this.tmoveY =this.startY = startY;
    !!this.options.startFn && this.options.startFn();
  }
  Draw.prototype._execMove = function(moveX, moveY){
    !!this.options.moveFn && this.options.moveFn(this.startX, this.startY, moveX, moveY, this.tmoveX, this.tmoveY);
    this.tmoveX = moveX;
    this.tmoveY = moveY;
  }
  Draw.prototype._execEnd = function(endX, endY){
    this.options.endX = this.endX = endX;
    this.options.endY =this.endY = endY;
    drawEndCallback(this.options)
  }


  return Draw;
});
