
KarmaFields.History = {};
KarmaFields.History.createInstance = function(store) {
	var history = {};
	// history.undos = [];
	// history.redos = [];
	history.store = store || {};
	// history.store = {};


	// history.store.undos = history.store.undos || {
	// 	0: {}
	// };
	// history.store.index = history.store.index || 0;
	// history.store.min = history.store.min || 0;
	// history.store.max = history.store.max || 0;
	// history.temp = {};
	// history.next = {};
	history.lastFlux = "nav";



	history.empty = function(path) {
		KarmaFields.Object.setValue(this.store, path, null);
	};
	history.getValue = function(path) {
		return KarmaFields.Object.getValue(this.store, path);
	};
	history.setValue = function(path, value, under) {
		// console.trace();
		KarmaFields.Object.setValue(this.store, path, value, under);
	};
	history.isEmpty = function(path) {
		var value = this.getValue(path);
		return KarmaFields.Object.isEmpty(value);
	};
	history.clean = function(path) {
		var value = this.getValue(path);
		value = KarmaFields.Object.clean(value);
		KarmaFields.Object.setValue(path, value);
	};
	history.filter = function(buffer, path, callback) {
		var value = this.read(buffer, path);
		var clone = {};
		for (var i in value) {
			if (callback(value[i])) {
				clone[i] = value[i];
			}
		}
		this.write(buffer, path, clone);
	};




	history.write = function(buffer, path, value, flux) {

		// value = KarmaFields.Object.clone(value);
		if (buffer !== "static" && buffer !== "input") {
			var index = this.getValue(["index"]) || 0;
			if (buffer === "output") {
				// this.store.max = this.store.index;
				this.setValue(["max"], index);
			}
			if (this.lastFlux !== flux && flux) {
				if (!this.isEmpty(["undos", index])) {
					index++;
					this.setValue(["index"], index);
					this.setValue(["max"], index);


					// this.store.undos[this.store.index] = {};

					// console.log(this.store.index);
				}
				// this.store.undos[this.store.index] = {}
				this.lastFlux = flux;
			}
			var prev = this.getValue(["undos", index-1]);
			if (prev) {
				var reverseValue = this.read(buffer, path, null);
				this.setValue(["undos", index-1, buffer, ...path], reverseValue, true);
				// KarmaFields.Object.setValue(this.store.undos[this.store.index-1], [buffer, ...path], currentValue, true);
			}
			// KarmaFields.Object.setValue(this.store.undos[this.store.index], [buffer, ...path], value);
			// console.log(value);
			this.setValue(["undos", index, buffer, ...path], KarmaFields.Object.clone(value));
		}
		// KarmaFields.Object.setValue(this.store, [buffer, ...path], value);
		this.setValue([buffer, ...path], KarmaFields.Object.clone(value));
	};

	history.merge = function(buffer, path, value, under) {
		if (value && typeof value === "object") {
			var object = this.getValue([buffer, ...path]);
			if (!object || typeof object !== "object") {
				object = {};
				this.setValue([buffer, ...path], object);
			}
			KarmaFields.Object.merge(object, value, under);
		} else if (value !== undefined) {
			this.setValue([buffer, ...path], value, under);
		}
	};

	history.read = function(buffer, path, defaultValue) {

		var value = this.getValue([buffer, ...path]);
		if (value === undefined && buffer === "output") {
			value = this.getValue(["input", ...path]);
		}
		if (value === undefined) {
			return defaultValue;
		}
		return KarmaFields.Object.clone(value);
	}
	history.undo = function(callback) {
		// if (this.hasUndo()) {
			// var temp =  this.store.undos[this.store.index];
			// this.store.undos[this.store.index] = this.store.undos[--this.store.index];
			// KarmaFields.Object.merge(this.store, temp);
			var index = this.getValue(["index"]);
			var prev = this.getValue(["undos", index-1]);
			if (prev) {
				// console.log("prev", prev);
				// prev = KarmaFields.Object.clone(prev);
				KarmaFields.Object.merge(this.store, prev);
				this.setValue(["index"], index-1);
			}
		// }
	};
	history.redo = function(callback) {
		// if (this.hasRedo()) {
			// var temp =  this.store.undos[this.store.index];
			// this.store.undos[this.store.index] = this.store.undos[++this.store.index];
			// KarmaFields.Object.merge(this.store, temp);
			var index = this.getValue(["index"]) || 0;
			// var current = this.getValue(["undos", index]);
			var next = this.getValue(["undos", index+1]);
			if (next) {
				// this.setValue(["undos", index+1], current);
				// this.setValue(["undos", index], next);
				// console.log("next", next);
				// next = KarmaFields.Object.clone(next);

				KarmaFields.Object.merge(this.store, next);
				this.setValue(["index"], index+1);
			}
		// }
	};
	history.hasUndo = function(callback) {
		var index = this.getValue(["index"]) || 0;
		var min = this.getValue(["min"]) || 0;
		return index > min;
	};
	history.hasRedo = function(callback) {
		var index = this.getValue(["index"]) || 0;
		var max = this.getValue(["max"]) || 0;
		return index < max;
	};

	history.diff = function(path1, path2) {
		var obj1 = this.getValue(path1) || {};
		var obj2 = this.getValue(path2) || {};
		return KarmaFields.Object.diff(obj1, obj2);
	};
	history.isModified = function(buffer, path) {
		if (buffer === "output") {
			return !this.contain(["input", ...path], ["output", ...path]);
		}
	};
	history.contain = function(path1, path2) {
		var obj1 = this.getValue(path1) || {};
		var obj2 = this.getValue(path2) || {};
		return KarmaFields.Object.contain(obj1, obj2);
	};
	return history;
};
