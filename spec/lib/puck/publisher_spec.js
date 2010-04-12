"use strict";
(function($){
  describe("puck",function(){
    describe("publisher",function(){

      it("should be posssible to mix publisher in",function(){
        var cls = function(){};
        $.extend(cls.prototype,Puck.Publisher.prototype);
      });

      it("should accept subscription requests w/o options", function() {
        var Cls = function(){};
        $.extend(Cls.prototype,Puck.Publisher.prototype);
        var pub =  new Cls();
        pub.add(function(){});
      });

      it("should accept subscription cancelations");
      it("should call callbacks on events");

    });

  });
}(jQuery));