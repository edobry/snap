var util = {};

util.pipe = function(arg) {
    return arg;
};

util.noop = function() {};

util.select = function(obj, path) {
    var props = path.split('.');
    var selectInternal = function(obj, props) {
        if (props.length == 1)
            return obj[props[0]];

        return selectInternal(obj[props[0]], props.slice(1));
    };

    return selectInternal(obj, props);
};

util.call = function(f, x) {
    return f.call(this, x);
};

util.partialRight = function(f) {
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);

    return function() {
        return f.apply(this, slice.call(arguments).concat(args));
    };
};

util.partialLeft = function(f) {
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);

    return function() {
        return f.apply(this, args.concat(slice.call(arguments)));
    };
};

// Courtesy of Ben Alman (http://benalman.com/news/2012/09/partial-application-in-javascript/#partial-application-from-anywhere)
util.partialAny = (function() {
    var slice = Array.prototype.slice;

    function partialAny(fn) {
        var orig = slice.call(arguments, 1);

        return function() {
            var partial = slice.call(arguments, 0);
            var args = [];

            // Iterate over the originally-specified arguments. If the argument
            // was the `partialAny._` placeholder, use the next just-passed-in
            // argument, otherwise use the originally-specified argument.
            for (var i in orig)
                args[i] = orig[i] === partialAny._ ? partial.shift() : orig[i];

            return fn.apply(this, args.concat(partial));
        };
    }

    partialAny._ = {};

    return partialAny;
}());

// Courtesy of Ben Alman (http://benalman.com/news/2010/09/partial-application-in-javascript)
util.curry = function(orig_func) {
    var ap = Array.prototype,
        args = arguments;

    function fn() {
        ap.push.apply(fn.args, arguments);
        return fn.args.length < orig_func.length ? fn : orig_func.apply(this, fn.args);
    }

    return function() {
        fn.args = ap.slice.call(args, 1);
        return fn.apply(this, arguments);
    };
};

util.compose = function(a, b) {
    return function() {
        return a.call(this, b.apply(this, arguments));
    };
};

util.stripArgsRight = function(num, f) {
    return function() {
        return f.apply(this, Array.prototype.slice.call(arguments, 0, arguments.length - num));
    };
};

util.stripArgsLeft = function(num, f) {
    return function() {
        return f.apply(this, Array.prototype.slice.call(arguments, num));
    };
};

/*  Indexes a list using the supplied key
	Takes: list to be indexed, key to index on
	Returns: map of key -> obj
	Sample usage: listToMap([{x:1,y:2},{x:3,y:4},{x:5,y:6},{x:7,y:8}], "y")
					 -> { "2": { x: 1, y: 2 },
						  "4": { x: 3, y: 4 },
						  "6": { x: 5, y: 6 },
						  "8": { x: 7, y: 8 } }
*/
util.indexList = function(list, key) {
    var map = {};
    list.forEach(function(e) {
        map[util.select(e, key)] = e;
    });
    return map;
};

/*	Converts a list to a map where the keys and values are the result of applying 
	the supplied functions to each element
	Returns: map of keyF(element) -> valF(element)
	Sample usage: toMap([1,2,3], pipe, addOne)
					-> { "1": 2, "2": 3, "3": 4 }

*/
util.toMap = function(list, keyF, valF) {
    var map = {};
    list.forEach(function(e) {
        map[keyF(e)] = valF(e);
    });
    return map;
};

util.whereEq = function(list, field, val) {
    return list.filter(function(x) {
        return util.select(x, field) == val;
    });
};

util.replaceWhere = function(list, field, val, obj) {
    return list.map(function(x) {
        return x[field] == val ? obj : x;
    });
};

util.mapVal = function(list, val) {
    return list.map(function() {
        return val;
    });
};

util.flatten = function(list) {
    return Array.prototype.concat.apply([], list);
};

util.toList = function(obj) {
    var out = [];
    for(var i in obj) out.push(obj[i]);
    return out;
};

util.tail = function(list) { return list[list.length-1]; };
util.head = function(list) { return list[0]; };

//equals is an equality operator
util.contains = function(list, equals, val) {
    var contained = false;
    for(var i in list) {
        var el = list[i];
        if(equals(el, val)) {
            contained = true;
            break;
        }
    }
    return contained;
};

//returns true if a is a subset of b; op is the equality operator (different for primitives vs objects)
//precondition: a and b are sets (no duplicates)
util.subset = function(a, b, op) {
    var isSubset = true;
    for(var i in a)
        if(!(util.contains(b, op, a[i]))) {
            isSubset = false;
            break;
        }
    return isSubset;
};

util.once = function(func) {
    var beenCalled = false;
    return function() {
        var args = Array.prototype.slice.call(arguments);
        (beenCalled ? util.noop : func).apply(null, args);
        beenCalled = true;
    };
};

module.exports = util;