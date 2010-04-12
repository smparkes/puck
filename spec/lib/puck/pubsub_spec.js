"use strict";
(function($){
  describe("puck",function(){
    describe("pubsub",function(){

      var setTimeout = (function(){return this;}()).setTimeout;

      beforeEach(function(){
        this.Subscriber = new Puck.Class( new Puck.Class( [ Puck.Subscriber ] ) );
        this.Publisher = new Puck.Class( new Puck.Class( [ Puck.Publisher ] ) );
        this.sub = new this.Subscriber();
        this.sub2 = new this.Subscriber();
        this.pub = new this.Publisher();
      });

      it("should be possible to subscribe to a publisher",function(){
        this.sub.subscribe({to: this.pub, call: "method"});
      });

      it("should receive callbacks on publisher changes",function(){
        var hash = {a: "b"};
        this.sub.subscribe({to: this.pub, call: "method"});
        this.sub.method = function method(event) {
          expect(event).toEqual(hash);
          complete();
        };
        this.pub.notify(hash);
        incomplete();
      });

      it("should get first event", function() {
        var hash = {a: "b"};
        this.sub.method = function method(event) {
          expect(event).toEqual(hash);
          complete();
        };
        this.sub.subscribe({to: this.pub, call: "method"});
        this.pub.notify(hash);
        incomplete();
      });

      it("should only send event to new object on init request", function() {
        var hash = {a: "b"};
        this.sub2.method = function method(event) {
          expect(event).toEqual(hash);
          this.method = function(event) {
            expect(true).toBe(false);
          };
        };
        this.sub.method = function method(event) {
          expect(event).toEqual(hash);
        };
        setTimeout(function(){
          complete();
        },100);
        this.sub2.subscribe({to: this.pub, call: "method"});
        this.pub.notify(hash);
        this.sub.subscribe({to: this.pub, call: "method"});
        incomplete();
      });

      it("should be possible to unsubscribe", function() {
        this.sub.unsubscribe({to: this.pub, call: "method"});
      });

      it("should not receive callbacks after unsub", function() {
        var hash = {a: "b"};
        this.sub.method = function method(event) {
          expect(event).toBe(hash);
          this.method = function (event) {
            expect(false).toBe(true);
          };
        };
        setTimeout(function(){
          complete();
        },100);
        this.sub.subscribe({to: this.pub, call: "method"});
        this.pub.notify(hash);
        this.sub.unsubscribe({to: this.pub, call: "method"});
        this.pub.notify(hash);
        incomplete();
      });

    });

  });
}(jQuery));