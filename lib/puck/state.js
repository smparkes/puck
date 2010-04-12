"use strict";
(function () {
  var global = (function(){return this;}());
  var State = Puck.State =
    new Puck.Class(function State(/*...*/) {
      if (this.constructor === State && arguments.length === 0) {
        return this;
      }

      this._changed = false;
      this.filters = {};
        
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
            this.value = arg.value;
            if (typeof arg.value !== "function") {
              value_set = true;
            }
          }
        }
      }

      // console.debug("tv",$.print(this.value));

      if (value_set) {
        this.commit();
      }
 
      return this;
    }, {
      add_to_filters: function(filters, paths, callback, state) {
        // console.debug("atf",$.print(arguments));
        var matches = false;
        switch(typeof paths) {
         case "boolean":
          if (paths === false) {
            throw new Error("implement:"+global.$.print(arguments));
          }
          filters.callbacks = filters.callbacks || [];
          filters.callbacks.push(callback);
          var last = filters.callbacks[filters.callbacks.length-1];
          // console.debug("a",last[0] === callback[0] && last[1] === callback[1]);
          // this.notify([this._serial_number, state], callback);
          return true;
         case "object":
          for(var key in paths) {
            filters[key] = filters[key] || {};
            matches = matches || this.add_to_filters(filters[key], paths[key], callback, state[key]);
          }
          return matches;
        default:
          throw new Error("implement:"+global.$.print(arguments));
        }
      },
      event_for: function(subscriber, event, filters) {
        var sn = event[0];
        var diff = event[1];
        // console.debug("d4",$.print(diff));
        var callbacks = filters.callbacks || [];
        for(var i=0; i < callbacks.length; i++) {
          if (callbacks[i][0] === subscriber[0] && callbacks[i][1] === subscriber[1]) {
            return [sn, diff];
          }
        }
        switch(typeof diff) {
         case "foo":
          break;
         case "object":
          var found = 0;
          var found_key;
          for(var key in filters) {
            var filter = filters[key];
            callbacks = filter.callbacks;
            for(i=0; i < callbacks.length; i++) {
/*
              console.debug("check",$.print(callbacks[i]),$.print(subscriber),callbacks[i][0] === subscriber[0] &&
                            callbacks[i][1] === subscriber[1]);
*/
              if (callbacks[i][0] === subscriber[0] && callbacks[i][1] === subscriber[1]) {
                found_key = key;
                found = found+1;
                if (found > 1) {
                  break;
                }
              }
            }
            if (found === 0) {
              throw new Error("implement");
            } else if (found === 1) {
              // console.debug(found_key,diff[found_key]);
              return this.event_for(subscriber, [sn, diff[found_key]], filters[found_key]);
            } else {
              throw new Error("implement");
            }
          }
          throw new Error("implement: "+typeof(diff)+" "+global.$.print(arguments));
        default:
          throw new Error("implement: "+typeof(diff)+" "+global.$.print(arguments));
        }
      },
      publish: function(options) {
        options = options || {};
        this._publisher = options.via;
        var self = this;
        this._publisher.link(function(change){
          // global.console.debug("link",global.$.print(change));
          if ("add" in change) {
            // console.debug("adx",$.print(arguments),change.add+"");
            if (self.add_to_filters(self.filters, change.link, change.add, self.new_state)) {
              self.notify([self._serial_number, self.new_state], change.add);
            }
            return void(0);
          } else if ("remove" in change) {
            throw new Error("implement:"+global.$.print(change));
          } else if ("call" in change) {
            var callback = change.call[0];
            var event = change.call[1];
            return self.event_for(callback, event, self.filters);
          }
          if (true) {
            throw new Error("invalid publish change request: "+global.$.print(change));
          }
          return void(0);
        });
        this.notify([this._serial_number, this.new_state]);
        return this;
      },
      paths: function(value) {
        switch(typeof value) {
         case "object":
          var object = {};
          for(var key in value) {
            object[key] = this.paths(value[key]);
          }
          return object;
         case "function":
          return true;
        default:
          throw new Error("implement: "+typeof value+" "+global.$.print(value));
        }
      },
      subscribe: function(options) {
        options = options || {};
        options.via.subscribe({to: options.to,
                               call: this.update,
                               link: this.paths(this.value)});
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
        this._serial_number = (this._serial_number === void(0) ? 0 : this._serial_number + 1);
        var diff = [this._serial_number, this.constructor.calculate_diff(this.old_state, this.new_state)];
        this._changed = false;
        this.notify(diff);
      },
      notify: function(event, subscriber) {
        // global.console.debug("n",$.print(arguments));
        if (this._publisher) {
          if (subscriber) {
            event = this.event_for(subscriber, event, this.filters);
            if (event[1] !== State.None) {
              this._publisher.call(subscriber, event);
            }
          } else {
            // console.debug("d");
            this._publisher.notify(event);
          }
        }
      },
      event: function(subscriber) {
          throw new Error("implement");
      },
      set_state: function(diff) {
        this.new_state = diff;
      },
      trigger_callbacks: function(value, diff, state) {
        // global.console.debug("tc",global.$.print(arguments));
        if (value instanceof Function || value.value) {
          var fn = value instanceof Function  ? value : value.value;
          fn(state);
          return;
        } else if (value.update) {
          global.console.debug("implement 1");
          throw new Error("implement");
        }
        switch(typeof diff) {
         case "foo":
          break;
         case "bar":
          break;
        default:
          global.console.debug("implement "+global.$.print(arguments));
          throw new Error("implement "+global.$.print(arguments));
        }
/*
          if (value[key]) {
            global.console.debug("key",key);
            this.trigger_callbacks(value[key], diff[key], state[key]);
          }
*/
      },
      update: function(sn, diff) {
        // global.console.debug("upd",global.$.print(arguments));
        if (this._serial_number === void(0)) {
          this._serial_number = sn;
          this.set_state(diff);
        } else {
          global.console.debug("fail");
          throw new Error("implement");
        }
        this.trigger_callbacks(this.value, diff, this.new_state);
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
    // global.console.debug("diff",global.$.print(arguments));
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

  State.None = Puck.Publisher.None;

}());