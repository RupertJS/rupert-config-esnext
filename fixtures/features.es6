// All the ES6 things...
// https://github.com/google/traceur-compiler/wiki/LanguageFeatures

var expect = (v)=> {
    return {
        to: {
            be: {
                eql: (e)=> {
                    if(e instanceof Array){
                        for(var i = 0; i < e.length; i++){
                            if (e[i] !== v[i]) {
                                throw new Error `${v} does not equal ${e} at ${i}`;
                            }
                        }
                    } else if (e instanceof Object){
                        for (let k of Object.keys(e)) {
                            if(e[k] != v[k]){
                                throw new Error `${v} does not equal ${e} at ${k}`;
                            }
                        }
                    } else {
                        if (e !== v) {
                            throw new Error `${v} does not equal ${e}`;
                        }
                    }
                }
            }
        }
    }
}

/* Array Comprehensions http://people.mozilla.org/~jorendorff/es6-draft.html#sec-array-comprehension */

var array = [for (x of [0, 1, 2]) for (y of [0, 1, 2]) x + '' + y];
expect(array).to.be.eql([
  '00', '01', '02', '10', '11', '12', '20', '21', '22'
]);


/* Arrow Functions http://people.mozilla.org/~jorendorff/es6-draft.html#sec-arrow-function-definitions */

var square = (x) => {
  return x * x;
};
var square2 = x => x * x;
var objectify = x => ({ value: x }); // Immediate return of an object literal must be wrapped in parentheses
expect(square(4)).to.be.eql(16);
expect(square2(4)).to.be.eql(16);
expect(objectify(1)).to.be.eql({ value: 1 });


/* Classes http://people.mozilla.org/~jorendorff/es6-draft.html#sec-class-definitions*/

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Monster extends Character {
  constructor(x, y, name) {
    super(x, y);
    this.name = name;
    this.health_ = 100;
  }

  attack(character) {
    super.attack(character);
    // Can also be written as:
    // super(character);
  }

  get isAlive() { return this.health_ > 0; }
  get health() { return this.health_; }
  set health(value) {
    if (value < 0) throw new Error('Health must be non-negative.');
    this.health_ = value;
  }
}
var myMonster = new Monster(5,1, 'arrrg');
expect(myMonster.health).to.be.eql(100);
expect(myMonster.isAlive).to.be.eql(true);
expect(myMonster.x).to.be.eql(5);
myMonster.health = 10;
expect(myMonster.health).to.be.eql(10);
expect(myMonster.name).to.be.eql('arrrg');

/* Computed Property Names */
var x = 0;
var obj = {
  [x]: 'hello'
};
expect(obj[0]).to.be.eql('hello');



/* Default Params http://people.mozilla.org/~jorendorff/es6-draft.html#sec-function-definitions */
function f(list, indexA = 0, indexB = list.length) {
  return [list, indexA, indexB];
}
// TODO expect should be smarter.
// expect(f([1,2,3])).to.be.eql([[1,2,3], 0, 3]);
// expect(f([1,2,3], 1)).to.be.eql([[1,2,3], 1, 3]);
// expect(f([1,2,3], 1, 2)).to.be.eql([[1,2,3], 1, 2]);


/* Destructuring Assignment http://people.mozilla.org/~jorendorff/es6-draft.html#sec-destructuring-assignment */

var [a, [b, c], [d]] = ['hello', [', ', 'junk'], ['world']];
expect(a + b + d).to.be.eql('hello, world');

var pt = {x: 123, y: 444};
var rect = {topLeft: {x: 1, y: 2}, bottomRight: {x: 3, y: 4}};
// ... other code ...
var {x, y} = pt; // unpack the point
var {topLeft: {x: x1, y: y1}, bottomRight: {x: x2, y: y2}} = rect;

expect(x + y).to.be.eql(567);
expect([x1, y1, x2, y2].join(',')).to.be.eql('1,2,3,4');


/* Iterators and for of */

var res = [];
for (var element of [1, 2, 3]) {
  res.push(element * element);
}
expect(res).to.be.eql([1, 4, 9]);

function iterateElements(array) {
  return {
    [Symbol.iterator]: function() {
      var index = 0;
      var current;
      return {
        next: function() {
          if (index < array.length) {
            current = array[index++];
            return {
              value: current,
              done: false
            };
          }
          return {
            value: undefined,
            done: true
          }
        }
      };
    }
  };
}
// Usage:
var g = iterateElements([1,2,3]);

var res = [];
for (var a of g) {
  res.push(a);
}
expect(res).to.be.eql([1, 2, 3]);

//
// /* Generator Comprehensions http://people.mozilla.org/~jorendorff/es6-draft.html#sec-generator-comprehensions */
// var list = [1, 2, 3, 4];
// var res = (for (x of list) x);
//
// var acc = '';
// for (var x of res) {
//   acc += x;
// }
// expect(acc).to.be.eql('1234');

/* Generators http://people.mozilla.org/~jorendorff/es6-draft.html#sec-generator-function-definitions */
// A binary tree class.
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}
// A recursive generator that iterates the Tree labels in-order.
function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}

// Make a tree
function make(array) {
  // Leaf node:
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

// Iterate over it
var result = [];
for (let node of inorder(tree)) {
  result.push(node); // a, b, c, d, ...
}
expect(result).to.be.eql(['a', 'b', 'c', 'd', 'e', 'f', 'g']);


// /* Modules */
// import {firstName, lastName, year} from './Profile';
//
// function setHeader(element) {
//   element.textContent = firstName + ' ' + lastName;
// }
//
// expect(firstName).to.be.eql('David')


/* Numeric Literals http://people.mozilla.org/~jorendorff/es6-draft.html#sec-additional-syntax-numeric-literals */
var binary = [
  0b0,
  0b1,
  0b11
];
expect(binary).to.be.eql([0, 1, 3]);

var octal = [
  0o0,
  0o1,
  0o10,
  0o77
];
expect(octal).to.be.eql([0, 1, 8, 63]);

/* Object Initializer Shorthand http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object-initialiser */
var object = {
  value: 42,
  toString() {
    return this.value;
  }
};
expect(object.toString()).to.be.eql(42);

function getPoint() {
  var x = 1;
  var y = 10;

  return {x, y};
}
expect(getPoint()).to.be.eql({
  x: 1,
  y: 10
});

/* Rest params http://people.mozilla.org/~jorendorff/es6-draft.html#sec-function-definitions */
function push(array, ...items) {
  items.forEach(function(item) {
    array.push(item);
  });
}
var res = [];
push(res, 1, 2, 3);
expect(res).to.be.eql([1, 2, 3]);

/* Spread http://people.mozilla.org/~jorendorff/es6-draft.html#sec-array-literal */
function push(array, ...items) {
  array.push(...items);
}

function add(x, y) {
  return x + y;
}

var numbers = [4, 38];
expect(add(...numbers)).to.be.eql(42);

var a = [1];
var b = [2, 3, 4];
var c = [6, 7];
var d = [0, ...a, ...b, 5, ...c];
expect(d).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7]);

/* Template Literals http://people.mozilla.org/~jorendorff/es6-draft.html#sec-template-literals */

var name = 'world';
var greeting = `hello ${name}`;
expect(greeting).to.be.eql('hello world');

/* Promises */
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
timeout(100).then(() => {
  console.log('done');
});

/* Symbols */
// --symbols
var s = Symbol();
var object = {};
object[s] = 42;
expect(object[s]).to.be.eql(42);

// /* Async */
// function timeout(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }
//
// async function asyncValue(value) {
//   await timeout(50);
//   return value;
// }
//
// (async function() {
//   var value = await asyncValue(42).catch(console.error.bind(console));
//   expect(value).to.be.equal(42);
//   done();
// })();
