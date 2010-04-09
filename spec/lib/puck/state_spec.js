"use strict";
(function($){
  var State = Puck.State;

  describe("Puck",function(){
    describe("State",function(){

      it("should be defined", function(){
        expect(State).toBeDefined();
      });

      describe("constructor", function(){
        it("should be constructable", function(){
          expect(new State()).toBeDefined();
        });

      });

      describe("methods", function(){
        beforeEach(function(){
          this.state = new State(({a: "b"}));
        });


        describe("change", function(){
          it("should exist", function(){
            expect(this.state.change).toBeDefined();
          });

          it("should not flag unchanged objects as chnaged", function(){
            expect(this.state.changed()).toBe(false);
          });

          it("should flag object as changed", function(){
            this.state.change();
            expect(this.state.changed()).toBe(true);

          });

          it("should reset changed flag after commit", function(){
            this.state.change();
            expect(this.state.changed()).toBe(true);
            this.state.commit();
            expect(this.state.changed()).toBe(false);
          });
        });

        describe("publish_to", function(){
          beforeEach(function(){
            this.state = new State();
            this.notify = function(){};
          });
          
          it("should exist and return the state object", function(){
            expect(this.state.publish_to(this)).toBe(this.state);
          });

          it("should publish the initial state if it exists", function(){
            spyOn(this,"notify");
            this.state.commit();
            this.state.publish_to(this);
            expect(this.notify).wasCalled();
          });

          it("should publish the state value", function(){
            this.notify = function(state){
              expect(state).toBe(this.state);
              complete();
            };
            this.state.commit();
            this.state.publish_to(this);
            incomplete();
          });

          it("should not publish nonexistent initial state", function(){
            spyOn(this,"notify");
            this.state.publish_to(this);
            expect(this.notify).wasNotCalled();
          });

          describe("events", function(){
            beforeEach(function(){
            });
          });
        });
      });

      describe("Aggregate", function(){

        it("should exist", function(){
          expect(State.Aggregate).toBeDefined();
        });

        it("should be constructable from a hash", function(){
          expect(new State.Aggregate({a: new State()})).toBeDefined();
        });

        it("should be expose children", function(){
          var state = new State();
          var aggregate = new State.Aggregate({a: state});
          expect(aggregate.a).toBe(state);
        });

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