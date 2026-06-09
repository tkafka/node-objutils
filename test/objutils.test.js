import { describe, expect, it } from 'vitest';
import objutils, {
	bind,
	dfs,
	dfsMod,
	objFilter,
	objForEach,
	objForEachSorted,
	objLength,
	objMap,
	objReduce,
} from '../objutils.js';

// Shared deeply-nested fixture used by the traversal tests.
const tree = {
	a: {
		1: {
			A: 'I',
		},
		2: {
			B: 'II',
		},
	},
	b: {
		4: {
			C: 'III',
		},
		3: {
			D: 'IV',
		},
	},
};

describe('bind', () => {
	it('binds the given scope as `this`', () => {
		const context = { multiplier: 2 };
		function multiply(value) {
			return value * this.multiplier;
		}

		const boundMultiply = bind(multiply, context);
		expect(boundMultiply(5)).toBe(10);
	});

	it('forwards all arguments to the bound function', () => {
		function sum(a, b, c) {
			return this.base + a + b + c;
		}

		const bound = bind(sum, { base: 100 });
		expect(bound(1, 2, 3)).toBe(106);
	});

	it('returns a new function without invoking the original', () => {
		let called = false;
		const fn = () => {
			called = true;
		};

		const bound = bind(fn, {});
		expect(typeof bound).toBe('function');
		expect(called).toBe(false);

		bound();
		expect(called).toBe(true);
	});
});

describe('objMap', () => {
	it('maps values into a new object', () => {
		const input = { a: 1, b: 2 };
		const result = objMap(input, (value) => value * 2);
		expect(result).toEqual({ a: 2, b: 4 });
	});

	it('does not mutate the source object', () => {
		const input = { a: 1, b: 2 };
		objMap(input, (value) => value * 2);
		expect(input).toEqual({ a: 1, b: 2 });
	});

	it('invokes the callback with (value, key, sourceObject)', () => {
		const input = { a: 1, b: 2 };
		const calls = [];
		objMap(input, (value, key, source) => {
			calls.push({ value, key, sameSource: source === input });
			return value;
		});
		expect(calls).toEqual([
			{ value: 1, key: 'a', sameSource: true },
			{ value: 2, key: 'b', sameSource: true },
		]);
	});

	it('ignores inherited (prototype) properties', () => {
		const obj = Object.create({ inherited: 'nope' });
		obj.own = 5;
		const result = objMap(obj, (value) => value);
		expect(Object.keys(result)).toEqual(['own']);
		expect(result.inherited).toBeUndefined();
	});

	it('supports a thisArg', () => {
		const result = objMap(
			{ a: 1, b: 2 },
			function (value) {
				return value * this.multiplier;
			},
			{ multiplier: 3 }
		);
		expect(result).toEqual({ a: 3, b: 6 });
	});

	it('returns an empty object for empty / nullish input', () => {
		expect(objMap({}, (value) => value)).toEqual({});
		expect(objMap(null, (value) => value)).toEqual({});
		expect(objMap(undefined, (value) => value)).toEqual({});
	});

	it('returns an empty object when the callback is missing', () => {
		expect(objMap({ a: 1 }, undefined)).toEqual({});
	});
});

describe('objReduce', () => {
	it('reduces values to a scalar', () => {
		const result = objReduce({ a: 1, b: 2, c: 3 }, (acc, value) => acc + value, 0);
		expect(result).toBe(6);
	});

	it('invokes the callback with (acc, value, key, sourceObject)', () => {
		const input = { a: 1, b: 2 };
		const calls = [];
		objReduce(
			input,
			(acc, value, key, source) => {
				calls.push({ value, key, sameSource: source === input });
				return acc + value;
			},
			0
		);
		expect(calls).toEqual([
			{ value: 1, key: 'a', sameSource: true },
			{ value: 2, key: 'b', sameSource: true },
		]);
	});

	it('can build an object accumulator', () => {
		const doubled = objReduce(
			{ a: 1, b: 2, c: 3 },
			(acc, value, key) => {
				acc[key] = value * 2;
				return acc;
			},
			{}
		);
		expect(doubled).toEqual({ a: 2, b: 4, c: 6 });
	});

	it('ignores inherited (prototype) properties', () => {
		const obj = Object.create({ inherited: 100 });
		obj.a = 1;
		obj.b = 2;
		expect(objReduce(obj, (acc, value) => acc + value, 0)).toBe(3);
	});

	it('supports a thisArg', () => {
		const result = objReduce(
			{ a: 1, b: 2 },
			function (acc, value) {
				return acc + value * this.multiplier;
			},
			0,
			{ multiplier: 2 }
		);
		expect(result).toBe(6); // (1*2) + (2*2)
	});

	it('returns the initial value for empty / nullish input', () => {
		expect(objReduce({}, (acc, value) => acc + value, 10)).toBe(10);
		expect(objReduce(null, (acc, value) => acc + value, 10)).toBe(10);
	});

	it('returns the initial value when the callback is missing', () => {
		expect(objReduce({ a: 1 }, undefined, 5)).toBe(5);
	});
});

describe('objForEach', () => {
	it('invokes the callback for each own entry with (value, key, sourceObject)', () => {
		const input = { a: 1, b: 2 };
		const calls = [];
		objForEach(input, (value, key, source) => {
			calls.push({ value, key, sameSource: source === input });
		});
		expect(calls).toEqual([
			{ value: 1, key: 'a', sameSource: true },
			{ value: 2, key: 'b', sameSource: true },
		]);
	});

	it('ignores inherited (prototype) properties', () => {
		const obj = Object.create({ inherited: 1 });
		obj.a = 1;
		obj.b = 2;
		const keys = [];
		objForEach(obj, (_value, key) => keys.push(key));
		expect(keys).toEqual(['a', 'b']);
	});

	it('supports a thisArg', () => {
		const context = { sum: 0 };
		objForEach(
			{ a: 1, b: 2 },
			function (value) {
				this.sum += value;
			},
			context
		);
		expect(context.sum).toBe(3);
	});

	it('is a no-op for empty / nullish input', () => {
		let count = 0;
		objForEach({}, () => count++);
		objForEach(null, () => count++);
		objForEach(undefined, () => count++);
		expect(count).toBe(0);
	});

	it('does not throw when the callback is missing', () => {
		expect(() => objForEach({ a: 1 }, undefined)).not.toThrow();
	});
});

describe('objForEachSorted', () => {
	it('iterates keys in default (lexicographic) order', () => {
		const keys = [];
		objForEachSorted({ c: 3, a: 1, b: 2 }, (_value, key) => keys.push(key));
		expect(keys).toEqual(['a', 'b', 'c']);
	});

	it('sorts numeric-string keys lexicographically by default (not numerically)', () => {
		const keys = [];
		objForEachSorted({ 2: 'two', 10: 'ten', 1: 'one' }, (_value, key) => keys.push(key));
		expect(keys).toEqual(['1', '10', '2']);
	});

	it('accepts a custom sort function', () => {
		const keys = [];
		objForEachSorted(
			{ c: 3, a: 1, b: 2 },
			(_value, key) => keys.push(key),
			(a, b) => b.localeCompare(a)
		);
		expect(keys).toEqual(['c', 'b', 'a']);
	});

	it('invokes the callback with (value, key, sourceObject)', () => {
		const input = { b: 2, a: 1 };
		const calls = [];
		objForEachSorted(input, (value, key, source) => {
			calls.push({ value, key, sameSource: source === input });
		});
		expect(calls).toEqual([
			{ value: 1, key: 'a', sameSource: true },
			{ value: 2, key: 'b', sameSource: true },
		]);
	});

	it('supports a thisArg with the default sort', () => {
		const context = { keys: [] };
		objForEachSorted(
			{ c: 3, a: 1, b: 2 },
			function (_value, key) {
				this.keys.push(key);
			},
			undefined,
			context
		);
		expect(context.keys).toEqual(['a', 'b', 'c']);
	});

	it('supports a thisArg together with a custom sort', () => {
		const context = { keys: [] };
		objForEachSorted(
			{ c: 3, a: 1, b: 2 },
			function (_value, key) {
				this.keys.push(key);
			},
			(a, b) => b.localeCompare(a),
			context
		);
		expect(context.keys).toEqual(['c', 'b', 'a']);
	});

	it('is a no-op for empty / nullish input and missing callbacks', () => {
		expect(() => objForEachSorted({}, () => {})).not.toThrow();
		expect(() => objForEachSorted(null, () => {})).not.toThrow();
		expect(() => objForEachSorted({ a: 1 }, undefined)).not.toThrow();
	});
});

describe('objFilter', () => {
	it('keeps only entries for which the callback is truthy', () => {
		const result = objFilter({ a: 1, b: 2, c: 3, d: 4 }, (value) => value % 2 === 0);
		expect(result).toEqual({ b: 2, d: 4 });
	});

	it('does not mutate the source object', () => {
		const input = { a: 1, b: 2 };
		objFilter(input, (value) => value > 1);
		expect(input).toEqual({ a: 1, b: 2 });
	});

	it('can filter by key', () => {
		const result = objFilter({ keepMe: 1, dropMe: 2 }, (_value, key) => key.startsWith('keep'));
		expect(result).toEqual({ keepMe: 1 });
	});

	it('ignores inherited (prototype) properties', () => {
		const obj = Object.create({ inherited: 2 });
		obj.a = 2;
		obj.b = 3;
		const result = objFilter(obj, (value) => value % 2 === 0);
		expect(Object.keys(result)).toEqual(['a']);
	});

	it('supports a thisArg', () => {
		const result = objFilter(
			{ a: 1, b: 2, c: 3, d: 4 },
			function (value) {
				return value % this.divisor === 0;
			},
			{ divisor: 2 }
		);
		expect(result).toEqual({ b: 2, d: 4 });
	});

	it('returns an empty object for empty / nullish input and missing callbacks', () => {
		expect(objFilter({}, () => true)).toEqual({});
		expect(objFilter(null, () => true)).toEqual({});
		expect(objFilter({ a: 1 }, undefined)).toEqual({});
	});
});

describe('objLength', () => {
	it('counts own enumerable keys', () => {
		expect(objLength({ a: 1, b: 2, c: 3 })).toBe(3);
		expect(objLength({})).toBe(0);
	});

	it('returns 0 for nullish input', () => {
		expect(objLength(null)).toBe(0);
		expect(objLength(undefined)).toBe(0);
	});

	it('ignores inherited (prototype) properties', () => {
		const obj = Object.create({ inheritedProp: true });
		obj.ownProp = true;
		expect(objLength(obj)).toBe(1);
	});
});

describe('dfs', () => {
	it('reports leaf paths for a deeply nested object', () => {
		const paths = [];
		dfs(tree, (_value, _key, path, isLeaf) => {
			if (isLeaf) {
				paths.push(path.join('.'));
			}
		});
		expect(paths).toContain('a.1.A');
		expect(paths).toContain('a.2.B');
		expect(paths).toContain('b.4.C');
		expect(paths).toContain('b.3.D');
	});

	it('visits every node — both leaves and branches', () => {
		const subject = { a: 1, b: { c: 2 } };
		const leaves = [];
		const branches = [];
		dfs(subject, (_value, _key, path, isLeaf) => {
			(isLeaf ? leaves : branches).push(path.join('.'));
		});
		expect(leaves.sort()).toEqual(['a', 'b.c']);
		expect(branches).toEqual(['b']);
	});

	it('traverses post-order (children before their parent)', () => {
		const subject = { a: 1, b: { c: 2 } };
		const order = [];
		dfs(subject, (_value, key) => order.push(key));
		expect(order).toEqual(['a', 'c', 'b']);
	});

	it('marks primitive values as leaves', () => {
		const subject = { a: 1, b: 'string', c: true, d: { nested: 'value' } };
		const leaves = [];
		dfs(subject, (value, _key, path, isLeaf) => {
			if (isLeaf) {
				leaves.push({ value, path: path.join('.') });
			}
		});
		expect(leaves).toHaveLength(4);
		expect(leaves.find((l) => l.path === 'a')?.value).toBe(1);
		expect(leaves.find((l) => l.path === 'b')?.value).toBe('string');
		expect(leaves.find((l) => l.path === 'c')?.value).toBe(true);
		expect(leaves.find((l) => l.path === 'd.nested')?.value).toBe('value');
	});

	it('treats null as a leaf (does not recurse into it)', () => {
		const visits = [];
		dfs({ x: null }, (value, _key, _path, isLeaf) => {
			visits.push({ value, isLeaf });
		});
		expect(visits).toEqual([{ value: null, isLeaf: true }]);
	});

	it('traverses arrays by index', () => {
		const visits = [];
		dfs({ list: [10, 20], scalar: 5 }, (value, _key, path, isLeaf) => {
			visits.push({ path: path.join('.'), value, isLeaf });
		});
		expect(visits.find((v) => v.path === 'list.0')).toMatchObject({ value: 10, isLeaf: true });
		expect(visits.find((v) => v.path === 'list.1')).toMatchObject({ value: 20, isLeaf: true });
		expect(visits.find((v) => v.path === 'scalar')).toMatchObject({ value: 5, isLeaf: true });

		const listNode = visits.find((v) => v.path === 'list');
		expect(listNode.isLeaf).toBe(false);
		expect(Array.isArray(listNode.value)).toBe(true);
	});

	it('is a no-op for empty objects and non-object input', () => {
		let calls = 0;
		dfs({}, () => calls++);
		dfs(null, () => calls++);
		dfs(undefined, () => calls++);
		dfs(42, () => calls++);
		expect(calls).toBe(0);
	});
});

describe('dfsMod', () => {
	it('can modify leaf values in place', () => {
		const subject = { a: { value: 1 }, b: { value: 2 } };
		dfsMod(subject, (_value, key, parent) => {
			if (key === 'value') {
				parent[key] *= 2;
			}
		});
		expect(subject).toEqual({ a: { value: 2 }, b: { value: 4 } });
	});

	it('invokes the callback with (value, key, parentObject, path, isLeaf) in pre-order', () => {
		const subject = { a: 1, b: { c: 2 } };
		const visits = [];
		dfsMod(subject, (_value, key, parent, path, isLeaf) => {
			visits.push({ key, path: path.join('.'), isLeaf, parentIsRoot: parent === subject });
		});
		expect(visits).toEqual([
			{ key: 'a', path: 'a', isLeaf: true, parentIsRoot: true },
			{ key: 'b', path: 'b', isLeaf: false, parentIsRoot: true },
			{ key: 'c', path: 'b.c', isLeaf: true, parentIsRoot: false },
		]);
	});

	it('can rename keys, and still recurses into the renamed subtree', () => {
		const subject = { oldKey: { inner: 1 } };
		const visitedPaths = [];
		dfsMod(subject, (value, key, parent, path) => {
			if (key === 'oldKey') {
				parent.newKey = value;
				delete parent.oldKey;
			}
			visitedPaths.push(path.join('.'));
		});
		expect(subject).toEqual({ newKey: { inner: 1 } });
		// the inner node is reached via the freshly-named key
		expect(visitedPaths).toContain('newKey.inner');
	});

	it('can delete keys during traversal', () => {
		const subject = { a: 1, b: 2, c: 3, d: 4 };
		dfsMod(subject, (value, key, parent) => {
			if (value % 2 === 0) {
				delete parent[key];
			}
		});
		expect(subject).toEqual({ a: 1, c: 3 });
	});

	it('supports targeted modifications based on path and isLeaf', () => {
		const subject = {
			users: {
				user1: { permissions: { read: true, write: false } },
				user2: { permissions: { read: true, write: true } },
			},
		};
		dfsMod(subject, (value, key, parent, path, isLeaf) => {
			if (isLeaf && typeof value === 'boolean' && path.includes('permissions')) {
				parent[key] = value ? 'yes' : 'no';
			}
		});
		expect(subject.users.user1.permissions).toEqual({ read: 'yes', write: 'no' });
		expect(subject.users.user2.permissions).toEqual({ read: 'yes', write: 'yes' });
	});

	it('is a no-op for empty objects and non-object input', () => {
		let calls = 0;
		dfsMod({}, () => calls++);
		dfsMod(null, () => calls++);
		dfsMod(42, () => calls++);
		expect(calls).toBe(0);
	});
});

describe('default export', () => {
	it('exposes all named helpers', () => {
		expect(Object.keys(objutils).sort()).toEqual(
			[
				'bind',
				'dfs',
				'dfsMod',
				'objFilter',
				'objForEach',
				'objForEachSorted',
				'objLength',
				'objMap',
				'objReduce',
			].sort()
		);
	});

	it('behaves identically to the named exports', () => {
		expect(objutils.objMap({ a: 1 }, (value) => value * 2)).toEqual({ a: 2 });
		expect(objutils.objLength({ a: 1, b: 2 })).toBe(2);
		expect(objutils.objFilter({ a: 1, b: 2 }, (value) => value > 1)).toEqual({ b: 2 });
	});
});
