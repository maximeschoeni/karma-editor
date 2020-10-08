
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
				// if (index === 0 || !this.contain(["input"], ["undos", index, "output"])) {
					index++;
					console.log(index);
					this.setValue(["index"], index);
					this.setValue(["max"], index);


					// this.store.undos[this.store.index] = {};

					// console.log(this.store.index);
				}
				// this.store.undos[this.store.index] = {}
				this.lastFlux = flux;
			}

			// console.log(value, this.getValue(["input", ...path]));

			var prev = this.getValue(["undos", index-1]);
			if (prev) {
				var reverseValue = this.read(buffer, path, null);
				this.setValue(["undos", index-1, buffer, ...path], reverseValue, true);
			}
			this.setValue(["undos", index, buffer, ...path], KarmaFields.Object.clone(value));


			// if (this.contain(["input"], ["undos", index, "output"])) {
			//
			// 	index = Math.max(0, index-1);
			//
			// 	this.setValue(["index"], index);
			// 	this.setValue(["max"], index);
			//
			// 	this.lastFlux = "xx";
			//
			// }


		}
		// KarmaFields.Object.setValue(this.store, [buffer, ...path], value);

		this.setValue([buffer, ...path], KarmaFields.Object.clone(value));
		// console.log([buffer, ...path], value);
		// console.trace();
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
	// history.readIO = function(input, output, defaultValue) {
	// 	var value = this.getValue(output);
	// 	if (value === undefined && input !== output) {
	// 		value = this.getValue(input);
	// 	}
	// 	if (value === undefined) {
	// 		return defaultValue;
	// 	}
	// 	return KarmaFields.Object.clone(value);
	// }
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

	history.createFieldManager = function(resource) {
		var manager = {
			resource: resource,
			build: function() {
				if (resource.label) {
					return [
						{
							tag: "label",
							init: function(label) {
								if (manager.id) {
									label.element.htmlFor = manager.id;
								}
								label.element.innerText = resource.label;
							}
						},
						KarmaFields.fields[resource.name || resource.field || "group"](manager)
					];
				} else {
					return [
						KarmaFields.fields[resource.name || resource.field || "group"](manager)
					];
				}
			},
			createChild: function(resource) {
				var child = history.createFieldManager(resource);
				child.parent = this;
				child.path = this.getPath();
				child.fieldId = child.path.join("-");
				return child;
			},
			getAttribute: function(attr) {
				if (resource[attr] !== undefined) {
					return resource[attr];
				} else if (this.parent) {
					return this.parent.getAttribute(attr);
				}
			},
			getPath: function(buffer) {
				var path = [];
				// var buffer = this.getAttribute(buffer);
				var driver = this.getAttribute("driver");
				var uri = this.getAttribute("uri");
				var key = this.getAttribute("key");
				var child_keys = this.getAttribute("child_keys");
				if (driver) {
					path.push(driver);
				}
				if (uri) {
					path.push(uri);
				}
				if (key) {
					path.push(key);
				}
				if (child_keys) {
					path = [path, ...child_keys];
				}
				return path;
			},
			submit: function() {
				if (this.onSubmit) {
					this.onSubmit();
				} else if (this.parent) {
					this.parent.submit();
				}
			},

			getValue: function() {
				var inputBuffer = this.getAttribute("inputBuffer");
				var outputBuffer = this.getAttribute("outputBuffer");
				if (outputBuffer) {
					var value = history.read(outputBuffer, this.path);
					if (value === undefined && inputBuffer !== outputBuffer) {
						value = history.read(inputBuffer, this.path);
					}
					return value;
				}
			},
			setValue: function(value) {
				this.write(value, this.id);

				var multiedit = this.getAttribute("multiedit");
				var selection = this.getAttribute("selection");

				if (multiedit && selection) {
					selection.onMultiEdit(this, value, this.id);
				}
				// if (this.onSetValue) {
				// 	this.onSetValue(this);
				// }
			},
			write: function(value, flux) {
				var outputBuffer = this.getAttribute("outputBuffer");
				history.write(outputBuffer, this.path, value, this.id);
			},
			isModified: function() {
				var inputBuffer = this.getAttribute("inputBuffer");
				var outputBuffer = this.getAttribute("outputBuffer");
				return !history.contain([inputBuffer, ...this.path], [outputBuffer, ...this.path]);
			},
			fetchValue: function(forceReload) {
				var value = this.getValue();
				if (!forceReload && value !== undefined) {
					return Promise.resolve(value);
				} else {
					var promise = this.getPromise();
					if (promise) {
						promise.then(function(value) {
							if (resource.child_keys) {
								return KarmaFields.Object.getValue(value, resource.child_keys);
							}
							// var path = manager.getPath();
							// manager.history.write(manager.inputBuffer, path, value);
							return value;
						});
					} else {
						if (resource.default !== undefined) {
							var outputBuffer = this.getAttribute("outputBuffer");
							history.write(outputBuffer, this.path, resource.default);
						}
						return Promise.resolve(resource.default);
					}
				}
			},
			getPromise: function() {
				if (resource.key) {
					var driver = this.getAttribute("driver");
					var uri = this.getAttribute("uri");
					var inputBuffer = this.getAttribute("inputBuffer");
					var path = this.path;
					if (driver && uri) {
						if (!this.promise) {
							this.promise = KarmaFields.Transfer.get(driver, uri, resource.key, resource.cache).then(function(value) {
								history.write(inputBuffer, path, value);
							});
						}
						return this.promise;
					}
				} else if (this.parent) {
					return this.getPromise();
				}
			},
			fetchOptions: function(params) {
				var driver = this.getAttribute("driver");
				if (resource.key && driver) {
					if (!params) {
						params = {};
					}
					params.filters = history.read("filters", []);
					return KarmaFields.Transfer.fetch(driver, resource.key, params);
				} else {
					return Promise.resolve();
				}
	    }
		};
		var outputBuffer = this.getAttribute("outputBuffer");
		history.setValue(this.fields, [outputBuffer, ...manager.path], manager)
		return manager;
	};
	history.getFieldManager = function(path) {
		return history.getValue(this.fields, path);
	};


	return history;
};
