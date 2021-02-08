
KarmaFields.Field = function(resource) {
	let field = {
		directory: {},
		children: [],
		resource: resource || {},
		data: {},
		events: {},
		requests: {},

		getId: function() {
			let id = this.resource.key || "";
			if (this.parent) {
				id = this.parent.getId()+"-"+id;
			}
			return id;
		},
		// getAttribute: function(attr) {
		// 	if (this.resource[attr] !== undefined) {
		// 		return this.resource[attr];
		// 	} else if (this.parent) {
		// 		return this.parent.getAttribute(attr);
		// 	}
		// },
		add: function(child) {
			// let child = KarmaFields.Field();
			if (child.resource.key) {
				this.children.push(child);
				this.directory[child.resource.key] = child;
				child.parent = this;
			} else {
				console.error("No key!");
			}
		},
		createChild: function(resource) {
			let child = KarmaFields.Field(resource);
			this.add(child);
			return child;
		},
		findByKey: function(key) {
			return this.children.find(function(child) {
				return child.resource.key == key;
			})
		},
		// trigger: function(eventName, param) {
		// 	if (this.events[eventName]) {
		// 		this.events[eventName](param);
		// 	} else if (this.parent) {
		// 		this.parent.trigger(eventName, param);
		// 	}
		// },
		trigger: function(eventName, ...param) {
			if (this.events[eventName]) {
				this.events[eventName].call(this, ...param);
			} else if (this.parent) {
				this.parent.trigger.call(this, eventName, ...param);
			}
		},

		// fetch: function(request, param) {
		// 	if (this.onFetch) {
		// 		this.onFetch(request, param);
		// 	} else if (this.parent) {
		// 		this.parent.fetch(request, param);
		// 	}
		// },

		// request: function(request, param) {
		// 	if (this.requests[request]) {
		// 		this.requests[request](param);
		// 	} else if (this.parent) {
		// 		this.parent.request(request, param);
		// 	}
		// },

		// update: function(updater, param) {
		// 	this.children.forEach(function(child) {
		// 		if (child.resource.key) {
		// 			let childParam = child.update(updater, param[child.resource.key] || {});
		// 			if (childParam !== undefined) {
		// 				param[child.resource.key] = childParam;
		// 			}
		// 		} else {
		// 			param = child.update(updater, param);
		// 		}
		// 	});
		// 	return updater(this, param);
		// },

		// getValue: function() {
		// 	if (this.children) {
		// 		let value = {};
		// 		this.children.forEach(function(child) {
		// 			let childValue = child.getValue();
		// 			if (child.resource.key) {
		// 				value[child.resource.key] = childValue;
		// 			} else if (childValue && typeof childValue === "object") {
		// 				for (let i in childValue) {
		// 					value[i] = childValue[i];
		// 				}
		// 			}
		// 		});
		// 		return value;
		// 	}
		// 	return this.value;
		// },
		getModifiedValue: function() {
			let value;
			if (this.children.length) {
				this.children.forEach(function(child) {
					let childValue = child.getModifiedValue();
					if (childValue !== undefined && child.resource.key) {
						if (!value) {
							value = {};
						}
						value[child.resource.key] = childValue;
					}
				});
			} else {
				if (this.value !== this.originalValue) {
					return this.value;
				}
			}
			return value;
		},

		getValue: function() {
			let value;
			if (this.children.length) {
				value = {};
				this.children.forEach(function(child) {
					let childValue = child.getValue();
					if (childValue !== undefined && child.resource.key) {
						value[child.resource.key] = childValue;
					}
				});
			} else {
				value = this.value;
			}
			return value;
		},
		setValue: function(value, context) { // context = {'change' | 'set' | 'undo'}
			if (value !== this.lastValue) {
				this.lastValue = value;
				if (!context) {
					context = "change";
				}
				if (this.children.length) {
					this.children.forEach(function(child) {
						if (value && child.key && value[child.key] !== undefined) {
							child.setValue(value[child.key], context);
						}
						//  else if (context = "query") {
						// 	cell.queryValue();
						// }
					});
				} else {
					// if (this.value === undefined) {
					// 	this.originalValue = value;
					// }
					this.value = value;
					// this.isModified = this.value !== this.originalValue;
					this.trigger("update");
					// this.trigger(context);
					// if (context && this.resource.submit_mode === context) {
					// 	this.trigger("submit");
					// }
					if (context === "set") {
						this.originalValue = value;
						this.history.save();
						this.trigger("render");
					}
					if (context === "undo") {
						// this.trigger("render");
					}
					if (context === "change") {
						return this.trigger("change", this);
					}
				}
			}
		},


		// getFieldByPath: function(fields, path) {	// ! not used
		// 	let keys = path.split("/");
		// 	let key = keys.shift();
		// 	let child = fields.find(function(field) {
		// 		return field.resource.key === key;
		// 	});
		// 	if (child) {
		// 		return child.getFieldByPath(child.children, keys.join("/"));
		// 	}
		// },
		// find: function(path) {
		// 	let key = path.shift();
		// 	if (path.length === 0 && key === this.resource.key) {
		// 		return this;
		// 	} else {
		// 		let child = this.children.find(function(field) {
		// 			return field.resource.key === key;
		// 		});
		// 		if (child) {
		// 			return child.getFieldByPath(path);
		// 		}
		// 	}
		//
		// },
		// find: function(path) {
		// 	let key = path.shift();
		// 	for (let i = 0; i < this.children.length; i++) {
		// 		if (this.children[i].resource.key === key) {
		// 			if (path.length) {
		// 				return this.children[i].getFieldByPath(path);
		// 			} else {
		// 				return this.children[i];
		// 			}
		// 		}
		// 	});
		// },
		findByPath: function(path) {
			let key = path.shift();
			if (this.directory[key]) {
				return path.length && this.directory[key].getFieldByPath(path) || this.directory[key];
			}
		},
		get: function(path) {
			return this.findByPath(path.split("/"));
		},

		getPath: function() {
			let path = this.resource.key || "";
			if (this.parent) {
				path = this.parent.getPath()+"/"+path
			}
			return path;
		},
		getRoot: function() {
			if (this.parent) {
				return this.parent.getRoot();
			} else {
				return this;
			}
		},

		queryValue: function() {
			let path = this.getPath();
			this.data.loading = true;
			this.trigger("update");
			return KarmaFields.Transfer.get(path, [], [], this.resource.cache).then(function(value) {
				field.data.loading = false;
				field.setValue(value, "set");
				return value;
			});
		},

		// queryValue: function(path) {
		// 	if (!path) {
		// 		path = this.resource.key;
		// 	}
		// 	if (this.parent) {
		// 		if (this.parent.key) {
		// 			path = this.parent.key+"/"+path;
		// 		}
		// 		return this.parent.queryValue(path).then(function(value) {
		// 			return field.value;
		// 		});
		// 	} else {
		// 		return KarmaFields.Transfer.get(this.resource.key+"/"+path, [], [], this.resource.cache).then(function(value) {
		// 			let child = field.getFieldByPath(path);
		// 			if (child) {
		// 				child.setValue(value, "update");
		// 			}
		// 			return value;
		// 		});
		// 	}
		// },

		queryKey: function(key) {
			if (this.data.queryKey) {
				return this.data.queryKey(key || this.resource.key);
			} else if (this.parent) {
				return this.parent.queryKey(key || this.resource.key);
			} else {
				return Promise.reject();
			}
			// let root = this.getRoot();
			// KarmaFields.Transfer.fetch(root.resource.key, this.resource.key, root.data)
    },




		// getModifications: function() {
		// 	let modifications = {};
		// 	if (this.children.length) {
		// 		this.children.forEach(function(child) {
		// 			let childModifications = child.getModifications();
		// 			for (var i in childModifications) {
		// 				modifications[i] = childModifications[i];
		// 			}
		// 		});
		// 	} else if (this.value !== this.originalValue) {
		// 		let path = this.getPath();
		// 		modifications[path] = this.value;
		// 		this.originalValue = this.value;
		// 	}
		// 	return modification;
		// },

		// getModifications: function(modifications) {
		// 	if (!modifications) {
		// 		modifications = {};
		// 	}
		// 	let modifications = {};
		// 	if (this.children.length) {
		// 		this.children.forEach(function(child) {
		// 			let childModifications = child.getModifications();
		// 			if (childModifications) {
		//
		// 			}
		//
		//
		// 			for (var i in childModifications) {
		// 				modifications[i] = childModifications[i];
		// 			}
		// 		});
		// 	} else if (this.value !== this.originalValue) {
		// 		let path = this.getPath();
		// 		modifications[path] = this.value;
		// 		this.originalValue = this.value;
		// 	}
		// 	return modification;
		// },

		// sync: function() {
		// 	// let root = this.getRoot();
		// 	let modif = this.getValue(function(value, field) {
		// 		if (value !== field.originalValue) {
		// 			field.originalValue = value;
		// 			return value;
		// 		}
		// 	});
		// 	return KarmaFields.Transfer.update(root.resource.key, modif);
		// },
		// queryTable: function() {
		// 	return KarmaFields.Transfer.query(this.resource.key, data.header.getValue());
		// },


		history: {
			undos: {},
			save: function() {
				let index = KarmaFields.history.getIndex(field);
				this.undos[index] = field.value;
			},
			go: function(index) {
				if (this.undos[index]) {
					field.setValue(this.undos[index], "undo");
				}
				field.children.forEach(function(child) {
					child.history.go(index);
				});
			},
			// getMax: function(len) {
			// 	len = field.children.reduce(function(acc, child) {
			// 		acc = child.getMax(len);
			// 	}, len);
			// 	return Math.max(len, this);
			// },
			delete: function(index) {
				this.undos[index] = undefined;
				field.children.forEach(function(child) {
					child.history.delete(index);
				});
			}
			// clear: function(index) {
			// 	for (let i in this.undos) {
			// 		if (i >= index) {
			// 			this.undos[index] = undefined;
			// 		}
			// 	}
			// 	field.children.forEach(function(child) {
			// 		child.history.clear(index);
			// 	});
			// }
		}



		// undo: function(index) {
		// 	if (this.undos[index]) {
		// 		this.setValue(this.undos[index], "update"); // or "undo" ?
		// 	}
		// 	this.children.forEach(function(child) {
		// 		child.undo(index);
		// 	});
		//
		//
		// 	// if (!this.parent && this.undos[index] !== undefined) {
		// 	// 	let value = lodash.cloneDeep(this.undos[index]);
		// 	// 	this.setValue(value, "update");
		// 	// }
		// },
		// clearHistory: function(index) {
		// 	for (let i in this.undos) {
		// 		if (i >= index) {
		// 			this.undos[index] = undefined;
		// 		}
		// 	}
		// 	this.children.forEach(function(child) {
		// 		child.clearRedo(index);
		// 	});
		// }

	}
	field.value = field.resource.value;
	field.originalValue = field.resource.value;

	return field;
};

//
//
// KarmaFields.History = {};
// KarmaFields.History.createInstance = function(store) {
// 	var history = {};
//
// 	history.store = store || {};
// 	history.fields = {};
// 	history.lastFlux = "nav";
//
//
//
// 	history.empty = function(path) {
// 		KarmaFields.Object.setValue(this.store, path, null);
// 	};
// 	history.getValue = function(path) {
// 		return KarmaFields.Object.getValue(this.store, path);
// 	};
// 	history.setValue = function(path, value, under) {
// 		// console.trace();
// 		KarmaFields.Object.setValue(this.store, path, value, under);
// 	};
// 	history.isEmpty = function(path) {
// 		var value = this.getValue(path);
// 		return KarmaFields.Object.isEmpty(value);
// 	};
// 	history.clean = function(path) {
// 		var value = this.getValue(path);
// 		value = KarmaFields.Object.clean(value);
// 		KarmaFields.Object.setValue(path, value);
// 	};
// 	history.filter = function(buffer, path, callback) {
// 		var value = this.read(buffer, path);
// 		var clone = {};
// 		for (var i in value) {
// 			if (callback(value[i])) {
// 				clone[i] = value[i];
// 			}
// 		}
// 		this.write(buffer, path, clone);
// 	};
//
// 	history.removeUndos = function() {
// 		var index = this.getValue(["index"]) || 0;
// 		this.setValue(["max"], index);
// 	};
//
//
// 	history.write = function(buffer, path, value, flux) {
//
// 		// value = KarmaFields.Object.clone(value);
// 		// if (buffer !== "static" && buffer !== "input") {
// 		// 	var index = this.getValue(["index"]) || 0;
// 		// 	if (buffer === "output") {
// 		// 		// this.store.max = this.store.index;
// 		// 		this.setValue(["max"], index);
// 		// 	}
// 		// 	if (this.lastFlux !== flux && flux) {
// 		// 		if (!this.isEmpty(["undos", index])) {
// 		// 		// if (index === 0 || !this.contain(["input"], ["undos", index, "output"])) {
// 		// 			index++;
// 		//
// 		// 			this.setValue(["index"], index);
// 		// 			this.setValue(["max"], index);
// 		//
// 		//
// 		// 			// this.store.undos[this.store.index] = {};
// 		//
// 		// 			// console.log(this.store.index);
// 		// 		}
// 		// 		// this.store.undos[this.store.index] = {}
// 		// 		this.lastFlux = flux;
// 		// 	}
// 		//
// 		// 	// console.log(value, this.getValue(["input", ...path]));
// 		//
// 		// 	var prev = this.getValue(["undos", index-1]);
// 		//
// 		//
// 		//
// 		// 	if (prev) {
// 		// 		var reverseValue = this.read(buffer, path, null);
// 		//
// 		// 			console.log("prev", buffer, path, value, reverseValue);
// 		//
// 		// 		this.setValue(["undos", index-1, buffer, ...path], reverseValue, true);
// 		// 	}
// 		// 	this.setValue(["undos", index, buffer, ...path], KarmaFields.Object.clone(value));
// 		//
// 		//
// 		// 	// if (this.contain(["input"], ["undos", index, "output"])) {
// 		// 	//
// 		// 	// 	index = Math.max(0, index-1);
// 		// 	//
// 		// 	// 	this.setValue(["index"], index);
// 		// 	// 	this.setValue(["max"], index);
// 		// 	//
// 		// 	// 	this.lastFlux = "xx";
// 		// 	//
// 		// 	// }
// 		//
// 		//
// 		// }
// 		// KarmaFields.Object.setValue(this.store, [buffer, ...path], value);
//
//
// 		// console.log([buffer, ...path], value, KarmaFields.Object.clone(value));
//
// 		this.setValue([buffer, ...path], KarmaFields.Object.clone(value));
//
// 		// console.log(this.store.output);
//
// 	};
//
// 	history.save = function(path, value, flux, prevValue) {
// 		if (value !== undefined && value !== prevValue) {
// 			var index = this.getValue(["index"]) || 0;
// 			if (flux && this.lastFlux !== flux) {
// 				if (!this.isEmpty(["undos", index])) {
// 					index++;
// 					this.setValue(["undos", index], {});
// 					this.setValue(["index"], index);
// 					this.setValue(["max"], index);
// 				}
// 				this.lastFlux = flux;
// 			}
// 			if (index > 0) {
// 				this.setValue(["undos", index-1, ...path], prevValue, true);
// 			}
// 			this.setValue(["undos", index, ...path], KarmaFields.Object.clone(value));
// 		}
//
// 		this.setValue(path, KarmaFields.Object.clone(value));
//
// 		// console.log("save", path, value);
// 		// console.trace();
// 	};
//
// 	history.merge = function(buffer, path, value, underDeprecated) {
// 		if (value && typeof value === "object") {
// 			var object = this.getValue([buffer, ...path]);
// 			if (!object || typeof object !== "object") {
// 				object = {};
// 				this.setValue([buffer, ...path], object);
// 			}
// 			KarmaFields.Object.merge(object, value, underDeprecated);
// 		} else if (value !== undefined) {
// 			this.setValue([buffer, ...path], value, underDeprecated);
// 		}
// 	};
//
// 	history.read = function(buffer, path, defaultValue) {
//
// 		var value = this.getValue([buffer, ...path]);
// 		// if (value === undefined && buffer === "output") {
// 		// 	value = this.getValue(["input", ...path]);
// 		// }
// 		if (value === undefined) {
// 			return defaultValue;
// 		}
// 		return KarmaFields.Object.clone(value);
// 	};
//
// 	history.request = function(...paths) {
// 		var value;
// 		var i = 0;
// 		while (i < paths.length && value === undefined) {
// 			value = this.getValue(paths[i]);
// 			i++;
// 		}
// 		return KarmaFields.Object.clone(value);
// 	};
//
// 	history.undo = function(callback) {
// 		// if (this.hasUndo()) {
// 			// var temp =  this.store.undos[this.store.index];
// 			// this.store.undos[this.store.index] = this.store.undos[--this.store.index];
// 			// KarmaFields.Object.merge(this.store, temp);
// 			var index = this.getValue(["index"]);
// 			var prev = this.getValue(["undos", index-1]);
// 			if (prev) {
// 				// console.log("prev", prev);
// 				// prev = KarmaFields.Object.clone(prev);
// 				KarmaFields.Object.merge(this.store, prev);
//
// 				this.setValue(["index"], index-1);
// 			}
// 		// }
// 	};
// 	history.redo = function(callback) {
// 		// if (this.hasRedo()) {
// 			// var temp =  this.store.undos[this.store.index];
// 			// this.store.undos[this.store.index] = this.store.undos[++this.store.index];
// 			// KarmaFields.Object.merge(this.store, temp);
// 			var index = this.getValue(["index"]) || 0;
// 			// var current = this.getValue(["undos", index]);
// 			var next = this.getValue(["undos", index+1]);
//
// 			if (next) {
// 				// this.setValue(["undos", index+1], current);
// 				// this.setValue(["undos", index], next);
// 				// console.log("next", next);
// 				// next = KarmaFields.Object.clone(next);
//
// 				KarmaFields.Object.merge(this.store, next);
// 				this.setValue(["index"], index+1);
// 			}
// 		// }
// 	};
// 	history.hasUndo = function(callback) {
// 		var index = this.getValue(["index"]) || 0;
// 		var min = this.getValue(["min"]) || 0;
// 		return index > min;
// 	};
// 	history.hasRedo = function(callback) {
// 		var index = this.getValue(["index"]) || 0;
// 		var max = this.getValue(["max"]) || 0;
// 		return index < max;
// 	};
//
// 	history.diff = function(path1, path2) {
// 		var obj1 = this.getValue(path1) || {};
// 		var obj2 = this.getValue(path2) || {};
//
// 		// console.log(obj1, obj2);
// 		return KarmaFields.Object.diff(obj1, obj2);
// 	};
// 	history.isModified = function(buffer, path) {
// 		if (buffer === "output") {
// 			return !this.contain(["input", ...path], ["output", ...path]);
// 		}
// 	};
// 	history.contain = function(path1, path2) {
// 		var obj1 = this.getValue(path1) || {};
// 		var obj2 = this.getValue(path2) || {};
//
// 		// console.log(obj1, obj2, KarmaFields.Object.compare(obj1, obj2));
// 		// console.log("history.contain", path1, path2, obj1, obj2, KarmaFields.Object.contain(obj1, obj2));
// 		return KarmaFields.Object.compare(obj1, obj2);
// 	};
//
// 	history.createFieldManager = function(resource) {
// 		var manager = {
// 			resource: resource,
// 			history: history,
// 			events: {},
// 			data: {}, // -> store custom values for fields
// 			build: function() {
// 				if (manager.resource.label) {
// 					return [
// 						{
// 							tag: "label",
// 							init: function(label) {
// 								this.element.htmlFor = manager.getId();
// 								this.element.innerText = manager.resource.label;
// 							}
// 						},
// 						KarmaFields.fields[manager.resource.name || manager.resource.field || "group"](manager)
// 					];
// 				} else {
// 					return [
// 						KarmaFields.fields[manager.resource.name || manager.resource.field || "group"](manager)
// 					];
// 				}
// 			},
// 			buildSingle: function() {
// 				return KarmaFields.fields[manager.resource.name || manager.resource.field || "group"](manager);
// 			},
// 			createChild: function(resource) {
// 				var child = history.createFieldManager(resource);
// 				child.parent = this;
// 				// child.fieldId = child.path.join("-");
// 				return child;
// 			},
// 			trigger: function(eventName) {
// 				if (this.events[eventName]) {
// 					this.events[eventName]();
// 				} else if (this.parent) {
// 					this.parent.trigger(eventName);
// 				}
// 			},
// 			getAttribute: function(attr) {
// 				if (this[attr] !== undefined) {
// 					return this[attr];
// 				} else if (manager.resource[attr] !== undefined) {
// 					return manager.resource[attr];
// 				} else if (this.parent) {
// 					return this.parent.getAttribute(attr);
// 				}
// 			},
// 			getId: function() {
// 				var childKeys = this.getAttribute("child_keys") || [];
// 				return this.getFullPath().concat(childKeys).join("-");
// 			},
// 			getPath: function() {
// 				var path = [];
// 				var driver = this.getAttribute("driver");
// 				var uri = this.getAttribute("uri");
// 				var key = this.getAttribute("key");
// 				if (driver) {
// 					path.push(driver);
// 				}
// 				if (uri) {
// 					path.push(uri);
// 				}
// 				if (key) {
// 					path.push(key);
// 				}
// 				return path;
// 			},
// 			getFullPath: function(bufferName) {
// 				var path = [];
// 				var buffer = this.getAttribute(bufferName || "buffer");
// 				var driver = this.getAttribute("driver");
// 				var uri = this.getAttribute("uri");
// 				var key = this.getAttribute("key");
// 				if (buffer) {
// 					path.push(buffer);
// 				}
// 				if (driver) {
// 					path.push(driver);
// 				}
// 				if (uri) {
// 					path.push(uri);
// 				}
// 				if (key) {
// 					path.push(key);
// 				}
// 				return path;
// 			},
//
// 			getValue: function() {
// 				var buffer = this.getAttribute("buffer");
// 				var outputBuffer = this.getAttribute("outputBuffer");
// 				var path = this.getPath();
// 				var value;
// 				if (outputBuffer) {
// 					value = history.read(outputBuffer, path);
// 				}
// 				if (value === undefined && buffer) {
// 					value = history.read(buffer, path);
// 				}
// 				var childKeys = this.getAttribute("child_keys");
// 				if (childKeys && value && typeof value === "object") {
// 					value = KarmaFields.Object.getValue(value, childKeys);
// 				}
// 				return value;
// 			},
// 			setValue: function(value, context) {
// 				var id = this.getId();
//
// 				this.write(value, id);
//
// 				var multiedit = this.getAttribute("multiedit");
// 				var selection = this.getAttribute("selection");
//
// 				if (multiedit && selection) {
// 					selection.onMultiEdit(this, value, id);
// 				}
//
//
//
// 				this.trigger("update");
// 				this.trigger("modify");
// 				if (context && manager.resource.submit_mode === context) {
// 					this.trigger("submit");
// 				}
// 			},
// 			write: function(value, id) {
// 				var buffer = this.getAttribute("buffer");
// 				var outputBuffer = this.getAttribute("outputBuffer");
// 				var childKeys = this.getAttribute("child_keys");
// 				var path = this.getPath();
// 				var currentValue = history.request([outputBuffer, ...path], [buffer, ...path]);
//
// 				if (childKeys) {
// 					var parentValue = currentValue && KarmaFields.Object.clone(currentValue) || {};
// 					KarmaFields.Object.setValue(parentValue, childKeys, value);
//
// 					// console.log(parentValue);
// 					value = KarmaFields.Object.clean(parentValue);
// 				}
//
// 				if (outputBuffer) {
// 					history.removeUndos();
// 					history.save([outputBuffer, ...path], value, id, currentValue);
// 				} else {
// 					history.save([buffer, ...path], value, id, currentValue);
// 				}
//
//
// 			},
// 			isModified: function() {
// 				let buffer = this.getAttribute("buffer");
// 				let outputBuffer = this.getAttribute("outputBuffer");
// 				if (buffer && outputBuffer) {
// 					let path = this.getPath();
// 					let outputObj = history.getValue([outputBuffer, ...path]);
// 					if (outputObj !== undefined) {
// 						let inputObj = history.getValue([buffer, ...path]);
// 						return KarmaFields.Object.clean(outputObj) !== KarmaFields.Object.clean(inputObj);
// 					}
// 				}
// 				return false;
//
//
// 				// let obj1 = history.getValue([buffer, ...path]);
// 				// let obj2 = history.getValue([outputBuffer, ...path]);
// 				//
// 				// console.log(path, KarmaFields.Object.clean(obj1), KarmaFields.Object.clean(obj2));
// 				//
// 				// return buffer && outputBuffer && KarmaFields.Object.clean(history.getValue([buffer, ...path])) !== KarmaFields.Object.clean(history.getValue([outputBuffer, ...path]));
// 			},
// 			fetchValue: function(forceReload) {
// 				var childKeys = manager.getAttribute("child_keys");
// 				var value = this.getValue();
// 				if (!forceReload && value !== undefined) {
// 					return Promise.resolve(value);
// 				} else {
// 					var promise = this.getPromise();
// 					if (promise) {
// 						return promise.then(function(value) {
//
//
// 							if (childKeys) {
//
// 								return KarmaFields.Object.getValue(value, childKeys);
// 							}
//
// 							return value;
// 						});
// 					} else {
// 						if (manager.resource.default !== undefined) {
// 							// var outputBuffer = this.getAttribute("outputBuffer");
// 							manager.write(manager.resource.default);
// 						}
// 						return Promise.resolve(manager.resource.default);
// 					}
// 				}
// 			},
// 			getPromise: function() {
//
//
//
// 				if (manager.resource.key) {
// 					var driver = this.getAttribute("driver");
// 					var uri = this.getAttribute("uri");
//
// 					if (driver && uri) {
// 						if (!this.promise) {
// 							this.promise = KarmaFields.Transfer.get(driver, uri, manager.resource.key, manager.resource.cache).then(function(value) {
// 								// var buffer = manager.getAttribute("buffer");
// 								var path = manager.getFullPath();
//
// 								history.setValue(path, value);
//
// 								return value;
// 							});
// 						}
// 						return this.promise;
// 					}
// 				} else if (this.parent) {
// 					return this.parent.getPromise();
// 				}
// 			},
// 			fetchOptions: function(params) {
// 				var driver = this.getAttribute("fetch_driver") || this.getAttribute("driver");
// 				var key = this.getAttribute("fetch_key") || this.getAttribute("key");
// 				if (key && driver) {
// 					if (!params) {
// 						params = {};
// 					}
// 					params.filters = this.getAttribute("fetch_filters") || history.read("filters", []);
//
//
// 					return KarmaFields.Transfer.fetch(driver, key, params);
// 				} else {
// 					return Promise.resolve();
// 				}
// 	    },
// 			query: function(params) { // -> moved from table-manager
// 				var driver = this.getAttribute("query_driver") || this.getAttribute("driver");
// 				return KarmaFields.Transfer.query(driver, params);
// 			},
// 			sync: function(params) { // -> moved from table-manager
// 				var driver = this.getAttribute("sync_driver") || this.getAttribute("driver");
// 				return KarmaFields.Transfer.update(driver, params);
// 			},
// 			add: function(params) { // -> moved from table-manager
// 				var driver = this.getAttribute("sync_driver") || this.getAttribute("driver");
// 				var children = this.getAttribute("children") || [];
// 				params.fields = children.reduce(function(obj, child) {
// 					if (child.key && child.default !== undefined) {
// 						obj[child.key] = child.default;
// 					}
// 					return obj;
// 				}, {});
// 				return KarmaFields.Transfer.add(driver, params);
// 			}
// 		};
// 		return manager;
// 	};
//
//
// 	return history;
// };
