"use strict";
(function($){
  var any = jasmine.any;
  var State = Puck.State;

  describe("Puck",function(){
    describe("State",function(){

      describe("calculate_state", function(){
        it("should return null for null", function(){
          expect(State.calculate_state(null)).toBe(null);
        });
        it("should return undef for undef", function(){
          expect(State.calculate_state(void(0))).toBe(void(0));
        });
        it("should return a number for a number", function(){
          expect(State.calculate_state(3.14159)).toEqual(3.14159);
        });
        it("should return a string for a string", function(){
          expect(State.calculate_state("foobar")).toEqual("foobar");
        });
        it("should return a string for a String", function(){
          var S = String;
          expect(State.calculate_state(new S("foobar"))).toEqual("foobar");
        });
        it("should return a simple object for a simple object", function(){
          expect(State.calculate_state({a: "b"})).toEqual({a: "b"});
        });
      });

      describe("calculate_diff", function(){
        it("should return new state if no old state", function(){
          expect(State.calculate_diff(void(0),{a: "b"})).toEqual({a: "b"});
        });

        it("should do the right thing for simple base types", function(){
          expect(State.calculate_diff("x","y")).toEqual("y");
        });

        it("should do the right thing for simple base types", function(){
          expect(State.calculate_diff("x",void(0))).toEqual(void(0));
        });

        it("should do the right thing for simple base types", function(){
          expect(State.calculate_diff(void(0),"x")).toEqual("x");
        });

        it("should do the right thing for simple identical objects", function(){
          expect(State.calculate_diff({a:"b"},{a:"b"})).toEqual((void(0)));
        });

        it("should do the right thing for simple identical arrays", function(){
          expect(State.calculate_diff(["a", "b"],["a", "b"])).toEqual(void(0));
        });

        it("should do the right thing for simple different arrays", function(){
          expect(State.calculate_diff(["a", "b"],["a", "c"])).toEqual({1:"c"});
        });

        it("should do the right thing for simple different objects", function(){
          expect(State.calculate_diff({a:"b"},{a:10})).toEqual(({a:10}));
        });
        
        it("should do the right thing for less simple identical objects", function(){
          expect(State.calculate_diff({a:"b",c:{d:"e"}},{a:"b",c:{d:"e"}})).toEqual((void(0)));
        });

        it("should do the right thing for less simple objects differing at the top", function(){
          expect(State.calculate_diff({a:"b",c:{d:"e"}},{a:"d",c:{d:"e"}})).toEqual(({a:"d"}));
        });

        it("should do the right thing for less simple objects differing below the top", function(){
          expect(State.calculate_diff({a:"b",c:{d:"e"}},{a:"b",c:{d:"f"}})).toEqual(({c:{d:"f"}}));
        });

        it("should do the right thing for less simple objects differing both places", function(){
          expect(State.calculate_diff({a:"b",c:{d:"e"}},{a:"d",c:{d:"f"}})).toEqual(({a:"d",c:{d:"f"}}));
        });
        
        it("should do the right thing for deleted keys", function(){
          expect(State.calculate_diff({a:"b"},{})).toEqual(({a:State.Deleted}));
        });

        it("should do the right thing for new & delted keys", function(){
          expect(State.calculate_diff({a:"b"},{c: "d"})).toEqual(({a:State.Deleted,c:"d"}));
        });
      });

      xit("should be defined", function(){
        expect(State).toBeDefined();
      });

      describe("constructor", function(){

        xit("should be constructable", function(){
          expect(new State()).toBeDefined();
        });

        xit("should be constructable with paths", function(){
          var a = {c: "a"};
          var b = {c: "b"};
          var state = new State(
            {path: "a", value: a},
            {path: "b", value: b}
          );
          expect(state).toBeDefined();
          expect(state.value.a).toEqual(a);
          expect(state.value.b).toEqual(b);
        });

        xit("should be constructable w/o a path", function(){
          var a = {c: "a"};
          var state = new State({value: a});
          expect(state).toBeDefined();
          expect(state.value).toEqual(a);
        });
      });

      describe("methods", function(){
        beforeEach(function(){
          this.state = new State(
            {path: "a", value: "b"}
          );
        });


        describe("change", function(){
          xit("should exist", function(){
            expect(this.state.change).toBeDefined();
          });

          xit("should not flag unchanged objects as changed", function(){
            expect(this.state.changed()).toBe(false);
          });

          xit("should flag object as changed", function(){
            this.state.change();
            expect(this.state.changed()).toBe(true);
          });

          xit("should reset changed flag after commit", function(){
            this.state.change();
            expect(this.state.changed()).toBe(true);
            this.state.commxit();
            expect(this.state.changed()).toBe(false);
          });
        });

        describe("publish", function(){
          beforeEach(function(){
            this.state = new State(
              {path: "a", value: "b"}
            );
            this.link = function(){};
            this.notify = function(){};
          });
          
          xit("should exist and return the state object", function(){
            expect(this.state.publish({via: this})).toBe(this.state);
          });

          xit("should publish the initial state if it exists", function(){
            spyOn(this,"notify");
            this.state.commxit();
            this.state.publish({via:this});
            expect(this.notify).wasCalled();
          });

          xit("should publish initial state", function(){
            spyOn(this,"notify");
            this.state.publish({via:this});
            expect(this.notify).wasCalled();
          });

          xit("should expose the contents", function(){
            expect(this.state.value.a).toEqual("b");
          });

          xit("should publish the state event on change", function(){
            this.notify = function(event){
              expect(event).toEqual([{
                serial_number: 1,
                diff: {a: 10}
              }]);
              complete();
            };
            this.state.value.a = 10;
            this.state.changed();
            this.state.commxit();
            this.state.publish({via:this});
            incomplete();
          });

        });
      });

      describe("value", function(){

        xit("should exist", function(){
          expect(State.value).toBeDefined();
        });

        xit("should be constructable from a pair", function(){
          var object = {a: "value"};
          expect(new State({value: State.value(object,"a")})).toBeDefined();
        });

        xit("should expose value", function(){
          var object = {a: "value"};
          var state =  new State({value: State.value(object,"a")});
          expect(state.value.get()).toBe(object.a);
        });

      });
    });

    describe("pubsub",function(){

      xit("should update the subscriber after sub", function(){
        this.subscriber = new Puck.Subscriber();
        this.publisher = new Puck.Publisher();

        var state = {a: "b"};

        this.publisher.state = new State(
          state,
          {path: "c", value: "d"}
        );
        this.publisher.state.publish({via: this.publisher});

        this.subscriber.state = new State({path: "a",
                                           value: function(){}});

        spyOn(this.subscriber.state,"value").andCallFake(function(s){
          expect(s).toEqual(state);
          complete();
        });

        this.subscriber.state.subscribe({to: this.publisher, via: this.subscriber});

        incomplete();
      });

      xit("should make state avaliable via pub and sub", function(){
        this.subscriber = new Puck.Subscriber();
        this.publisher = new Puck.Publisher();
        var state = {a: "b"};
        this.publisher.state = new State({a: "b"});
        this.subscriber.state = new State({});
        this.subscriber.state.subscribe({to:this.publisher, via:this.subscriber});
        expect(this.publisher.state.value()).toEqual(state);
        expect(this.subscriber.state.value()).toEqual(state);
      });

    });

  });
}(jQuery));

/*

{a: "b"} => {} => {}, {deleted: ["a"]}

{a: ["b", "c"]} => {a: "b"}, {changed: ["a"]}

{a: ["b", "c"]} => {a: ["b"]}, {deleted: {a: [1]}}

{a: ["b", "c"]} => {a: ["b", "c", "d"]}, {added: {a: [{2: "d"}]}}

{a: {b: [0]}} => {a: {b: [0, 1]}} => {added: {a: {b: {1: 1}}}}

{a: {c: 0}} => {a: {b: 0, c: 1}} => {added: {a: {b: 0}}}
 
{current: {id:..., value:}
 previous: {id: ..., value: }
 changed: {...}
 changes: [...]}

diff
  toState
    toJSON
fromState
applyDiff

object.state(...)
object.diff(...) =>
{from: 1,
 to: 2,
 diff: [
   {add: {a: b}}
   {change: {a: b}}
   {delete: {a: undefined}}
 ]}
object.apply_diff(...)


*/