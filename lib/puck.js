"use strict";
(function(){

  var include = function(fn) {
    // 1: during parse
    // -> use document.write
    // 2: outside of parse
    //  a: by jazz
    //  -> use jazz
    //  b: not by jazz
    //  -> use?

    // for now: use jazz if it exists, else doc write
    // not perfect match, but good enough for now?

    var global = (function(){return this;}());
    if (global.jazz) {
      global.jazz.include(fn);
    } else {
      global.document.write("<script src='"+fn+"'></script>");
    }
  };

  var each = function(object, fn) {
    return (function each(prefix, object, fn) {
      if(typeof object === "string" ||
         typeof object === "object" && object instanceof String) {
        fn(prefix.concat(object).join("/"));
      } else if(object instanceof Array) {
        for(var i=0; i < object.length; i++) {
          each(prefix,object[i],fn);
        }
      } else {
        for(var key in object) {
          each(prefix.concat(key),object[key],fn);
        }
      }
    }([],object,fn));
  };

  var javascript = {"vendor/feste/lib/feste": ["feste", "class"],
                    "lib": {"puck": [ "puck", "publisher", "subscriber" ] }};

  each(javascript,function(fn) {
    include(fn+".js");
  });

}());