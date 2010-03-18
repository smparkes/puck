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
      subscribe: function subscribe( options ) {
        var to = options.to;
        var continuation = [ this, options.call ];
        options = copy(options);
        if(options.to) {
          delete options.to;
        }
        if(options.call){
          delete options.call;
        }
        to.add_subscription( continuation, options );
      },

      unsubscribe: function subscribe( options ) {
        var to = options.to;
        var continuation = [ this, options.call ];
        options = copy(options);
        if(options.to) {
          delete options.to;
        }
        if(options.call){
          delete options.call;
        }
        to.remove_subscription( continuation, options );
      }

    });
}());