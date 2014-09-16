var objutils = require('../objutils');

exports.oneBigTestLookThisIsAQuickSmallObviousModuleAnyway = function(t) {
	var input = {
		a: 1,
		b: 2
	};

	var mapResult = objutils.objMap(input, function(item, key, obj) {
		return item * 2;
	});

	t.equal(input.a, 1);
	t.equal(input.b, 2);

	t.equal(mapResult.a, 2);
	t.equal(mapResult.b, 4);

	var reduceResult = objutils.objReduce(input, function(buffer, item, key, obj) {
		return buffer + item;
	}, 1);

	t.equal(reduceResult, 4);

	objutils.objForEach(input, function(item, key, obj) {
		// ...
	}, 1);

	t.done();
};

var obj = {
	a: {
		1: {
			A: "I"
		},
		2: {
			B: "II"
		}
	},
	b: {
		4: {
			C: "III"
		},
		3: {
			D: "IV"
		}
	}
};

exports.testDfs = function(t) {
	objutils.dfs(obj, function(value, key, path, isLeaf) {
		console.log(path.join('.') + ' = ' + value + (isLeaf ? '!' : '' ));

	});

	t.done();
};


exports.testObjValues = function(t) {
	var obj = {
		a: 1,
		b: 2,
		c: 3
	};

	var a = objutils.objValues(obj);

	console.log(a);
	t.ok(a.indexOf(1) !== -1);
	t.ok(a.indexOf(2) !== -1);
	t.ok(a.indexOf(3) !== -1);
	t.ok(a.length == 3);
	t.done();
};


