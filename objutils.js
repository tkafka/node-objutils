export function bind(fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
}

/**
 * @callback objutilsObjMapCallback
 * @param item
 * @param {string|number} key
 * @param {object} obj
 */

/**
 * Note: Returns a shallow copy of object.
 *
 * @param {object} obj
 * @param {objutilsObjMapCallback|function} fn (item, key, obj) -> (newValue)
 * @param [thisArg] optional
 * */
export function objMap(obj, fn, thisArg) {
  var newObj = {},
    key;

  if (thisArg) {
    fn = bind(fn, thisArg);
  }

  if (obj && fn) {
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = fn(obj[key], key, obj);
      }
    }
  }
  return newObj;
}

/**
 * @callback objutilsObjReduceCallback
 * @param accumulated
 * @param item
 * @param {string|number} key
 * @param {object} obj
 */

/**
 * @param {object} obj
 * @param {objutilsObjReduceCallback|function}  fn (accumulated, item, key, obj) -> (newAccumulatedValue)
 * @param initialValue
 * @param [thisArg] optional
 * */
export function objReduce(obj, fn, initialValue, thisArg) {
  var value = initialValue,
    key;

  if (thisArg) {
    fn = bind(fn, thisArg);
  }

  if (obj && fn) {
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        value = fn(value, obj[key], key, obj);
      }
    }
  }
  return value;
}

/**
 * @param {object} obj
 * @return {Array}
 * */
export function objValues(obj) {
  var a = [],
    key;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      a.push(obj[key]);
    }
  }

  return a;
}

/**
 * @param {object} obj
 * @param {objutilsObjMapCallback|function} fn (item, key, obj)
 * @param [thisArg] optional
 * */
export function objForEach(obj, fn, thisArg) {
  var key;

  if (thisArg) {
    fn = bind(fn, thisArg);
  }

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(obj[key], key, obj);
    }
  }
}

/**
 * Hack for using object as sparse array
 * @param {object} obj
 * @param {objutilsObjMapCallback|function} fn (item, key, obj)
 * @param [sortFn] sort
 * @param [thisArg] optional
 */
export function objForEachSorted(obj, fn, sortFn, thisArg) {
  var keys = [],
    key,
    i;

  if (thisArg) {
    fn = bind(fn, thisArg);
  }

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }

  keys.sort(sortFn);

  for (i = 0; i < keys.length; i += 1) {
    fn(obj[key], key, obj);
  }
}

/**
 * @param {object} obj
 * @param {objutilsObjMapCallback|function} fn (item, key, obj)
 * @param [thisArg] optional
 * */
export function objFilter(obj, fn, thisArg) {
  var filteredObj = {},
    key;

  if (thisArg) {
    fn = bind(fn, thisArg);
  }

  for (key in obj) {
    if (obj.hasOwnProperty(key) && fn(obj[key], key, obj)) {
      filteredObj[key] = obj[key];
    }
  }

  return filteredObj;
}

export function objLength(obj) {
  var l = 0,
    key;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      l += 1;
    }
  }
  return l;
}

let objToArray = objValues
export function objToArray

// DFS

var _dfs = function (obj, functor, path) {
  var k;

  // when we encounter the string, this if branch makes sure we don't iterate it by letters :)
  if (typeof obj === "object") {
    for (k in obj) {
      if (obj.hasOwnProperty(k)) {
        path.push(k);
        _dfs(obj[k], functor, path, obj, false);
        functor(obj[k], k, path, typeof obj[k] !== "object");
        path.pop();
      }
    }
  }
};

/**
 *
 * @param obj
 * @param functor function(value, key, path (= array of key names), isLeaf)
 */
export function dfs(obj, functor) {
  _dfs(obj, functor, [], null, true);
}

var _dfsMod = function (obj, functor, path) {
  var k;

  // when we encounter the string, this if branch makes sure we don't iterate it by letters :)
  if (typeof obj === "object") {
    // first functor, to allow renaming keys
    for (k in obj) {
      if (obj.hasOwnProperty(k)) {
        path.push(k);
        functor(obj[k], k, obj, path, typeof obj[k] !== "object");
        path.pop();
      }
    }

    for (k in obj) {
      if (obj.hasOwnProperty(k)) {
        path.push(k);
        _dfsMod(obj[k], functor, path, obj, false);
        path.pop();
      }
    }
  }
};

/**
 *
 * @param obj
 * @param functor function(value, key, path (= array of key names), isLeaf)
 */
export function dfsMod(obj, functor) {
  _dfsMod(obj, functor, [], null, true);
}

export default {
  bind: bind,
  objMap: objMap,
  objReduce: objReduce,
  objValues: objValues,
  objForEach: objForEach,
  objForEachSorted: objForEachSorted,
  objFilter: objFilter,
  objLength: objLength,
  objToArray: objToArray,
  dfs: dfs,
  dfsMod: dfsMod
}