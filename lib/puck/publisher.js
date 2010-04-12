"use strict";
(function () {
  var Publisher = Puck.Publisher =
    new Puck.Class(function Publisher() {
    }, {
      link: function(callback) {
        this.callback = callback;
      },

      add: function add(callback) {
        this.subscriptions = this.subscriptions || []; 
        this.subscriptions.push( callback );
        if (this.callback) {
          this.callback({add: callback});
        }
      },

      remove: function remove(callback) {
        this.subscriptions = this.subscriptions || []; 
        // Array-like, but we delete keys ...
        for(var i in this.subscriptions) {
          var subscription = this.subscriptions[i];
          if (subscription[0] === callback[0] && subscription[1] === callback[1]) {
            if (this.callback) {
              this.callback({remove: this.subscriptions[i]});
            }
            delete this.subscriptions[i];
            break;
          }
        }
      },

      notify: function notify(/*...*/) {
        this.call_all(arguments);
      },

      call_all: function call_all(event) {
        var i, callbacks = this.subscriptions;
        for (i in callbacks) {
          var callback = callbacks[i]; 
          this.call(callback, event);
        }
      },

      call: function call(callback, event) {
        var object = callback[0], method = callback[1];
        this.invoke(object, method, event);
      },

      invoke: function call(object, method, event) {
        if (!(method instanceof Function)) {
          method = object[method]; 
        } 
        method.apply(object, event);
      }

    });
}());