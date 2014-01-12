_.until = function(target, condition, events, selector, fn, data) {
	// adjust for absence of selector
	if (typeof selector !== "string") {
		if (fn !== undefined) {
			data = data ? data.unshift(fn) && data : [fn];
		}
		fn = selector;
	}
	for (var i=0,m=events.length; i<m; i++) {
		var handler = _.handler(target, events[i], selector, fn, data),
			stop = _.untilFn(handler, condition);
		handler.after = function() {
			if (stop()) {
				if (_.off) {
					_.off(target, handler.text, fn);
				} else {
					handler.fn = _.noop;
				}
			}
		};
	}
};
_.untilFn = function(handler, condition) {
	switch (typeof condition) {
		case "undefined":
		case "function": return condition;
		case "number":   return function(){ return !--condition; };
		default: condition += '';
		case "string":
			var not = condition.charAt(0) === '!';
			if (not){ condition = condition.substring(1); }
			return function() {
				var value = _.resolve(condition, handler.target);
				if (value === undefined) {
					value = _.resolve(condition);
				}
				return not ? !value : value;
			}
	}
};
Eventi.until = _.wrap(_.until, 5, 2);