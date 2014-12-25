System.registerModule("facade/lang", [], function() {
  "use strict";
  var __moduleName = "facade/lang";
  var CONST = function CONST() {};
  ($traceurRuntime.createClass)(CONST, {}, {});
  return {get CONST() {
      return CONST;
    }};
});
System.registerModule("fixtures/component", [], function() {
  "use strict";
  var __moduleName = "fixtures/component";
  var CONST = System.get("facade/lang").CONST;
  var Inject = function Inject(token) {
    this.token = token;
  };
  ($traceurRuntime.createClass)(Inject, {
    get token() {
      return this.$__0;
    },
    set token(value) {
      this.$__0 = value;
    }
  }, {});
  Object.defineProperty(Inject, "annotations", {get: function() {
      return [new CONST()];
    }});
  var InjectPromise = function InjectPromise(token) {
    this.token = token;
  };
  ($traceurRuntime.createClass)(InjectPromise, {
    get token() {
      return this.$__1;
    },
    set token(value) {
      this.$__1 = value;
    }
  }, {});
  Object.defineProperty(InjectPromise, "annotations", {get: function() {
      return [new CONST()];
    }});
  var InjectLazy = function InjectLazy(token) {
    this.token = token;
  };
  ($traceurRuntime.createClass)(InjectLazy, {
    get token() {
      return this.$__2;
    },
    set token(value) {
      this.$__2 = value;
    }
  }, {});
  Object.defineProperty(InjectLazy, "annotations", {get: function() {
      return [new CONST()];
    }});
  var DependencyAnnotation = function DependencyAnnotation() {};
  ($traceurRuntime.createClass)(DependencyAnnotation, {}, {});
  Object.defineProperty(DependencyAnnotation, "annotations", {get: function() {
      return [new CONST()];
    }});
  return {
    get Inject() {
      return Inject;
    },
    get InjectPromise() {
      return InjectPromise;
    },
    get InjectLazy() {
      return InjectLazy;
    },
    get DependencyAnnotation() {
      return DependencyAnnotation;
    }
  };
});
System.get("fixtures/component" + '');
