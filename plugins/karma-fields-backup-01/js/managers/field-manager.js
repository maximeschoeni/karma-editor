KarmaFields.managers.field = function() {

	var manager = {
		resource: {},
		hasHistory: true,
		subKeys: [],
		path: "default_path",
		buffer: "default_buffer",

		// input: "input",
		// output: "ouput",

		// init: function(resource, args) {
		// 	this.resource = resource;
		// 	this.label = resource.label;
		// 	this.key = resource.key;
		// 	this.driver = resource.driver;
		// 	this.name = resource.field || resource.name || "group";
		// 	this.subKeys = resource.child_key && resource.child_key.split("/") || [];
		// 	this.input = [].concat(args.inputBuffer || [], args.path || [], resource.key || [], manager.subKeys);
		// 	this.output = [].concat(args.outputBuffer || [], args.path || [], resource.key || [], manager.subKeys);
		// 	this.id = [].concat(resource.driver || [], args.path && args.path.split("/") || [], resource.key || [], manager.subKeys).join("-");
		// 	this.path = args.path;
		// 	this.args = args;
		// 	this.history = args.history;
		// },

		build: function() {

			if (this.resource.label) {
				return [
					{
						tag: "label",
						init: function(label) {
							if (manager.id) {
								label.element.htmlFor = manager.id;
							}
							label.element.innerText = manager.resource.label;
						}
					},
					KarmaFields.fields[manager.resource.name || manager.resource.field || "group"](manager)
				];
			} else {
				return [
					KarmaFields.fields[manager.resource.name || manager.resource.field || "group"](manager)
				];
			}
		},
		createChild: function(resource) {
			var child = KarmaFields.managers.field();
			child.resource = resource;
			// child.incrementHistory = this.incrementHistory;
			child.history = this.history;
			// child.selection = this.selection;
			child.onSetValue = this.onSetValue;
			child.onSubmit = this.onSubmit;
			child.onRequestFooterUpdate = this.onRequestFooterUpdate;
			// child.input = this.input.slice(0, -1).concat(resource.key || [], resource.subKeys || []);
			// child.output = this.output.slice(0, -1).concat(resource.key || [], resource.subKeys || []);
			// child.input = this.input; //.slice(0, -1).concat(resource.key || [], resource.subKeys || []);
			// child.output = this.output; //.slice(0, -1).concat(resource.key || [], resource.subKeys || []);
			// child.id = [this.id].concat(resource.subKeys || []).join("-");
			child.path = this.path;
			child.buffer = resource.buffer || this.buffer;


			// child.cancelable = this.cancelable;

			return child;
		},
		getId: function() {
			// var id = this.id || "";
			// if (this.path) {
			// 	id += "-"+this.path.split("/").join("-");
			// }
			// if (this.resource && this.resource.key) {
			// 	id += "-"+this.resource.key
			// }
			// if (this.subKeys && this.subKeys.length) {
			// 	id += "-"+this.subKeys.join("-");
			// }
			// return id;

			return this.getPath().join("-");
		},

		getPath: function(buffer) {
			var path = [];
			if (this.resource && this.resource.driver) {
				path.push(this.resource.driver);
			}
			if (this.path) {
				path.push(this.path);
			}
			if (this.resource && this.resource.key) {
				path.push(this.resource.key);
			}
			if (this.subKeys && this.subKeys.length) {
				path = path.concat(this.subKeys);
			}
			return path;
		},

		getValue: function() {
			// var output = this.getPath("output");
			// var value = this.history.read(this.output);
			// if (value === undefined) {
			// 	var input = this.getPath("input");
			// 	value = this.history.read(input);
			// }
			// var path = this.getPath("output");
		// return this.history.read([this.buffer, this.path, this.key, ...this.subKeys], ["input", this.path, this.key, ...this.subKeys]);
		if (this.history && this.resource && this.buffer) {
			var path = this.getPath();
			return this.history.read(this.buffer, path);
		}

			// if (value === undefined) {
			// 	value = this.history.read();
			// }
			// return value;
		},
		setValue: function(value, flux) {
			// var path = this.getPath("output");

			// if (multiedit === undefined) {
			// 	multiedit = this.multiedit;
			// }
			if (this.history && this.resource) {

				var path = this.getPath();
				if (this.buffer === "output") {
					this.history.write(this.buffer, path, value, flux || path.join("/"));
				} else {
					this.history.write(this.buffer, path, value, "nav");
				}

				// if (this.buffer !== "static") {
				// 	if (this.cancelable) {
				// 		var flux = path.join("/");
				// 		if (this.history.lastFlux !== flux) {
				// 			var currentValue = this.getValue();
				// 			this.history.undos.unshift(this.history.buffer.undo);
				// 			this.history.buffer.undo = {};
				// 			this.history.write(["undo", this.buffer, this.path, this.key, ...this.subKeys], currentValue);
				// 		}
				// 		this.history.lastFlux = flux;
				// 	} else {
				// 		this.history.write(["undo", this.buffer, this.path, this.key, ...this.subKeys], value);
				// 	}
				// }
				// this.history.write([this.buffer, this.path, this.key, ...this.subKeys], value);
			}

			//
			// if (this.hasHistory && this.incrementHistory) {
			// 	this.history.saveOver(output, this.getValue(), true, noIncrementHistory);
			// }

			//
			// this.history.write(output, value);
			//
			// if (this.hasHistory && !this.incrementHistory) {
			// 	this.history.saveOver(output, value);
			// }

			if (this.resource && this.resource.multiedit && this.selection && this.selection.onMultiEdit) {
				this.selection.onMultiEdit(this, value);
			}
			if (this.onSetValue) {
				this.onSetValue(this);
			}


		},
		isModified: function() {
			// return this.history && this.history.diff(this.buffer);
			var path = this.getPath();
			return this.history && this.history.isModified(this.buffer, path);
		},
		fetchValue: function(forceReload) {
			var value = this.getValue();
			if (!forceReload && value !== undefined) {
				return Promise.resolve(value);
			} else if (this.buffer === "output" && this.resource && this.resource.driver && this.resource.key && this.path) {
				return this.fetch(this.resource.driver, this.path, this.resource.key, this.resource.subKeys || [], this.resource.cache).then(function(value) {
					if (value !== undefined) {
						// var input = this.getPath("input");
						// manager.history.write(input, value);
						var path = manager.getPath();
						manager.history.write("input", path, value);
						return value;
					}
				});
			} else {
				if (this.resource.default !== undefined) {
					var path = this.getPath();
					this.history.write(this.buffer, path, this.resource.default);
				}
				return Promise.resolve(this.resource.default);
			}
		},
		fetch: function(driver, path, key, subkeys, cache) {
			if (subkeys.length > 0) {
				var parentKeys = keys.slice();
				var childKey = parentKeys.pop();
				return this.fetch(driver, path, key, parentKeys, cache).then(function(value) {
					return value && value[childKey]
				});
			} else {
				return KarmaFields.Transfer.get(driver, path, key, cache);
			}
		},
		fetchOptions: function(custom) {
			if (this.resource.driver && this.resource.key) {
				var params = {};
				if (this.history) {
					var filters = this.history.read("inner", [this.resource.driver, "filters"]) || {};
					for (var i in filters) {
						if (i !== this.resource.key) {
							params[i] = filters[i];
						}
					}
				}
				if (custom) {
					for (var i in custom) {
						params[i] = custom[i];
					}
				}
				return KarmaFields.Transfer.fetch(this.resource.driver, this.resource.key, params);
			} else {
				return Promise.resolve();
			}
    }
	};


	// manager.subKeys = resource.child_key && resource.child_key.split("/") || [];
	// manager.input = [].concat(args.inputBuffer || [], args.path || [], resource.key || [], manager.subKeys);
	// manager.output = [].concat(args.outputBuffer || [], args.path || [], resource.key || [], manager.subKeys);
	// manager.id = [].concat(resource.driver || [], args.path && args.path.split("/") || [], resource.key || [], manager.subKeys).join("-");
	// manager.path = args.path;
	// manager.args = args;
	return manager;
}
