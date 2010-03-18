"use strict";
(function($){
  describe("puck",function(){
    describe("subscriber",function(){
      it("should be posssible to mix subscriber in",function(){
        var Cls = function(){};
        $.extend(Cls.prototype,Puck.Subscriber.prototype);
      });
    });
  });
}(jQuery));