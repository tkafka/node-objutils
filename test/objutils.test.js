import { describe, expect, it } from 'vitest';
import { objMap, objReduce, objForEach, dfs, objFilter } from '../objutils.js';

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

		objForEach(
			input,
			(item, key, obj) => {
				// ...
			},
			1
		);
	});

	it('dfs example', async () => {
		dfs(obj, (value, key, path, isLeaf) => {
			// console.log(path.join('.') + ' = ' + value + (isLeaf ? '!' : '' ));
		});
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
});
