"use strict";
(function(){

  var Subscriber = Puck.Subscriber =
    new Puck.Class( function Subscriber(){
    }, {
      subscribe: function subscribe(options, Continue) {
        var to = options.to;
        var continuation = [this.sub_name_(), options.call];
        to.add(continuation, Continue);
      },

      unsubscribe: function subscribe(options, Continue) {
        var to = options.to;
        var continuation = [this.sub_name_(), options.call];
        to.remove(continuation, Continue);
      },

      sub_name_: function sub_name_() {
        return this;
      }

    });
}());