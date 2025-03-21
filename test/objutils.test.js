import objutils from "../objutils.js";
import { describe, it, expect } from "vitest";

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

describe("objutils", () => {
  it("should test ok", async () => {
    var input = {
      a: 1,
      b: 2,
    };

    var mapResult = objutils.objMap(input, function (item, key, obj) {
      return item * 2;
    });

    expect(input.a).toBe(1);
    expect(input.b).toBe(2);

    expect(mapResult.a).toBe(2);
    expect(mapResult.b).toBe(4);

    var reduceResult = objutils.objReduce(
      input,
      function (buffer, item, key, obj) {
        return buffer + item;
      },
      1,
    );

    expect(reduceResult).toBe(4);

    objutils.objForEach(
      input,
      function (item, key, obj) {
        // ...
      },
      1,
    );
  });

  it("dfs example", async () => {
    objutils.dfs(obj, function (value, key, path, isLeaf) {
      // console.log(path.join('.') + ' = ' + value + (isLeaf ? '!' : '' ));
    });
  });

  it("tests filter", async () => {
    var obj = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    var f = objutils.objFilter(obj, function (value, key) {
      return value % 2 == 0;
    });

    expect(f.a).toBeUndefined();
    expect(f.b).toBe(2);
    expect(f.c).toBeUndefined();
    expect(f.d).toBe(4);
    expect(Object.keys(f)).toHaveLength(2);
  });
});
