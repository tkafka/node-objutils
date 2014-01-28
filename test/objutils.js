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
