
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
	history.edition = {};
	// history.stopEdit = function() {
	// 	if (this.edition && KarmaFields.Object.diff(this.edition.output, this.output)) {
	// 		this.undos.push(this.edition);
	// 		this.edition = null;
	// 	}
	// };
	history.breakHistory = function() {
		// if (this.edition && !KarmaFields.Object.isEmpty(this.edition)) {
		if (this.edition && !KarmaFields.Object.diff(this.edition, {})) {
			this.undos.push(this.edition);
			this.edition = {};
		}
	};
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
	history.save = function(path, value) {
		KarmaFields.Object.setValue(this.edition, path, value, true);
	};
	history.write = function(path, value, prevValue) {
		// var bufferName = path[0];
		// if (hasHistory && breakHistory && this.edition && KarmaFields.Object(this.edition, path) === undefined) {
		// 	this.stopEdit();
		// }
		// if (!this.edition && hasHistory) {
		// 	var revertValue = KarmaFields.Object.getValue(this, path);
		// 	if (revertValue === undefined && bufferName === "output" && this.input) {
		// 		revertValue = KarmaFields.Object.getValue(this.input, path);
		// 	}
		// 	if (revertValue) {
		// 		this.edition = {};
		// 		KarmaFields.Object.setValue(this.edition, path, revertValue, true);
		// 	}
		// }

		// if (prevValue) {
		// 	KarmaFields.Object.setValue(this.edition, path, prevValue, true);
		// }

		KarmaFields.Object.setValue(this, path, value);
		if (this.onEdit) {
			this.onEdit(path, value);
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
		}
	};
	history.redo = function(callback) {
		var reverse = this.find(this.redos, callback);
		if (reverse) {
			this.undos.unshift(KarmaFields.Object.mask(this, reverse));
			KarmaFields.Object.merge(this, reverse);
		}
	};
	history.hasUndo = function(callback) {
		return this.find(this.undos, callback);
	};
	history.hasRedo = function(callback) {
		return this.find(this.redos, callback);
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
	history.read = function(path) {
		var value = KarmaFields.Object.getValue(this, path);
		return KarmaFields.Object.clone(value);
	};
	history.hasChanges = function() {
		return this.output && KarmaFields.Object.diff(this.output, this.input || {});
	};
	history.diff = function(path1, path2) {
		var obj1 = KarmaFields.Object.getValue(this, path1);
		var obj2 = KarmaFields.Object.getValue(this, path2);
		return obj1 && KarmaFields.Object.diff(obj1, obj2 || {});
	};
	// history.readTemp = function(path) {
	// 	return this.edition && KarmaFields.Object.getValue(this.edition, path);
	// };
	// history.writeTemp = function(path, value) {
	// 	KarmaFields.Object.setValue(["edition"].concat(path), value);
	// }
	return history;
};
