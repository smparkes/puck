"use strict";
(function () {
  var State = Puck.State =
    new Puck.Class(function State(options) {
      options = options || {};
      this._incremental = "_incremental" in options ? options._incremental : true;
      this._changed = false;
      this._serial_number = void(0);
    }, {
      publish_to: function(publisher) {
        this._publisher = publisher;
        if (this._serial_number !== void(0)) {
          this._publisher.notify(this);
        }
        return this;
      },
      change: function() {
        this._changed = true;
      },
      changed: function() {
        return this._changed;
      },
      commit: function() {
        this._serial_number =
          this._serial_number === void(0) ? 0 : this.serial_number+1;
        if (this._publisher) {
          this._publisher.notify(this);
        }
        this._changed = false;
      },
      event: function(subscriber) {
          throw new Error("implement");
      },
      compute_delta: function() {
        if (!this._incremental) {
          return;
        }
        throw new Error("implement");
      },
      toJSON: function() {
        var json = this.data.toJSON();
        this.compute_delta();
        return this.data.toJSON();
      }
    });

  State.fromJSON = function(/*...*/) {
    throw new Error("implement");
  };

  new Puck.Class.Subscope(State);

  State.Mirror = new State.Class( function(){
  }, {
    subscribe: function(options) {
      var self = this;
      options.via.subscribe({
        to: options.to,
        call: function(event){
          self.update(event);
        }
      });
    },
    update: function(event) {
      if (event.state) {
      } else {
        if (!("from" in event && "to" in event)) {
          throw new Error("cannot reconstruct state from "+event);
        }
      }
      throw new Error("implement");
    }
  });

  var Aggregate = Puck.State.Aggregate =
    new State.Class(function Aggregate(hash) {
      State.apply(this,arguments);
      this.states = hash;
      for(var key in hash) {
        // No tests for the key in ...
        if (true || !(key in this)) {
          this[key] = hash[key];
        }
      }
    }, [ State ], {
      toJSON: function() {
        throw new Error("implement");
      }
    });

  Aggregate.fromJSON = function(/*...*/) {
    throw new Error("implement");
  };

}());