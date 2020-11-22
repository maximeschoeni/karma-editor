
KarmaFields.History = {};
KarmaFields.History.createInstance = function(store) {
	var history = {};
	// history.undos = [];
	// history.redos = [];
	history.store = store || {};
	history.store.undos = store.undos || {
		0: {}
	};
	history.store.index = store.index || 0;
	history.store.min = store.min || 0;
	history.store.max = store.max || 0;
	// history.temp = {};
	// history.next = {};
	history.lastFlux = "nav";

	history.empty = function(buffer, path) {
		KarmaFields.Object.setValue(this.store, [buffer, ...path], null);
	};

	history.setValue = function(buffer, path, value) {
		KarmaFields.Object.setValue(this.store, [buffer, ...path], value);
	};

	history.write = function(buffer, path, value, flux) {
		value = KarmaFields.Object.clone(value);
		if (buffer !== "static" && buffer !== "input") {
			if (buffer === "output") {
				this.store.max = this.store.index;
			}
			if (this.lastFlux !== flux && flux) {
				if (!KarmaFields.Object.isEmpty(this.store.undos[this.store.index])) {
					this.store.index++;
					this.store.undos[this.store.index] = {};
					this.store.max = this.store.index;
				}
				// this.store.undos[this.store.index] = {}
				this.lastFlux = flux;
			}
			if (this.store.undos[this.store.index-1]) {
				var currentValue = this.read(buffer, path, null);
				KarmaFields.Object.setValue(this.store.undos[this.store.index-1], [buffer, ...path], currentValue, true);
			}
			KarmaFields.Object.setValue(this.store.undos[this.store.index], [buffer, ...path], value);
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
		if (value === undefined && buffer === "output") {
			value = KarmaFields.Object.getValue(this.store, ["input", ...path]);
		}
		if (value === undefined) {
			return defaultValue;
		}
		return KarmaFields.Object.clone(value);
	}
	history.undo = function(callback) {
		if (this.hasUndo()) {
			var temp =  this.store.undos[this.store.index];
			this.store.undos[this.store.index] = this.store.undos[--this.store.index];
			KarmaFields.Object.merge(this.store, temp);
		}

	};
	history.redo = function(callback) {
		if (this.hasRedo()) {
			var temp =  this.store.undos[this.store.index];
			this.store.undos[this.store.index] = this.store.undos[++this.store.index];
			KarmaFields.Object.merge(this.store, temp);
		}
	};
	history.hasUndo = function(callback) {
		return this.store.index > this.store.min || 0;
	};
	history.hasRedo = function(callback) {
		return this.store.index < this.store.max;
	};

	history.diff = function(path1, path2) {
		var obj1 = KarmaFields.Object.getValue(this.store, path1) || {};
		var obj2 = KarmaFields.Object.getValue(this.store, path2) || {};
		return KarmaFields.Object.diff(obj1, obj2);
	};
	history.isModified = function(buffer, path) {
		if (buffer === "output") {
			return !this.contain(["input", ...path], ["output", ...path]);
		}
	};
	history.contain = function(path1, path2) {
		var obj1 = KarmaFields.Object.getValue(this.store, path1) || {};
		var obj2 = KarmaFields.Object.getValue(this.store, path2) || {};
		return KarmaFields.Object.contain(obj1, obj2);
	};
	return history;
};
