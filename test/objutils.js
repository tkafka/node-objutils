import objutils from "../objutils.js";
import { strict as assert } from "assert";

const obj = {
  a: {
    1: {
      A: "I",
    },
    2: {
      B: "II",
    },
  },
  b: {
    4: {
      C: "III",
    },
    3: {
      D: "IV",
    },
  },
};

describe("objutils", function () {
  it("should test ok", async function () {
    var input = {
      a: 1,
      b: 2,
    };

    var mapResult = objutils.objMap(input, function (item, key, obj) {
      return item * 2;
    });

    assert.equal(input.a, 1);
    assert.equal(input.b, 2);

    assert.equal(mapResult.a, 2);
    assert.equal(mapResult.b, 4);

    var reduceResult = objutils.objReduce(
      input,
      function (buffer, item, key, obj) {
        return buffer + item;
      },
      1,
    );

    assert.equal(reduceResult, 4);

    objutils.objForEach(
      input,
      function (item, key, obj) {
        // ...
      },
      1,
    );
  });

  it("dfs example", async function () {
    objutils.dfs(obj, function (value, key, path, isLeaf) {
      // console.log(path.join('.') + ' = ' + value + (isLeaf ? '!' : '' ));
    });
  });

  it("tests objvalues", async function () {
    var obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    var a = objutils.objValues(obj);

    // console.log(a);
    assert.ok(a.indexOf(1) !== -1);
    assert.ok(a.indexOf(2) !== -1);
    assert.ok(a.indexOf(3) !== -1);
    assert.ok(a.length == 3);
  });

  it("tests filter", async function () {
    var obj = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    var f = objutils.objFilter(obj, function (value, key) {
      return value % 2 == 0;
    });

    assert.ok(typeof f.a == "undefined");
    assert.ok(f.b == 2);
    assert.ok(typeof f.c == "undefined");
    assert.ok(f.d == 4);
    assert.ok(Object.keys(f).length == 2);
  });

  it("tests objToArray", async function () {
    var obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    var a = objutils.objToArray(obj);

    // console.log(a);
    assert.ok(a.length === 3);
    assert.ok(a[0] === 1);
    assert.ok(a[1] === 2);
    assert.ok(a[2] === 3);
  });
});
