"use strict";
(function () {
  var State = Puck.State =
    new Puck.Class(function State(options) {
      options = options || {};
      this._incremental = "_incremental" in options ? options._incremental : true;
      this._changed = false;
      this._serial_number = 0;
    }, {
      publish_to: function(publisher) {
        this._publisher = publisher;
        return this;
      },
      change: function() {
        this._changed = true;
      },
      changed: function() {
        return this._changed;
      },
      commit: function() {
        this._serial_number = this.serial_number+1;
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