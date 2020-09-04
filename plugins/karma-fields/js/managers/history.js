

// KarmaFields.History.getObjectValue = function(object, keys) {
// 	if (keys.length) {
// 		var key = keys.shift();
// 		if (key) {
// 			if (typeof object[key] === "object") {
// 				return this.getObjectValue(object[key], keys);
// 			}
// 			return object[key];
// 		}
// 	}
// 	return object;
// };
// KarmaFields.History.setObjectValue = function(object, keys, value) {
// 	if (keys[1]) {
// 		var key = keys.shift();
// 		if (!object[key]) {
// 			object[key] = {};
// 		}
// 		this.setObjectValue(object[key], keys, value);
// 	} else if (keys[0]) {
// 		object[keys[0]] = value;
// 	}
// }
// KarmaFields.History.merge = function(object1, object2) {
// 	for (var i in object2) {
// 		if (object2[i] && typeof object2[i] === "object") {
// 			this.merge(object1[i] || {}, object2[i]);
// 		} else {
// 			object1[i] = object2[i];
// 		}
// 	}
// 	return object1;
// }
// KarmaFields.History.clone = function(object) {
// 	return this.merge({}, object);
// 	// if (object && typeof object === "object") { // -> typeof null = "object"
// 	// 	var clone = {};
// 	// 	for (var i in object) {
// 	// 		clone[i] = this.clone(object[i]);
// 	// 	}
// 	// 	return clone;
// 	// }
// 	// return object;
// };
// KarmaFields.History.serialise = function(object) {
// 	var params = [];
// 	for (var key in object) {
//     params.push(key + "=" + encodeURIComponent(object[key]));
// 	}
// 	return params.join("&");
// }

KarmaFields.History = {};
KarmaFields.History.createInstance = function() {
	var history = {};
	history.index = 0;
	history.state = {};
	history.buffer = {};
	history.input = {};
	history.output = {};
	history.cache = {};
	history.undos = [];
	history.redos = [];
	history.comparePaths = function(path1, path2) {
		for (var i = 0; i < path1.length; i++) {
			if (path1[i] !== path2[i]) {
				return false;
			}
		}
		return true;
	},
	// history.startEdit = function(keys, noBuffer) {
	// 	if (this.edition && !history.comparePaths(this.edition.keys, keys)) {
	// 		this.stopEdit();
	// 	}
	// 	if (!this.edition) {
	// 		this.edition = {
	// 			keys: keys,
	// 			nb: noBuffer || 0,
	// 			value: KarmaFields.Object.getValue(this.state, this.edition.keys)
	// 		};
	// 	}
	// };
	history.stopEdit = function() {
		if (this.edition && KarmaFields.Object.diff(this.edition.output, this.output)) {
			this.undos.push(this.edition);
			this.edition = null;
		}
	};
	// history.setValue = function(keys, value, buffer, noBreak) {
	// 	this.write(keys, value, buffer);
	// };
	history.write = function(keys, value, buffer, noBreak) {
		// this.startEdit(keys, noBuffer);

		var path = [buffer || "output"].concat(keys);

		if (buffer === "output" && !noBreak && this.edition && KarmaFields.Object.getValue(this.edition, keys) === undefined) {
			this.stopEdit();
		}

		if (!this.edition) {
			this.edition = {};
			var revertValue = KarmaFields.Object.getValue(this, path);
			KarmaFields.Object.setValue(this.edition, path, revertValue, true);
		}

		value = KarmaFields.Object.clone(value);
		KarmaFields.Object.setValue(this, path, value);

		if (this.onEdit) {
			this.onEdit(value, keys, buffer, noBreak);
		}
	};
	history.find = function(array, callback) {
		if (callback) {
			return array.find(callback);
		} else {
			return array.shift();
		}
	};

	history.undo = function(callback) {
		this.stopEdit();
		var reverse = this.find(this.undos, callback);
		if (reverse) {
			this.redos.unshift(KarmaFields.Object.mask(this, reverse));
			KarmaFields.Object.merge(this, reverse);

			//
			//
			// var value = KarmaFields.Object.getValue(this.state, state.keys, value);
			// if (value) {
			// 	// this.edit(state.resource, state.uri, state.path, state.value, state.nb);
			// 	this.write(state.keys, state.value, state.nb);
			// 	this.redos.unshift({
			// 		keys: state.keys,
			// 		// resource: state.resource,
			// 		// uri: state.uri,
			// 		// path: state.path,
			// 		nb: state.nb,
			// 		value: value // undefined if the value is not loaded yet
			// 	});
			// }
		}
		// if (state && this.state[state.resource] && this.state[state.resource][state.uri]) {
		// 	var value = this.state[state.resource][state.uri][state.path];
		// 	this.edit(state.resource, state.uri, state.path, state.value, state.nb);
		// 	this.redos.push({
		// 		resource: state.resource,
		// 		uri: state.uri,
		// 		path: state.path,
		// 		nb: state.nb,
		// 		value: value // undefined if the value is not loaded yet
		// 	});
		// }
	}
	history.redo = function(callback) {
		var reverse = this.find(this.redos, callback);
		if (reverse) {
			this.undos.unshift(KarmaFields.Object.mask(this, reverse));
			KarmaFields.Object.merge(this, reverse);


			// var value = KarmaFields.Object.getValue(this.state, state.keys, value);
			// if (value) {
			// 	this.write(state.keys, state.value, state.nb);
			// 	this.undos.push({
			// 		keys: state.keys,
			// 		nb: state.nb,
			// 		value: value // undefined if the value is not loaded yet
			// 	});
			// }
		}
		// if (state && this.state[state.resource] && this.state[state.resource]) {
		// 	var value = this.state[state.resource][state.uri][state.path];
		// 	this.edit(state.resource, state.uri, state.path, state.value, state.nb);
		// 	this.undos.push({
		// 		resource: state.resource,
		// 		uri: state.uri,
		// 		path: state.path,
		// 		nb: state.nb,
		// 		value: value // undefined if the value is not loaded yet
		// 	});
		// }
	};
	history.hasUndo = function(callback) {
		return this.find(this.undos, callback);
	};
	history.hasRedo = function(callback) {
		return this.find(this.redos, callback);
	};
	history.isModified = function(keys) {
		// return this.state[state.resource] && this.state[state.resource][state.uri] && this.state[state.resource][state.uri][state.path] !== undefined;

		return KarmaFields.Object.getValue(this.buffer, keys) !== undefined;

	};
	// history.getValue = function(resource, uri, path) {
	// 	if (this.state[resource] && this.state[resource][uri]) {
	// 		var value = this.state[resource][uri][path];
	// 		if (value && typeof value === "object") {
	// 			value = JSON.parse(JSON.stringify(value));
	// 		}
	// 		return value;
	// 	}
	// };
	// history.getValue = function(resource, uri, path) {
	// 	var value = KarmaFields.History.getObjectValue(this.state, [resource, uri, path]);
	// 	return KarmaFields.History.cloneObject(value);
	// };
	history.read = function(keys, buffer) {
		var value;
		if (buffer) {
			value = KarmaFields.Object.getValue(this[buffer], keys);
		} else {
			value = KarmaFields.Object.getValue(this["output"], keys);
			if (value === undefined) {
				value = KarmaFields.Object.getValue(this["input"], keys);
			}
		}
		return KarmaFields.Object.clone(value);
	};
	history.hasChanges = function(keys) {
		return KarmaFields.Object.getValue(this.buffer, keys)

		// if (this.buffer[resource]) {
		// 	for (var i in this.buffer[resource]) {
	  //     return true;
	  //   }
		// }
		// return false;
	};
	// history.sync = function() {
	// 	return fetch(KarmaFields.saveURL+"/"+history.driver+"/"+history.method, {
	// 		method: "post",
	// 		headers: {"Content-Type": "application/json"},
	// 		body: JSON.stringify(this.buffer),
	// 		mode: "same-origin"
	// 	}).then(function(response) {
	// 		return response.json();
	// 	}).then(function(results) {
	// 		history.bufferNotEmpty = false;
	// 		history.buffer = {};
	// 		return results;
	// 	});
	// };
	// history.fetch = function(resource, uri, path, cache) {
	// 	if (history.cache[resource+"/"+uri+"/"+path]) {
	// 		return history.cache[resource+"/"+uri+"/"+path];
	// 	} else if (history.state[resource] && history.state[resource][uri] && history.state[resource][uri][path]) {
	// 		return Promise.resolve(history.state[resource][uri][path]);
	// 	} else {
	// 		var file;
	// 		if (cache && KarmaFields.cacheURL) {
	// 			file = KarmaFields.cacheURL+"/"+history.driver+"/"+uri+"/"+path;
	// 		} else {
	// 			file = KarmaFields.cacheURL+"/"+history.driver+"/"+uri+"/"+cache;
	// 		}
	// 		var promise = fetch(file, {
	// 			cache: "reload"
	// 		}).then(function(response) {
	// 			return response.json();
	// 		});
	// 		history.cache[resource+"/"+uri+"/"+path] = promise;
	// 		return promise;
	// 	}
	// };

	return history;
};
