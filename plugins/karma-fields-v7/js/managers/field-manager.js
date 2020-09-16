KarmaFields.managers.field = function(resource, args) {
	// args:
	// inputBuffer: null,
	// outputBuffer: null,
	// path: null,
	// history: null,
	// selection: null,

// KarmaFields.managers.field = function(resource, path, history, selection, parent) {
	// var subKeys = resource.child_key && resource.child_key.split("/") || [];
	var manager = {
		resource: resource,
		// inputBuffer: null,
		// outputBuffer: null,
		// path: null,
		// key: resource.key,
		// subKeys: subKeys,
		// history: null,
		// selection: null,
		hasHistory: true,
		// subKeys: subKeys,
		// input: [].concat(args.inputBuffer || [], args.path || [], resource.key || [], subKeys),
		// output: [].concat(args.outputBuffer || [], args.path || [], resource.key || [], subKeys),
		subKeys: [],
		input: [],
		output: [],

		// value: undefined, // undefined until loaded

		// build: function() {
		// 	if (KarmaFields.fields[resource.field || resource.name || "group"]) {
		// 		this.element = KarmaFields.fields[resource.field || resource.name || "group"](this);
		// 		// this.init();
		// 		return this.element;
		// 	}
		// },
		// buildRaw: function() {
		// 	return KarmaFields.fields[resource.field || resource.name || "group"](manager);
		// },
		// build: function() {
		//
		// 	return {
		// 		class: "karma-field " + (resource.field || resource.name || "group") + " display-"+(resource.display || "block"),
		// 		init: function(element, update, args) {
		// 			if (resource.class) {
		// 				element.classList.add(resource.class);
		// 			}
		// 			args.children = [];
		// 			if (resource.label) {
		// 				args.children.push({
		// 					tag: "label",
		// 					init: function(label) {
		// 						if (manager.id) {
		// 							label.htmlFor = manager.id;
		// 						}
		// 						label.innerText = resource.label;
		// 					}
		// 				});
		// 			}
		// 			args.children.push({
		// 				class: "karma-field-content",
		// 				child: KarmaFields.fields[resource.field || resource.name || "group"](manager)
		// 			});
		// 		}
		// 		// children: [
		// 		// 	{
		// 		// 		tag: "label",
		// 		// 		init: function(label) {
		// 		// 			if (manager.id) {
		// 		// 				label.htmlFor = manager.id;
		// 		// 			}
		// 		// 			if (resource.label) {
		// 		// 				label.innerText = resource.label;
		// 		// 			}
		// 		//
		// 		// 		}
		// 		// 	},
		// 		// 	{
		// 		// 		class: "karma-field-content",
		// 		// 		child: KarmaFields.fields[resource.field || resource.name || "group"](manager)
		// 		// 	}
		// 		// ]
		// 	};
		// },
		build: function() {
			if (resource.label) {
				return [
					{
						tag: "label",
						init: function(label) {
							if (manager.id) {
								label.htmlFor = manager.id;
							}
							label.innerText = resource.label;
						}
					},
					KarmaFields.fields[resource.field || resource.name || "group"](manager)
				];
			} else {
				return [
					KarmaFields.fields[resource.field || resource.name || "group"](manager)
				];
			}
		},
		createChild: function(resource) {
			// var childKeys;
			// if (typeof resource.key === "string") {
			// 	childKeys = [resource.key];
			// } else if (Array.isArray(resource.key)) {
			// 	childKeys = resource.keys;
			// }
			// if (resource.child_key) {
			// 	childKeys = keys.concat(resource.child_key);
			// }

			// var child = KarmaFields.managers.field(resource, buffer, path, childKeys || [], history, selection, this);
			var child = KarmaFields.managers.field(resource, args);
			// child.inputBuffer = this.inputBuffer;
			// child.outputBuffer = this.outputBuffer;
			// child.path = this.path;
			// child.history = this.history;
			// child.selection = this.selection;

			// this.children.push(child);
			return child;
		},
		// submit: function() {
		// 	if (args.submit) {
		// 		args.submit();
		// 	}
		// },
		// getId: function() {
		// 	return this.input.join("-").split("/").join("-");
		// },
		// getInput: function() {
		// 	return [].concat(args.inputBuffer || [], args.path || [], resource.key || [], this.subKeys);
		// },
		// getOutput: function() {
		// 	if (this.outputBuffer) {
		// 		return [].concat(args.outputBuffer || [], args.path || [], resource.key || [], this.subKeys);
		// 	}
		// 	return this.getInput();
		// },
		getValue: function() {
			return args.history.read(this.output) || args.history.read(this.input);
		},
		setValue: function(value, noBreakHistory, noEditOthers) {
			if (this.hasHistory && !noBreakHistory && args.history.read(["edition"].concat(this.output) === undefined)) {
				args.history.breakHistory();
			}
			// if (!history.edition && this.hasHistory) {
			// 	var revertValue = this.getValue();
			// 	if (revertValue) {
			// 		history.write(["edition"], revertValue);
			// 	}
			// }
			if (this.hasHistory) {
				args.history.save(this.output, this.getValue());
			}
			args.history.write(this.output, value);
			if (!noEditOthers && args.selection && args.selection.onEditCell) {
				args.selection.onEditCell(this, value);
			}
			if (args.onSetValue) {
				args.onSetValue(this);
			}
		},
		isModified: function() {
			var outputValue = args.history.read(this.output);
			return outputValue !== undefined && outputValue !== args.history.read(this.input);
		},
		fetchValue: function() {
			var value = args.history.read(this.input);
			if (value !== undefined) {
				return Promise.resolve(value);
			} else if (resource.driver && resource.key && this.path) {
				// return this.fetchKey([resource.driver].concat(this.path).join("/"), resource.key, resource.cache).then(function(value) {
				return this.fetch(resource.driver, args.path, resource.key, this.subKeys, resource.cache).then(function(value) {
					if (value !== undefined) {
						args.history.write(manager.input, value);
					}
				});
			} else {
				return Promise.resolve(resource.default);
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
				// return this.fetchKey(driver, path, key, cache);
				return KarmaFields.Transfer.fetch(driver, path, key, cache);
			}
		},
		// fetch: function() {
		// 	if (!this.promise) {
		// 		if (resource.key) {
		// 			this.promise = this.fetchKey(resource.driver, uri, resource.key, resource.method, resource.cache);
		// 		} else if (parent) {
		// 			this.promise = parent.fetch().then(function(value) {
		// 				if (value && resource.child_key) {
		// 					return value[resource.child_key]
		// 				}
		// 				return value;
		// 			});
		// 		} else {
		// 			this.promise = Promise.resolve();
		// 		}
		// 	}
		// 	return this.promise;
		// },
		// fetchKey: function(driver, path, key, cache) {
		// 	var file;
		// 	if (cache && KarmaFields.cacheURL) {
		// 		file = [KarmaFields.cacheURL, driver, path, cache].join("/");
		// 	} else {
		// 		file = [KarmaFields.getURL, driver, path, key].join("/");
		// 	}
		// 	if (!args.history.cache[file]) {
		// 		args.history.cache[file] = fetch(file, {
		// 			cache: "reload"
		// 		}).then(function(response) {
		// 			if (!cache || cache.slice(-5) === ".json") {
		// 				return response.json();
		// 			} else {
		// 				return response.text();
		// 			}
		// 		});
		// 		return args.history.cache[file];
		// 	}
		// },


		fetchOptions: function(params) {
			if (resource.driver && resource.key) {
				if (args.history) {
					params = params || {};
					KarmaFields.Object.merge(params, args.history.read(["filters"]));
				}
				return KarmaFields.Transfer.fetch(resource.driver, resource.key, params);
			} else {
				return Promise.resolve();
			}
    }
	};

	manager.subKeys = resource.child_key && resource.child_key.split("/") || [];
	manager.input = [].concat(args.inputBuffer || [], args.path || [], resource.key || [], manager.subKeys);
	manager.output = [].concat(args.outputBuffer || [], args.path || [], resource.key || [], manager.subKeys);
	manager.id = [].concat(resource.driver || [], args.path && args.path.split("/") || [], resource.key || [], manager.subKeys).join("-");

	return manager;
}
