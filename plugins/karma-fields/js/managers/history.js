
KarmaFields.History = {};
KarmaFields.History.createInstance = function() {
	var history = {};
	// history.index = 0;
	// history.state = {};
	// history.buffer = {};
	// history.input = {};
	// history.output = {};
	// history.cache = {};
	history.undos = [];
	history.redos = [];
	// history.undoBuffer = {};
	history.temp = {};
	history.store = {};
	// history.store = {
	// 	buffer: {},
	// 	read: function(path) {
	// 		return KarmaFields.Object.getValue(this.buffer, path);
	// 	},
	// 	write: function(path, value, under) {
	// 		KarmaFields.Object.setValue(this.buffer, path, value, under);
	// 	}
	// }
	// history.edition = {};
	// history.stopEdit = function() {
	// 	if (this.edition && KarmaFields.Object.diff(this.edition.output, this.output)) {
	// 		this.undos.push(this.edition);
	// 		this.edition = null;
	// 	}
	// };
	// history.breakHistory = function() {
	// 	// if (this.edition && !KarmaFields.Object.isEmpty(this.edition)) {
	// 	// if (this.edition && !KarmaFields.Object.diff(this.edition, {})) {
	// 	if (!KarmaFields.Object.isEmpty(this.edition)) {
	// 		// console.log("break", this.edition);
	// 		this.undos.push(this.edition);
	// 		// console.log("break", this.edition, this.undos);
	// 		this.edition = {};
	// 	}
	// };

	// history.updateFlux = function(path, value) {
	//
	// 	if (!this.undos[0] || !KarmaFields.Object.isEmpty(this.undos[0]) && this.currentFlux && path.toString() !== this.currentFlux) {
	// 		this.undos.unshift({});
	// 	}
	//
	// 	this.currentFlux = null;
	//
	// 	KarmaFields.Object.setValue(this.undos[0], path, value, true);
	//
	// }

	// history.maybeBreakHistory = function(path) {
	//
	// 	// if (this.undos[0] && !KarmaFields.Object.isEmpty(this.undos[0]) && this.currentFlux && path !== this.currentFlux) {
	// 	// 	this.undos.unshift({});
	// 	// }
	//
	// 	if (this.undos[0] && !KarmaFields.Object.isEmpty(this.undos[0]) && KarmaFields.Object.getValue(this.undos[0], path) === undefined) {
	// 		this.undos.unshift({});
	// 	}
	// };

	// history.breakHistory = function() {
	//
	//
	//
	// 	if (this.undos[0] && !KarmaFields.Object.isEmpty(this.undos[0])) {
	// 		this.undos.unshift({});
	// 	}
	// };

	// history.readInOut = function(input, output) {
	// 	return this.readIn(output) || this.readOut(input);
	// }
	// history.readIn = function(input) {
	// 	return KarmaFields.Object.getValue(this.buffer, input);
	// }
	//
	// history.write = function(path, value, external, over, memory, flux) {
	// 	var currentValaue = this.readIO(input, output);
	// 	var flux = output && output.toString();
	// 	if (this.flux && this.flux !== flux) {
	// 		this.undos.unshift({});
	// 	}
	// 	this.flux = flux;
	// 	this.writeIn(output, value);
	// }
	// history.write = function(path, value) {
	// 	if (!this.undos[0]) {
	// 		this.undos.unshift({});
	// 	}
	// 	KarmaFields.Object.setValue(this.undos[0], path, currentValue, true);
	// 	KarmaFields.Object.setValue(this.work, path, value);
	// }
	//
	// history.writeIn = function(path, value) {
	// 	KarmaFields.Object.setValue(this.input, path, value);
	// }

	// history.write = function(bufferName, path, keys, value, noBreak) {
	// 	if (bufferName === "output" && !noBreak && this.edition && KarmaFields.Object(this.edition, [bufferName].concat(path, keys)) === undefined) {
	// 		this.stopEdit();
	// 	}
	// 	if (!this.edition && bufferName !== "input" && this[bufferName]) {
	// 		var revertValue = KarmaFields.Object.getValue(this, [bufferName].concat(path, keys));
	// 		if (revertValue === undefined && bufferName === "output" && this.input) {
	// 			revertValue = KarmaFields.Object.getValue(this.input, [bufferName].concat(path, keys));
	// 		}
	// 		if (revertValue) {
	// 			this.edition = {};
	// 			KarmaFields.Object.setValue(this.edition, [bufferName].concat(path, keys), revertValue, true);
	// 		}
	// 	}
	//
	// 	KarmaFields.Object.setValue(this, [bufferName].concat(path, keys), value);
	//
	// 	if (this.onEdit) {
	// 		this.onEdit(buffer, path, keys, value, noBreak);
	// 	}
	// };

	// history.breakHistory = function() {
	// 	if (!KarmaFields.Object.isEmpty(this.undoBuffer)) {
	// 		this.flux = undefined;
	// 		// this.undos.unshift({});
	// 		this.undos.unshift(this.undoBuffer);
	// 		this.undoBuffer = {};
	//
	// 		console.log("breakHistory", this.undos);
	// 	}
	// },

	// history.save = function(path, value, breakBefore) {
	//
	// 	KarmaFields.Object.setValue(this.undoBuffer, path, value, breakBefore);
	//
	// 	var flux = path.toString();
	//
	//
	// 	console.log("save", flux, value, breakBefore, this.flux, this.undoBuffer);
	//
	// 	if (breakBefore && flux !== this.flux) {
	// 		this.breakHistory();
	// 	}
	// 	this.flux = flux;
	//
	// };

	// history.write = function(buffer, path, key, subKeys, value, cancelable) {
	// 	if (buffer !== "static") {
	// 		if (cancelable) {
	// 			var flux = [path||[], key||[]].concat(subKeys||[]).join("/");
	// 			if (this.lastFlux !== flux) {
	// 				var currentValue = this.read(buffer, path||[], key||[], subKeys);
	// 				var undo = KarmaFields.Object.getValue(this.store, ["undo"]);
	// 				if (!KarmaFields.Object.isEmpty(undo)) {
	// 					this.undos.unshift(undo);
	// 					KarmaFields.Object.delete(this.store, ["undo"]);
	// 				}
	// 				KarmaFields.Object.setValue(this.store, ["undo", buffer, path||[], key||[]].concat(subKeys||[]), currentValue);
	// 			}
	// 			this.lastFlux = flux;
	// 		} else {
	// 			KarmaFields.Object.setValue(this.store, ["undo", buffer, path||[], key||[]].concat(subKeys||[]), value);
	// 		}
	// 	}
	// 	KarmaFields.Object.setValue(this.store, [buffer, path||[], key||[]].concat(subKeys||[]), value);
	// };
	// history.read = function(buffer, path, key, subKeys) {
	// 	var value = KarmaFields.Object.getValue(this.store, [buffer, path||[], key||[]].concat(subKeys||[]));
	// 	if (value === undefined) {
	// 		value = KarmaFields.Object.getValue(this.store, ["static", path||[], key||[]].concat(subKeys||[]));
	// 	}
	// 	return value;
	// }

	history.empty = function(buffer, path) {
		KarmaFields.Object.empty(this.store, [buffer, ...path]);
	};

	history.write = function(buffer, path, value, flux) {
		if (buffer !== "static" && buffer !== "input") {

			console.log(this.lastFlux !== flux);
			if (this.lastFlux !== flux) {
				var currentValue = this.read(buffer, path);
				// console.log("write change flux", buffer, path, currentValue);
				KarmaFields.Object.setValue(this.temp, [buffer, ...path], currentValue);

				if (!KarmaFields.Object.isEmpty(this.temp) && !KarmaFields.Object.contain(this.store, this.temp)) {

					console.log(this.temp);
					this.undos.unshift(this.temp);
					// console.log("write break", this.undos);
					this.temp = {};
				}
				this.lastFlux = flux;
			}

			if (buffer === "output") {
				// var flux = path.join("/");
				// console.log(flux);


				KarmaFields.Object.setValue(this.temp, [buffer, ...path], value);
			} else {
				// console.log("write temp", buffer, path, value);
				KarmaFields.Object.setValue(this.temp, [buffer, ...path], value);
			}
		}
		// console.log("write", buffer, path, value);
		KarmaFields.Object.setValue(this.store, [buffer, ...path], value);

		// console.log(KarmaFields.Object.clone(this.temp));
	};

	// history.write = function(buffer, path, value, flux) {
	// 	if (buffer !== "static" && buffer !== "input") {
	// 		if (buffer === "output") {
	// 			// var flux = path.join("/");
	// 			// console.log(flux);
	// 			if (flux !== undefined && this.lastFlux !== flux) {
	// 				var currentValue = this.read(buffer, path);
	// 				// console.log("write change flux", buffer, path, currentValue);
	// 				KarmaFields.Object.setValue(this.temp, [buffer, ...path], currentValue);
	//
	// 				if (!KarmaFields.Object.isEmpty(this.temp)) {
	// 					this.undos.unshift(this.temp);
	// 					// console.log("write break", this.undos);
	// 					this.temp = {};
	// 				}
	// 				this.lastFlux = flux;
	// 			}
	//
	// 			KarmaFields.Object.setValue(this.temp, [buffer, ...path], value);
	// 		} else {
	// 			// console.log("write temp", buffer, path, value);
	// 			KarmaFields.Object.setValue(this.temp, [buffer, ...path], value);
	// 		}
	// 	}
	// 	// console.log("write", buffer, path, value);
	// 	KarmaFields.Object.setValue(this.store, [buffer, ...path], value);
	//
	// 	// console.log(KarmaFields.Object.clone(this.temp));
	// };
	history.read = function(buffer, path) {
		var value = KarmaFields.Object.getValue(this.store, [buffer, ...path]);
		// console.log("read", buffer, path, value);
		if (value === undefined && buffer === "output") {
			value = KarmaFields.Object.getValue(this.store, ["input", ...path]);
			// console.log("read", "input", path, value);
		}
		return value;
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
