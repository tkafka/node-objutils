import { describe, expect, it } from 'vitest';
import { objMap, objReduce, objForEach, dfs, objFilter, bind, objForEachSorted, objLength, dfsMod } from '../objutils.js';

const obj = {
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

describe('objutils', () => {
	it('should test ok', async () => {
		const input = {
			a: 1,
			b: 2,
		};

		const mapResult = objMap(input, (item, key, obj) => item * 2);

		expect(input.a).toBe(1);
		expect(input.b).toBe(2);

		expect(mapResult.a).toBe(2);
		expect(mapResult.b).toBe(4);

		const reduceResult = objReduce(input, (buffer, item, key, obj) => buffer + item, 1);

		expect(reduceResult).toBe(4);

		let forEachSum = 0;
		objForEach(
			input,
			(item, key, obj) => {
				forEachSum += item;
			},
			1
		);
		expect(forEachSum).toBe(3);
	});

	it('dfs example', async () => {
		const paths = [];
		dfs(obj, (value, key, path, isLeaf) => {
			if (isLeaf) {
				paths.push(path.join('.'));
			}
		});
		expect(paths).toContain('a.1.A');
		expect(paths).toContain('a.2.B');
		expect(paths).toContain('b.4.C');
		expect(paths).toContain('b.3.D');
	});

	it('tests filter', async () => {
		const obj = {
			a: 1,
			b: 2,
			c: 3,
			d: 4,
		};

		const f = objFilter(obj, (value, key) => value % 2 === 0);

		expect(f.a).toBeUndefined();
		expect(f.b).toBe(2);
		expect(f.c).toBeUndefined();
		expect(f.d).toBe(4);
		expect(Object.keys(f)).toHaveLength(2);
	});

	it('tests bind', () => {
		const context = { multiplier: 2 };
		function multiply(value) {
			return value * this.multiplier;
		}
		
		const boundMultiply = bind(multiply, context);
		expect(boundMultiply(5)).toBe(10);
	});

	it('tests objForEachSorted with default sort', () => {
		const obj = {
			c: 3,
			a: 1,
			b: 2,
		};
		
		const result = [];
		objForEachSorted(obj, (value, key) => {
			result.push(key);
		});
		
		expect(result).toEqual(['a', 'b', 'c']);
	});

	it('tests objForEachSorted with custom sort', () => {
		const obj = {
			c: 3,
			a: 1,
			b: 2,
		};
		
		const result = [];
		objForEachSorted(obj, (value, key) => {
			result.push(key);
		}, (a, b) => b.localeCompare(a)); // Reverse order
		
		expect(result).toEqual(['c', 'b', 'a']);
	});

	it('tests objLength', () => {
		const obj = {
			a: 1,
			b: 2,
			c: 3,
		};
		
		expect(objLength(obj)).toBe(3);
		expect(objLength({})).toBe(0);
		
		const objWithProto = Object.create({ inheritedProp: true });
		objWithProto.ownProp = true;
		expect(objLength(objWithProto)).toBe(1);
	});

	it('tests dfsMod', () => {
		const testObj = {
			a: {
				value: 1
			},
			b: {
				value: 2
			}
		};
		
		dfsMod(testObj, (value, key, parentObj, path, isLeaf) => {
			if (key === 'value') {
				parentObj[key] = parentObj[key] * 2;
			}
		});
		
		expect(testObj.a.value).toBe(2);
		expect(testObj.b.value).toBe(4);
	});

	it('tests objMap with thisArg', () => {
		const input = {
			a: 1,
			b: 2,
		};
		const context = { multiplier: 3 };
		
		const mapResult = objMap(input, function(value) {
			return value * this.multiplier;
		}, context);
		
		expect(mapResult.a).toBe(3);
		expect(mapResult.b).toBe(6);
	});

	it('tests objReduce with thisArg', () => {
		const input = {
			a: 1,
			b: 2,
		};
		const context = { multiplier: 2 };
		
		const result = objReduce(input, function(acc, value) {
			return acc + (value * this.multiplier);
		}, 0, context);
		
		expect(result).toBe(6); // (1*2) + (2*2) = 6
	});

	it('tests objForEach with thisArg', () => {
		const input = {
			a: 1,
			b: 2,
		};
		const context = { sum: 0 };
		
		objForEach(input, function(value) {
			this.sum += value;
		}, context);
		
		expect(context.sum).toBe(3);
	});

	it('tests objForEachSorted with thisArg', () => {
		const input = {
			c: 3,
			a: 1,
			b: 2,
		};
		const context = { result: [] };
		
		objForEachSorted(input, function(value, key) {
			this.result.push(key);
		}, undefined, context);
		
		expect(context.result).toEqual(['a', 'b', 'c']);
	});

	it('tests objFilter with thisArg', () => {
		const input = {
			a: 1,
			b: 2,
			c: 3,
			d: 4,
		};
		const context = { divisor: 2 };
		
		const result = objFilter(input, function(value) {
			return value % this.divisor === 0;
		}, context);
		
		expect(Object.keys(result)).toEqual(['b', 'd']);
		expect(result.b).toBe(2);
		expect(result.d).toBe(4);
	});
});
