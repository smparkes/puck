"use strict";
(function () {
  var global = (function(){return this;}());
  var State = Puck.State =
    new Puck.Class(function State(/*...*/) {
      if (this.constructor === State && arguments.length === 0) {
        return this;
      }

      this._changed = false;
        
      var self = this;
      var unbound_update = this.update;
      this.update = function() {
        unbound_update.apply(self,arguments);
      };

      var value_set = false;

      for(var i=0; i<arguments.length; i++) {
        var arg = arguments[i];
        var path = arg.path;
        if (path) {
          this.value = this.value || {};
          if ("value" in arg) {
            this.value[path] = arg.value;
            if (typeof arg.value !== "function") {
              value_set = true;
            }
          }
        } else {
          if (this.value) {
            throw new Error("value without a path must preceed values with a path");
          }
          if ("value" in arg) {
            value_set = true;
            if (typeof arg.value !== "function") {
              this.value = arg.value;
            }
          }
        }
      }

      if (value_set) {
        this.commit();
      }
 
      return this;
    }, {
      publish: function(options) {
        options = options || {};
        this._publisher = options.via;
        var self = this;
        this._publisher.link(function(change){
          if ("add" in change) {
            self.notify(change.add);
            return;
          } else if ("remove" in change) {
            throw new Error("implement:"+global.$.print(change));
          }
          throw new Error("invalid publish change request");
        });
        this.notify();
        return this;
      },
      subscribe: function(options) {
        options = options || {};
        options.via.subscribe({to: options.to, call: this.update});
      },
      change: function() {
        this._changed = true;
      },
      changed: function() {
        return this._changed;
      },
      commit: function() {
        this.old_state = this.new_state;
        this.new_state = this.constructor.calculate_state(this.value);
        this.current_diff = this.constructor.calculate_diff(this.old_state, this.new_state);
        this._serial_number = (this._serial_number === void(0) ? 0 : this._serial_number) + 1;
        this._changed = false;
        this.notify();
      },
      notify: function(subscriber) {
        if (this._publisher) {
          var event = [{serial_number: this._serial_number,
                        diff: this.current_diff}];
          if (subscriber) {
            this._publisher.call(subscriber, event);
          } else {
            this._publisher.notify(event);
          }
        }
      },
      event: function(subscriber) {
          throw new Error("implement");
      },
      set_state: function(diff) {
        this.current_state = diff;
      },
      trigger_callbacks: function(value, diff, state) {
        global.console.debug("tc",global.$.print(arguments));
        if (value.update) {
          throw new Error("implement");
        }
        if (value.value) {
          throw new Error("implement");
        }
        for(var key in diff) {
          if (value[key]) {
            this.trigger_callbacks(value[key], diff[key], state[key]);
          }
        }
      },
      update: function(diff) {
        global.console.debug("upd",global.$.print(arguments));
        if (this._serial_number === void(0)) {
          this._serial_number = diff.serial_number;
          this.set_state(diff.diff);
        } else {
          throw new Error("implement");
        }
        this.trigger_callbacks(this.value, diff.diff, this.new_state);
      },
      toJSON: function() {
        if (true) {
          throw new Error("implement");
        }
        var json = this.data.toJSON();
        this.compute_delta();
        return this.data.toJSON();
      }
    });

  State.fromJSON = function(/*...*/) {
    throw new Error("implement");
  };

  State.calculate_object_state = function(value) {
    var state = {};
    for(var key in value) {
      state[key] = this.calculate_state(value[key]);
    }
    return state;
  };

  State.calculate_state = function(value) {
    if (value instanceof State.Value) {
      value = value.get();
    }
    switch(value){
     case null:
      return null;
    case void(0):
      return void(0);
    }
    switch(typeof value){
     case "string":
      return value;
     case "number":
      return value;
     case "object":
      if (value instanceof String) {
        return value.toString();
      }
      if (value instanceof Array) {
        throw new Error("implement: "+global.$.print(value));
      }
      return this.calculate_object_state(value);
    }
    throw new Error("implement: "+global.$.print(value),typeof value);
  };

  State.Deleted = ({});

  var diff;

  var diff_object = function(old_state, new_state) {
    var different = false;
    var diff_object = {};
    for(var key in new_state) {
      if (key in old_state) {
        var key_diff = diff(old_state[key], new_state[key]);
        if (key_diff !== void(0)) {
          different = true;
          diff_object[key] = key_diff;
        }
      } else {
        different = true;
        diff_object[key] = new_state[key];
      }
    }
    for(key in old_state) {
      if (!(key in new_state)) {
        different = true;
        diff_object[key] = State.Deleted;
      }
    }
    return different ? diff_object : void(0);
  };

  diff = function(old_state, new_state) {
    global.console.debug("diff",global.$.print(arguments));
    if (typeof old_state !== typeof new_state) {
      return new_state;
    }
    if (typeof new_state === "object") {
      if (new_state === null) {
        throw new Error("implement: "+global.$.print(old_state)+" "+global.$.print(new_state));
      } /* else if (new_state instanceof Array) {
        throw new Error("implement: "+global.$.print(old_state)+" "+global.$.print(new_state));
      } */ else {
        return diff_object(old_state, new_state);
      }
    }
    if (old_state === new_state) {
      return void(0);
    } else {
      return new_state;
    }
  };

  State.calculate_diff = function(old_state, new_state) {
    return diff(old_state, new_state);
  };

  new Puck.Class.Subscope(State);

/*
  State.Mirror = new State.Class( function(){
    State.apply(this);
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
        throw new Error("implement");
      } else {
        if (!("from" in event && "to" in event)) {
          throw new Error("cannot reconstruct state from "+event);
        }
        throw new Error("implement");
      }
      throw new Error("implement");
    }
  });
*/

  State.Value = new State.Class(function Value(object, value){
    // State.apply(this);
    this.object = object;
    this.value = value;
  }, [State], {
    get: function(){
      return this.object[this.value];
    },
    set: function(v){
      return (this.object[this.value] = v);
    }
  });

  State.value = function(object,value) {
    return new State.Value(object, value);
  };

/*
  State.Object = new State.Class(function Object(object){
    State.apply(this);
    this.object = object;
  }, [State], {
    value: function(){
      return this.object;
    }
  });

  State.object = function(object) {
    return new State.Object(object);
  };

  State.States = new State.Class(function States(hash){
    State.apply(this);
    this.states = {};
    for(var key in hash) {
      this.states[key] = new State(hash[key]);
    }
  }, [State], {
    toJSON: function() {
      throw new Error("implement");
    }
  });

  State.States.fromJSON = function(/ *...* /) {
    throw new Error("implement");
  };

  State.states = function(hash) {
    return new State.States(hash);
  };
*/

}());