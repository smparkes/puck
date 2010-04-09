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
          });
          
          it("should exist and return the state object", function(){
            expect(this.state.publish_to(this)).toBe(this.state);
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