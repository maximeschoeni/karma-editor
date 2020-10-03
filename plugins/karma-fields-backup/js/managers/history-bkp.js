
KarmaFields.History = {};
KarmaFields.History.createInstance = function() {
	var history = {};
	history.undos = [];
	history.redos = [];
	history.store = {};
	history.temp = {};
	history.next = {};
	history.lastFlux = "nav";

	history.empty = function(buffer, path) {
		KarmaFields.Object.setValue(this.store, [buffer, ...path], undefined);
	};

	history.setValue = function(buffer, path, value) {
		KarmaFields.Object.setValue(this.store, [buffer, ...path], value);
	};

	history.write = function(buffer, path, value, flux) {
		value = KarmaFields.Object.clone(value);
		if (buffer !== "static" && buffer !== "input") {
			if (buffer === "output") {
				this.redos = [];
			}
			if (this.lastFlux !== flux && flux) {
				if (!KarmaFields.Object.isEmpty(this.temp)) {
					this.undos.unshift(this.temp);
				}
				this.temp = {}
				this.lastFlux = flux;
			}
			if (this.undos[0]) {
				var currentValue = this.read(buffer, path, null);
				KarmaFields.Object.setValue(this.undos[0], [buffer, ...path], currentValue, true);
			}
			KarmaFields.Object.setValue(this.temp, [buffer, ...path], value);
		}
		KarmaFields.Object.setValue(this.store, [buffer, ...path], value);
	};

	history.merge = function(buffer, path, value, under) {
		if (value && typeof value === "object") {
			var object = KarmaFields.Object.getValue(this.store, [buffer, ...path]);
			if (!object || typeof object !== "object") {
				object = {};
				KarmaFields.Object.setValue(this.store, [buffer, ...path], object);
			}
			KarmaFields.Object.merge(object, value, under);
		} else if (value !== undefined) {
			KarmaFields.Object.setValue(this.store, [buffer, ...path], value, under);
		}
	};

	history.read = function(buffer, path, defaultValue) {
		var value = KarmaFields.Object.getValue(this.store, [buffer, ...path]);
		// console.log("read", buffer, path, value);
		if (value === undefined && buffer === "output") {
			value = KarmaFields.Object.getValue(this.store, ["input", ...path]);
			// console.log("read", "input", path, value);
		}
		if (value === undefined) {
			return defaultValue;
		}
		return KarmaFields.Object.clone(value);
	}


	// history.write = function(path, value) {
	// 	// var bufferName = path[0];
	// 	// if (hasHistory && breakHistory && this.edition && KarmaFields.Object(this.edition, path) === undefined) {
	// 	// 	this.stopEdit();
	// 	// }
	// 	// if (!this.edition && hasHistory) {
	// 	// 	var revertValue = KarmaFields.Object.getValue(this, path);
	// 	// 	if (revertValue === undefined && bufferName === "output" && this.input) {
	// 	// 		revertValue = KarmaFields.Object.getValue(this.input, path);
	// 	// 	}
	// 	// 	if (revertValue) {
	// 	// 		this.edition = {};
	// 	// 		KarmaFields.Object.setValue(this.edition, path, revertValue, true);
	// 	// 	}
	// 	// }
	//
	// 	// if (prevValue) {
	// 	// 	KarmaFields.Object.setValue(this.edition, path, prevValue, true);
	// 	// }
	//
	// 	// console.log("write", path, KarmaFields.Object.clone(value));
	//
	// 	// this.currentFlux = path.toString();
	//
	//
	// 	this.redos = [];
	//
	// 	KarmaFields.Object.setValue(this.buffer, path, value);
	//
	//
	// 	if (this.onEdit) {
	// 		this.onEdit();
	// 	}
	// };
	// history.find = function(array, callback) {
	// 	if (callback) {
	// 		return array.find(callback);
	// 	} else {
	// 		return array.shift();
	// 	}
	// };

	history.undo = function(callback) {
		if (this.undos.length) {
			// var reverse = this.undos.shift();
			// var mask = KarmaFields.Object.mask(this.store, reverse);
			//
			//
			// console.log(reverse);
			//
			// this.redos.unshift(mask);
			// KarmaFields.Object.merge(this.store, reverse);

			// console.log(KarmaFields.Object.clone(this.temp));
			this.redos.unshift(this.temp);
			this.temp = this.undos.shift();
			// console.log(KarmaFields.Object.clone(this.temp));


			KarmaFields.Object.merge(this.store, this.temp);
		}
	};
	history.redo = function(callback) {
		if (this.redos.length) {
			// var reverse = this.redos.shift();
			// var mask = KarmaFields.Object.mask(this.store, reverse);
			// this.undos.unshift(mask);
			// KarmaFields.Object.merge(this.store, reverse);

			this.undos.unshift(this.temp);
			this.temp = this.redos.shift();
			KarmaFields.Object.merge(this.store, this.temp);
		}
	};
	// history.redo = function(callback) {
	// 	var reverse = this.find(this.redos, callback);
	// 	if (reverse) {
	// 		this.undos.unshift(KarmaFields.Object.mask(this, reverse));
	// 		KarmaFields.Object.merge(this, reverse);
	// 	}
	// };
	history.hasUndo = function(callback) {

		return this.undos.length > 0;
		// console.log(this.undos[0]);

		// return !KarmaFields.Object.isEmpty(this.undos[0]) && KarmaFields.Object.diff(this.undos[0], this);
		//return this.find(this.undos, callback);
	};
	history.hasRedo = function(callback) {

		// console.log("hasRedo", this.redos[0]);

		return this.redos.length > 0;

		// return !KarmaFields.Object.isEmpty(this.redos[0]);
		//
		// return !KarmaFields.Object.isEmpty(this.redos[0]) && KarmaFields.Object.diff(this.undos[0], this);
		// return this.find(this.redos, callback);
	};
	// history.isModified = function(path, keys) {
	// 	var outputValue = KarmaFields.Object.getValue(this.output, path.concat(keys));
	// 	var inputValue = KarmaFields.Object.getValue(this.input, path.concat(keys))
	// 	return outputValue !== undefined && outputValue !== inputValue;
	// };
	// history.read = function(buffer, path, keys) {
	// 	var value = KarmaFields.Object.getValue(this, [buffer].concat(path, keys));
	// 	if (value === undefined && buffer === "output") {
	// 		value = KarmaFields.Object.getValue(this, ["input"].concat(path, keys));
	// 	}
	// 	return KarmaFields.Object.clone(value);
	// };
	// history.read = function(path) {
	// 	var value = KarmaFields.Object.getValue(this, path);
	// 	return KarmaFields.Object.clone(value);
	// };
	//
	// history.readBuffer = function(path, defaultPath) {
	// 	var value = KarmaFields.Object.getValue(this.buffer, path);
	// 	if (defaultPath && value === undefined) {
	// 		value = KarmaFields.Object.getValue(this.buffer, defaultPath);
	// 	}
	// 	return value;
	// };


	// history.hasChanges = function() {
	// 	// console.log(this.output, this.input, this.output && KarmaFields.Object.diff(this.output, this.input || {}));
	// 	return !this.output || !KarmaFields.Object.diff(this.output, this.input || {});
	// };
	// history.diff = function(path1, path2) {
	// 	var obj1 = KarmaFields.Object.getValue(this, path1);
	// 	var obj2 = KarmaFields.Object.getValue(this, path2);
	// 	return obj1 && KarmaFields.Object.diff(obj1, obj2 || {});
	// };
	history.diff = function(path1, path2) {
		var obj1 = KarmaFields.Object.getValue(this.store, path1) || {};
		var obj2 = KarmaFields.Object.getValue(this.store, path2) || {};
		// var diff = KarmaFields.Object.diff(obj1, obj2);


		return KarmaFields.Object.diff(obj1, obj2);


		// console.log("diff", path1, path2, obj1, obj2, diff);
		// return diff;
	};
	history.isModified = function(buffer, path) {
		// if (buffer === "output") {
		// 	return this.diff(["output", ...path], ["input", ...path]);
		// }
		if (buffer === "output") {
			return !this.contain(["input", ...path], ["output", ...path]);
		}
	};
	history.contain = function(path1, path2) {
		var obj1 = KarmaFields.Object.getValue(this.store, path1) || {};
		var obj2 = KarmaFields.Object.getValue(this.store, path2) || {};
		return KarmaFields.Object.contain(obj1, obj2);
	};
	// history.readTemp = function(path) {
	// 	return this.edition && KarmaFields.Object.getValue(this.edition, path);
	// };
	// history.writeTemp = function(path, value) {
	// 	KarmaFields.Object.setValue(["edition"].concat(path), value);
	// }
	return history;
};
