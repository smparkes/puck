"use strict";
(function(){

  // FIXME ... there's gotta be a better way to do this
  var copy = function copy( o ) {
    var c = {}, v;
    for(v in o) {
      c[v] = o[v];
    }
    return c;
  };

  var Subscriber = Puck.Subscriber =
    new Puck.Class( function Subscriber(){
    }, {
      subscribe: function subscribe(options, Continue) {
        var to = options.to;
        var continuation = [this.sub_name_(), options.call];
        options = copy(options);
        if (options.to) {
          delete options.to;
        }
        if (options.call) {
          delete options.call;
        }
        to.add_subscription(continuation, options, Continue);
      },

      unsubscribe: function unsubscribe(options, Continue) {
        var from = options.from;
        var continuation = [this.sub_name_(), options.call];
        options = copy(options);
        if (options.from) {
          delete options.from;
        }
        if (options.call) {
          delete options.call;
        }
        from.remove_subscription(continuation, options, Continue);
      },

      sub_name_: function sub_name_() {
        return this;
      }

    });
}());