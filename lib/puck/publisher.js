"use strict";
(function () {
  var Publisher = Puck.Publisher =
    new Puck.Class(function Publisher() {
    }, {
      add_subscription: function add_subscription(callback, options) {
        options = options || {};
        this.subscriptions = this.subscriptions || []; 
        var record = [ callback, options.state_id ];
        this.subscriptions.push( record );
        // console.debug($.print(record));
        this.call_(record, this.state);
      },

      remove_subscription: function remove_subscription(callback, options) {
        options = options || {};
        this.subscriptions = this.subscriptions || []; 
        for(var i=0; i<this.subscriptions.length; i++) {
          var record = this.subscriptions[i];
          if (record[0][0] === callback[0] && record[0][1] === callback[1]) {
            delete this.subscriptions[i];
            break;
          }
        }
      },

      notify: function notify(state) {
        this.state_id = ( this.state_id && this.state_id+1 ) || 1;
        this.call_all_(state);
        this.state = state;
      },

      call_all_: function call_all_(new_state) {
        var i, records = this.subscriptions;
        for (i in records) {
          var record = records[i]; 
          this.call_(record, new_state);
        }
      },

      call_: function call_(record, new_state) {
        if (record[1] !== this.state_id) {
          if (false && record[1] && record[1] === this.state_id-1) {
            record[1] = this.state_id;
            throw new Error("implement incremental");
          } else {
            record[1] = this.state_id;
            var object = record[0][0], method = record[0][1];
            this.invoke_(object,method,new_state);
          }
        }
      },

      invoke_: function call_(object,method,new_state) {
        object[method].call(object,new_state);
      }

    });
}());