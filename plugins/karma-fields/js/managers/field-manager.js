
KarmaFields.managers.field = function(resource, path, history, selection, parent) {
	var manager = {
		resource: resource,
		// post: post,
		parent: parent,
		history: history,
		children: [],

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
		build: function() {
			return {
				class: "karma-field " + (resource.field || resource.name || "group") + " display-"+(resource.display || "block"),
				init: function(element, update) {
					if (resource.class) {
						element.classList.add(resource.class);
					}
				},
				children: [
					resource.label && {
						tag: "label",
						init: function(label) {
							if (manager.id) {
								label.htmlFor = manager.id;
							}
							label.innerText = resource.label;
						}
					},
					{
						class: "karma-field-content",
						child: KarmaFields.fields[resource.field || resource.name || "group"](manager)
					}
				]
			};
		},
		createChild: function(resource) {
			var childPath = path.slice();
			if (resource.child_key) {
				childPath.push(resource.child_key);
			} else if (resource.key) {
				childPath[childPath.length-1] = resource.key;
			}
			var child = KarmaFields.managers.field(resource, childPath, history, selection, this);
			this.children.push(child);
			return child;
		},
		// getChildren: function() {
		// 	return (resource.children || []).map(function(resource) {
		// 		return KarmaFields.managers.field(resource, post, middleware, history, manager);
		// 	});
		// },
		getId: function() {
			return path.join("-").split("/").join("-");
			// if (resource.key) {
			// 	return (resource.driver || middleware || "general") + "-" + (post.uri || post.pseudo_uri || "").split("/").join("-") + "-" + resource.key;
			// } else if (parent) {
			// 	return parent.getId() + "-" + (resource.child_key || "group");
			// }
		},
		// getKey: function() {
		// 	if (resource.key) {
		// 		return resource.key;
		// 	} else if (parent) {
		// 		return parent.getKey();
		// 	}
		// },
		// for external use
		// bubble: function(key, value, field) {
		// 	//
		// 	// if (this.onBubble) {
		// 	// 	this.onBubble(key, value);
		// 	//
		// 	// } else if (parent) {
		// 	// 	parent.value[resource.child_key] = value;
		// 	// 	parent.bubble(key, value);
		// 	// }
		//
		// 	if (this.onBubble) {
		// 		this.onBubble(key, value, field || this); // used in table options (update manager option and detect changes for submit button)
		// 	}
		//
		// 	if (parent) {
		// 		parent.bubble(key, value, field || this);
		// 	} else {
		// 		if (!this.state) {
		// 			this.state = {};
		// 		}
		// 		this.state[key] = value;
		// 		if (this.onUpdateState) {
		// 			this.onUpdateState(this.state); // used for fields in classic layout
		// 		}
		//
		// 	}
		// },
		// submit: function() {
		// 	if (parent) {
		// 		parent.submit();
		// 	} else {
		// 		if (this.onSubmit) {
		// 			this.onSubmit();
		// 		}
		// 	}
		// },
		//
		// filter: function(filters) {
		// 	if (parent) {
		// 		parent.filter(filters);
		// 	}
		// 	if (this.onFilter) {
		// 		this.onFilter(filters);
		// 	}
		// },
		//
		//
		//
		//
		// // get: function(defaultValue) {
		// // 	if (resource.key) {
		// // 		if (this.value === undefined) {
		// // 			return defaultValue;
		// // 		}
		// // 		return JSON.parse(this.value);
		// // 	} else if (this.parent) {
		// // 		var value = this.parent.get() || {};
		// // 		if (resource.child_key) {
		// // 			return value[resource.child_key];
		// // 		} else {
		// // 			return value;
		// // 		}
		// // 	}
		// // },
		//
		// // getValue: function() {
		// // 	if (this.children) {
		// // 		this.children.forEach(function(child) {
		// // 			if () {}
		// // 		});
		// // 		return this.children.reduce(function(object, item), {
		// // 			object[child.child_key] = child.getValue();
		// // 		}, this.value || {});
		// // 	} else {
		// // 		return this.value;
		// // 	}
		// // },
		//
		//
		//
		// get: function() {
		// 	if (resource.key) {
		// 		return this.value;
		// 	} else if (this.parent) {
		// 		var value = this.parent.get() || {};
		// 		if (resource.child_key) {
		// 			return value[resource.child_key];
		// 		} else {
		// 			return value;
		// 		}
		// 	}
		// },
		// // set: function(value) {
		// // 	if (value === "undefined") {
		// // 		return Promise.reject("cannot set undefined value");
		// // 	}
		// // 	this.wasModified = this.isModified;
		// // 	this.isModified = value !== this.getOriginal();
		// // 	if (this.isModified != this.wasModified && this.onModify) {
		// // 		this.onModify(this.isModified);
		// // 	}
		// // 	if (resource.key) {
		// // 		var encodedValue = JSON.stringify(value);
		// // 		if (encodedValue !== this.value) {
		// // 			this.prevValue = this.value;
		// // 			this.value = encodedValue;
		// // 			this.updateState(resource.key, value); // for external use
		// // 		}
		// // 		return Promise.resolve();
		// // 	} else if (this.parent) {
		// // 		var parentValue = this.parent.get() || {};
		// // 		if (resource.child_key) {
		// // 			// if (value === parentValue[resource.child_key]) { // do not update parent if value is the same
		// // 			// 	return Promise.resolve();
		// // 			// }
		// // 			parentValue[resource.child_key] = value;
		// // 		}
		// // 		return this.parent.set(parentValue);
		// // 	} else {
		// // 		return Promise.reject("field has no key or no parent");
		// // 	}
		// // },
		//
		// // set: function(value) {
		// // 	if (resource.key) {
		// // 		var json = JSON.stringify(value);
		// // 		if (json !== this.json) {
		// // 			this.json = json;
		// // 			this.value = value;
		// // 			this.bubble(resource.key, value);
		// // 			this.save();
		// // 		}
		// // 		if (this.originalJson === undefined) {
		// // 			this.originalJson = json;
		// // 		}
		// // 		if (this.originalValue === undefined) {
		// // 			this.originalValue = value;
		// // 		}
		// // 		var isModified = json !== this.originalJson;
		// // 		if (isModified !== this.isModified && this.onModify) {
		// // 			this.onModify(isModified);
		// // 		}
		// // 		this.isModified = isModified;
		// // 	} else if (this.parent) {
		// // 		var parentValue = this.parent.get() || {};
		// // 		if (resource.child_key) {
		// // 			var parentOriginal = this.parent.getOriginal() || {};
		// // 			if (parentOriginal[value] !== value && this.onModify) {
		// // 				this.onModify(parentValue[resource.child_key] === value);
		// // 			}
		// // 			parentValue[resource.child_key] = value;
		// // 		}
		// // 		this.parent.set(parentValue);
		// // 	}
		// // },
		//
		//
		//
		//
		//
		//
		// isModified: function(value) {
		// 	if (typeof value === "object") {
		// 		return JSON.stringify(value) !== JSON.stringify(this.getOriginal());
		// 	} else {
		// 		return value !== this.getOriginal();
		// 	}
		// },
		// isDifferent: function(value) {
		// 	if (typeof value === "object") {
		// 		return JSON.stringify(value) !== JSON.stringify(this.get());
		// 	} else {
		// 		return value !== this.get();
		// 	}
		// },
		// // set: function(value) {
		// // 	if (typeof value === "object") {
		// // 		var json = JSON.stringify(value);
		// // 		if (json !== JSON.stringify(this.get())) {
		// // 			this.changeValue(value, json !== JSON.stringify(this.getOriginal()), history && history.index);
		// // 		}
		// // 	} else {
		// // 		if (value !== this.get()) {
		// // 			this.changeValue(value, value !== this.getOriginal(), history && history.index);
		// // 		}
		// // 	}
		// // },
		// set: function(value) {
		// 	if (this.isDifferent(value)) {
		// 		this.changeValue(value); //, this.isModified(value));
		// 	}
		// },
		// // set: function(value) {
		// // 	var isDifferent;
		// // 	var isModified;
		// // 	if (typeof value === "object") {
		// // 		var json = JSON.stringify(value));
		// // 		isDifferent = json !== JSON.stringify(this.get());
		// // 		isModified = json !== JSON.stringify(this.getOriginal());
		// // 	} else {
		// // 		isDifferent = value !== this.get();
		// // 		isModified = value !== this.getOriginal();
		// // 	}
		// // 	if (isDifferent) {
		// // 		this.changeValue(value);
		// // 		if (isModified !== this.isModified && this.onSave) { // if this.isModified is undefined -> no care!
		// // 			this.onSave(); // -> render footer
		// // 		}
		// // 		this.isModified = isModified;
		// // 	}
		// // },
		//
		//
		//
		// changeValue: function(value) {
		//
		// 	var modified = this.isModified(value);
		//
		//
		//
		// 	if (resource.key) {
		//
		// 		if (modified) {
		// 			this.value = value;
		// 		} else {
		// 			this.value = undefined;
		// 		}
		//
		// 		if (modified !== this.modified && this.onSave) { // if this.isModified is undefined -> no care!
		// 			this.onSave(); // -> render footer
		// 		}
		//
		// 		this.modified = modified;
		//
		// 		if (this.onChangeValue) {
		// 			this.onChangeValue(this.value); // -> tableManager.addChanges()
		// 		}
		//
		// 		this.bubble(resource.key, value); //
		//
		// 		if (history) {
		// 			history.pool.set(this.post.uri || this.post.pseudo_uri, resource.key, history.index, this.value);
		// 		}
		//
		// 	} else if (this.parent) {
		// 		var parentValue = this.parent.get() || {};
		// 		if (resource.child_key) {
		// 			parentValue[resource.child_key] = value || undefined;
		// 		} else {
		// 			parentValue = value;
		// 		}
		// 		this.parent.changeValue(parentValue);
		// 	}
		// 	if (this.onModify) {
		// 		this.onModify(modified);
		// 	}
		// },
		// changeOthers: function(value) {
		// 	if (this.onChangeOthers) {
		// 		this.onChangeOthers(value);
		// 	}
		// },

		// save: function() {
		// 	// if (this.get() !== this.getPrevious()) { // ! not working with objects...
		// 		if (resource.key) {
		// 			if (this.value !== this.prevValue) {
		// 				history.set(this.post.uri || this.post.pseudo_uri, resource.key, this.value);
		// 				if (this.isModified != this.wasModified && this.onSave) {
		// 					this.onSave(); // -> render footer
		// 				}
		// 			}
		// 		} else if (parent) {
		// 			parent.save();
		// 		}
		// 	// }
		// },
		// save: function() {
		// 	if (resource.key) {
		// 		history.set(this.post.uri || this.post.pseudo_uri, resource.key, this.value);
		// 	} else if (parent) {
		// 		parent.save();
		// 	}
		// },
		// getPrevious: function() {
		// 	if (resource.key) {
		// 		if (this.prevValue === undefined) {
		// 			return undefined;
		// 		}
		// 		return JSON.parse(this.prevValue);
		// 	} else if (parent) {
		// 		var previous = parent.getPrevious();
		// 		if (previous && resource.child_key) {
		// 			return previous[resource.child_key];
		// 		} else {
		// 			return previous;
		// 		}
		// 	}
		// },
		// getOriginal: function() {
		// 	if (resource.key) {
		// 		if (this.originalValue === undefined) {
		// 			return undefined;
		// 		}
		// 		return JSON.parse(this.originalValue);
		// 	} else if (parent) {
		// 		var original = parent.getOriginal();
		// 		if (original && resource.child_key) {
		// 			return original[resource.child_key];
		// 		} else {
		// 			return original;
		// 		}
		// 	}
		// },
		// getOriginal: function() {
		// 	if (resource.key) {
		// 		// if (this.isObject) {
		// 		// 	return JSON.parse(this.originalValue);
		// 		// } else {
		// 		//
		// 		// }
		// 		return this.originalValue;
		// 	} else if (parent) {
		// 		var original = parent.getOriginal();
		// 		if (original && resource.child_key) {
		// 			return original[resource.child_key] || "";
		// 		} else {
		// 			return original;
		// 		}
		// 	}
		// },
		// setOriginalValue: function(value) {
		// 	if (resource.key) {
		// 		if (typeof value === "object") {
		// 			this.originalValue = JSON.parse(JSON.stringify(value));
		// 		} else {
		// 			this.originalValue = value || "";
		// 		}
		// 	}
		// },
		// isModified: function(value) {
		// 	if (resource.key) {
		// 		if (this.originalValue === undefined) {
		// 			this.originalValue = value;
		// 		}
		// 		return value === this.originalValue;
		// 	} else if (parent) {
		// 		var parentValue =
		// 	}
		//
		// 	value === this.getOriginal()
		// },

		// update: function() {
		// 	if (resource.key) {
		// 		var uri = this.post.uri || this.post.pseudo_uri;
		// 		var value = history.pool.get(uri, resource.key, history.index);
		//
		// 		if (this.isDifferent(value)) {
		// 			var modified = this.isModified(value);
		// 			if (modified) {
		// 				this.value = value;
		// 			} else {
		// 				this.value = undefined;
		// 			}
		//
		//
		// 			if (this.onChangeValue) {
		// 				this.onChangeValue(this.value); // -> tableManager.addChanges()
		// 			}
		//
		// 			this.bubble(resource.key, value);
		// 			if (modified !== this.modified && this.onSave) { // if this.isModified is undefined -> no care!
		// 				this.onSave(); // -> render footer
		// 			}
		// 			this.modified = modified;
		// 			if (this.onUpdate) {
		// 				this.onUpdate(value);
		// 			}
		// 		}
		// 	} else if (this.onUpdate) {
		// 		this.onUpdate(this.get());
		// 	}
		// },
		// remove: function() {
		// 	if (manager.onRemove) {
		// 		manager.onRemove();
		// 	}
		// },
		// fetch: function(defaultValue) {
		//
		//
		// 	if (resource.key) {
		// 		var historyIndex = history.index;
		// 		var dbIndex = history.dbIndex;
		// 		var uri = this.post.uri || this.post.pseudo_uri;
		// 		var cacheValue = history.get(uri, resource.key);
		//
		//
		//
		// 		if (cacheValue) {
		// 			var value = JSON.parse(cacheValue);
		// 			// this.originalValue = undefined; //history.pool.get(history.dbIndex, uri, resource.key);
		// 			// this.set(value);
		// 			// if (this.onUpdate) {
		// 			// 	this.onUpdate(value);
		// 			// }
		// 			return Promise.resolve(value); //.then(this.onUpdate);
		// 		} else if (this.post[resource.key] !== undefined) {
		// 			var value = this.post[resource.key];
		// 			cacheValue = JSON.stringify(value);
		// 			this.originalValue = cacheValue;
		// 			// this.set(value);
		// 			history.pool.set(historyIndex, uri, resource.key, cacheValue);
		// 			// if (this.onUpdate) {
		// 			// 	this.onUpdate(value);
		// 			// }
		// 			return Promise.resolve(value); //.then(this.update);
		// 		} else if (this.post.uri) {
		// 			if (!this.promise) {
		// 				var path;
		// 				if (KarmaFields.cacheURL && resource.cache) {
		// 					path = KarmaFields.cacheURL+"/"+middleware+"/"+this.post.uri+"/"+resource.cache;
		// 				} else {
		// 					path = KarmaFields.getURL+"/"+middleware+"/"+this.post.uri+"/"+resource.key;
		// 				}
		// 				// this.promise =
		// 				return this.query(path).then(function(value) {
		// 					if (value === undefined) {
		// 						console.error("queried value must never be undefined");
		// 					}
		// 					// if (!value && resource.default) {
		// 					// 	value = resource.default;
		// 					// }
		// 					cacheValue = JSON.stringify(value);
		// 					manager.originalValue = cacheValue;
		// 					// manager.set(value);
		// 					history.pool.set(uri, resource.key, historyIndex, cacheValue);
		// 					// console.log(value, manager.value);
		// 					// if (manager.onUpdate) {
		// 					// 	manager.onUpdate(value);
		// 					// }
		// 					return value;
		// 				}); //.then(this.onUpdate);
		// 			}
		// 			// return this.promise;
		// 			// return this.query(path).then(function(value) {
		// 			// 	manager.originalValue = value;
		// 			// 	manager.set(value);
		// 			// 	history.pool.set(historyIndex, uri, resource.key, value);
		// 			// 	return value;
		// 			// });
		// 		} else { // -> item was added
		// 			var value = resource.default || ""; // -> must not be undefined
		// 			this.originalValue = null;
		// 			// this.set(value);
		// 			// if (this.onUpdate) {
		// 			// 	this.onUpdate(value);
		// 			// }
		// 			return Promise.resolve(value); //.then(this.onUpdate);
		// 		}
		// 	} else if (parent) {
		// 		return parent.fetch().then(function(parentValue) {
		// 			if (parentValue && resource.child_key) {
		// 				return parentValue[resource.child_key];
		// 			}
		// 			return parentValue;
		// 		});
		// 	} else {
		// 		return Promise.resolve();
		// 		// return Promise.reject("field has no key and no parent");
		// 	}
		// },

		// fetch: function() {
		//
		//
		// 	if (!this.promise) {
		// 		if (resource.key) {
		// 			var historyIndex;
		// 			var initialIndex;
		// 			var currentValue;
		// 			var initialValue;
		// 			var uri = this.post.uri || this.post.pseudo_uri;
		// 			if (history) {
		// 				historyIndex = history.index;
		// 				initialIndex = history.initialIndex;
		// 				currentValue = history.pool.get(uri, resource.key, history.index);
		// 				initialValue = history.pool.get(uri, resource.key, history.initialIndex);
		// 			}
		//
		// 			if (initialValue !== undefined) {
		// 				this.setOriginalValue(initialValue);
		// 			}
		//
		// 			if (currentValue !== undefined) {
		// 				// this.originalValue = initialValue;
		//
		// 				this.value = currentValue;
		// 				this.bubble(resource.key, currentValue);
		// 				this.modified = false;
		//
		// 				if (manager.onFetch) {
		// 					currentValue = manager.onFetch(currentValue);
		// 				}
		// 				this.promise = Promise.resolve(currentValue);
		// 			} else if (this.post[resource.key] !== undefined) {
		//
		// 				// this.originalValue = this.post[resource.key];
		// 				// this.originalValueJson = JSON.stringify(this.post[resource.key]);
		// 				this.setOriginalValue(this.post[resource.key]);
		//
		//
		// 				if (currentValue === undefined) {
		// 					currentValue = this.post[resource.key];
		// 				}
		//
		// 				this.value = currentValue;
		// 				this.bubble(resource.key, currentValue);
		// 				this.modified = false;
		// 				if (this.onFetch) {
		// 					currentValue = manager.onFetch(currentValue);
		// 				}
		// 				if (history) {
		// 					history.pool.set(uri, resource.key, initialIndex, currentValue);
		// 				}
		// 				this.promise = Promise.resolve(currentValue);
		// 			} else if (this.post.uri && (resource.driver || middleware)) {
		// 				var path;
		// 				if (KarmaFields.cacheURL && resource.cache) {
		// 					path = KarmaFields.cacheURL+"/"+(resource.driver || middleware)+"/"+this.post.uri+"/"+resource.cache;
		// 				} else {
		// 					path = KarmaFields.getURL+"/"+(resource.driver || middleware)+"/"+this.post.uri+"/"+resource.method+"/"+resource.key;
		// 				}
		// 				this.promise = this.query(path).then(function(value) {
		// 					// manager.originalValue = value;
		// 					manager.setOriginalValue(value);
		//
		// 					if (currentValue === undefined) {
		// 						currentValue = manager.getDefault && manager.getDefault(value) || value || resource.default;
		// 					}
		// 					if (manager.onFetch) {
		// 						currentValue = manager.onFetch(currentValue);
		// 					}
		// 					history.pool.set(uri, resource.key, initialIndex, currentValue);
		// 					if (manager.value === undefined) {
		// 						manager.value = currentValue;
		// 						manager.bubble(resource.key, currentValue);
		// 						manager.modified = false;
		// 					} else if (manager.isDifferent(currentValue)) {
		// 						manager.modified = true;
		// 						if (manager.onModify) {
		// 							manager.onModify(true);
		// 						}
		// 					}
		// 					return value;
		// 				});
		// 			} else { // -> item was added
		// 				// this.originalValue = null;
		// 				if (resource.default === undefined) {
		// 					var path = KarmaFields.defaultURL+"/"+(resource.driver || middleware)+"/"+resource.method+"/"+resource.key;
		// 					if (this.table) {
		// 						var params = [];
		// 						for (var key in this.table.filters) {
		// 							if (this.table.filters[key]) {
		// 								params.push(key+"="+this.table.filters[key]);
		// 							}
		// 						}
		// 						if (params.length) {
		// 							path += "?"+params.join("&");
		// 						}
		// 					}
		// 					this.promise = this.query(path).then(function(value) {
		// 						manager.setOriginalValue(value);
		// 						history.pool.set(uri, resource.key, initialIndex, value);
		//
		// 						manager.value = value;
		// 						manager.bubble(resource.key, value);
		// 						manager.modified = false;
		//
		// 						if (manager.onChangeValue) {
		// 							manager.onChangeValue(value); // -> tableManager.addChanges()
		// 						}
		//
		// 						return value;
		// 					});
		// 				} else if (resource.default) {
		// 					this.setOriginalValue(resource.default);
		// 					manager.value = resource.default;
		// 					manager.bubble(resource.key, resource.default);
		// 					manager.modified = false;
		// 					if (this.onChangeValue) {
		// 						this.onChangeValue(resource.default); // -> tableManager.addChanges()
		// 					}
		// 					this.promise = Promise.resolve(resource.default);
		// 				} else {
		// 					this.promise = Promise.resolve();
		// 				}
		// 			}
		// 		} else if (parent) {
		// 			return parent.fetch().then(function(parentValue) {
		// 				if (parentValue && resource.child_key) {
		// 					return parentValue[resource.child_key];
		// 				}
		// 				return parentValue;
		// 			});
		// 		} else {
		// 			this.promise = Promise.resolve();
		// 		}
		// 	}
		// 	return this.promise;
		// },
		// getPath: function() {
		// 	if (resource.key) {
		// 		return resource.key;
		// 	} else if (parent) {
		// 		var path = parent.getPath();
		// 		if (resource.child_key) {
		// 			path += "/"+resource.child_key;
		// 		}
		// 		return path;
		// 	}
		// },

		getValue: function(value) {
			return history.read(path);
		},
		setValue: function(value, buffer) {
			history.write(path, value, buffer || "output");
			if (selection && selection.onEditCell) {
				selection.onEditCell(path, value, buffer || "output");
			}
		},
		isModified: function() {
			return false;
		},
		// fetch: function() {
		// 	if (resource.key) {
		// 		if (this.promise) {
		// 			return this.promise;
		// 		} else {
		// 			var value = history.getValue("field", post.uri, resource.key);
		// 			if (value !== undefined) {
		// 				return Promise.resolve(value);
		// 			} else if (post[resource.key] !== undefined) {
		// 				history.edit("field", post.uri, resource.key, post[resource.key], true);
		// 				return Promise.resolve(post[resource.key]);
		// 			} else {
		// 				var file;
		// 				if (resource.cache && KarmaFields.cacheURL) {
		// 					file = KarmaFields.cacheURL+"/"+history.driver+"/"+uri+"/"+cache;
		// 				} else {
		// 					file = KarmaFields.getURL+"/"+history.driver+"/"+uri+"/"+resource.method+"/"+resource.key;
		// 				}
		// 				this.promise = fetch(file, {
		// 					cache: "reload"
		// 				}).then(function(response) {
		// 					if (!resource.cache || resource.cache.slice(-5) === ".json") {
		// 						return response.json();
		// 					} else {
		// 						return response.text();
		// 					}
		// 				}).then(function(value) {
		// 					history.edit("field", post.uri, resource.key, value, true);
		// 				});
		// 				return this.promise;
		// 			}
		// 		}
		// 	} else if (parent) {
		// 		return parent.fetch().then(function(parentValue) {
		// 			if (parentValue && resource.child_key) {
		// 				return parentValue[resource.child_key];
		// 			}
		// 			return parentValue;
		// 		});
		// 	} else {
		// 		return Promise.resolve();
		// 	}
		// },

		// fetch: function() {
		// 	var path = this.getPath();
		// 	var value = history.getValue("field", post.uri, resource.key, path);
		// 	if (value !== undefined) {
		// 		return Promise.resolve(value);
		// 	} else {
		// 		if (resource.key) {
		// 			this.promise = this.fetchKey(resource.key, resource.method);
		// 			// if (post[resource.key] !== undefined) {
		// 			// 	history.edit("field", post.uri, resource.key, post[resource.key], true);
		// 			// 	return Promise.resolve(post[resource.key]);
		// 			// } else {
		// 			// 	var file;
		// 			// 	if (resource.cache && KarmaFields.cacheURL) {
		// 			// 		file = KarmaFields.cacheURL+"/"+history.driver+"/"+uri+"/"+cache;
		// 			// 	} else {
		// 			// 		file = KarmaFields.getURL+"/"+history.driver+"/"+uri+"/"+resource.method+"/"+resource.key;
		// 			// 	}
		// 			// 	this.promise = fetch(file, {
		// 			// 		cache: "reload"
		// 			// 	}).then(function(response) {
		// 			// 		if (!resource.cache || resource.cache.slice(-5) === ".json") {
		// 			// 			return response.json();
		// 			// 		} else {
		// 			// 			return response.text();
		// 			// 		}
		// 			// 	}).then(function(value) {
		// 			// 		history.edit("field", post.uri, resource.key, value, true);
		// 			// 	});
		// 			// 	return this.promise;
		// 			// }
		// 		} else if (parent) {
		// 			return parent.fetch().then(function(value) {
		// 				if (value && resource.child_key) {
		// 					return value[resource.child_key]
		// 				}
		// 				return value;
		// 			})
		// 		} else {
		// 			return Promise.resolve();
		// 		}
		// 	}
		// },

		fetchValue: function() {
			var value = history.read(path);
			if (value !== undefined) {
				return Promise.resolve(value);
			} else {
				return this.fetch().then(function(value) {
					if (value !== undefined) {
						history.write(path, value, "input");
					}
				});
			}
		},
		fetch: function() {
			if (!this.promise) {
				if (resource.key) {
					this.promise = this.fetchKey(path, resource.method, resource.cache);
				} else if (parent) {
					this.promise = parent.fetch().then(function(value) {
						if (value && resource.child_key) {
							return value[resource.child_key]
						}
						return value;
					});
				} else {
					this.promise = Promise.resolve();
				}
			}
			return this.promise;
		},
		fetchKey: function(keys, method, cache) {
			var file;
			if (cache && KarmaFields.cacheURL) {
				file = KarmaFields.cacheURL+"/"+keys.join("/")+cache;
			} else {
				file = KarmaFields.getURL+"/"+keys.join("/")+"/"+(method||"default");
			}
			return fetch(file, {
				cache: "reload"
			}).then(function(response) {
				if (!cache || cache.slice(-5) === ".json") {
					return response.json();
				} else {
					return response.text();
				}
			});
		},

		// getValue: function() {
		// 	if (!this.promise) {
		// 		if (resource.key) {
		// 			this.promise = history.fetch(post, resource.key, resource.cache, resource.default_value);
		// 		} else if (parent) {
		// 			this.promise = parent.fetch().then(function(parentValue) {
		// 				if (parentValue && resource.child_key) {
		// 					return parentValue[resource.child_key];
		// 				}
		// 				return parentValue;
		// 			});
		// 		} else {
		// 			this.promise = Promise.resolve();
		// 		}
		// 		this.promise.then(function(value) {
		// 			if (manager.onUpdate) {
		// 				manager.onUpdate(value);
		// 			}
		// 		});
		// 	}
		// 	return this.promise;
		// },
		// getOriginalValue: function() {
		// 	if (resource.key) {
		// 		this.originalValue = history.fetch(post, resource.key, resource.cache, resource.default_value);
		// 		return this.originalValue;
		// 	} else if (parent) {
		// 		var original = parent.getOriginal();
		// 		if (original && resource.child_key) {
		// 			return original[resource.child_key] || "";
		// 		} else {
		// 			return original;
		// 		}
		// 	}
		// },

		// fetch: function() {
		// 	if (resource.key) {
		// 		var value = this.post[resource.key];
		// 		if (value !== undefined) {
		// 			this.value = value;
		// 			this.originalValue = value;
		// 			return Promise.resolve(value);
		// 		} else {
		// 			var historyIndex = history.index;
		// 			var dbIndex = history.dbIndex;
		// 			var uri = this.post.uri || this.post.pseudo_uri;
		// 			value = history.get(uri, resource.key);
		// 			if (value !== undefined) {
		// 				this.value = value;
		// 				this.originalValue = history.pool.get(history.dbIndex, uri);
		// 				return Promise.resolve(value);
		// 			} else if (this.post.uri) {
		// 				var path = middleware+"/"+this.post.uri+"/"+resource.key;
		// 				return this.query(path).then(function(value) {
		// 					manager.value = value;
		// 					manager.originalValue = value;
		// 					history.pool.set(historyIndex, uri, resource.key, value);
		// 					return value;
		// 				});
		// 			} else {
		// 				return Promise.reject("post uri not found");
		// 			}
		// 		}
		// 	} else if (parent) {
		// 		return parent.fetch().then(function(parentValue) {
		// 			if (parentValue && resource.child_key) {
		// 				return parentValue[resource.child_key];
		// 			}
		// 			return parentValue;
		// 		});
		// 	} else {
		// 		return Promise.reject("field has no key and no parent");
		// 	}
		// },
		// updateInherit: function() {
		// 	this.fetchInherit().then(function(value) {
		// 		if (manager.onInherit) {
		// 			manager.onInherit()
		// 		}
		// 	});
		// },
		// fetchInherit: function() {
		// 	if (this.post.placeholder_uri) {
		// 		if (resource.key) {
		// 			var historyIndex = history.index;
		// 			var value = history.pool.get(this.post.placeholder_uri, resource.key, historyIndex);
		// 			if (value !== undefined) {
		// 				return Promise.resolve(value);
		// 			} else {
		// 				return this.query((resource.driver || middleware)+"/"+this.post.placeholder_uri+"/"+resource.key).then(function(value) {
		// 					history.pool.set(this.post.placeholder_uri, resource.key, historyIndex, value);
		// 					return value || resource.placeholder;
		// 				});
		// 			}
		// 		} else if (parent) {
		// 			return parent.fetchInherit().then(function(parentValue) {
		// 				if (parentValue && resource.child_key) {
		// 					return parentValue[resource.child_key] || resource.placeholder;
		// 				}
		// 				return parentValue;
		// 			});
		// 		}
		// 	}
		// 	return Promise.resolve(resource.placeholder);
		// },
		// query: function(file) {
		// 	return fetch(file, {
		// 		cache: "reload"
		// 	}).then(function(response) {
		// 		return response.json();
		// 		// if (type === "string") {
		// 		// 	return response.json();
		// 		// } else {
		// 		// 	return response.text();
		// 		// }
		//
		// 		// if (!resource.cache || resource.cache.slice(-5) === ".json") {
		// 		// 	return response.json();
		// 		// } else {
		// 		// 	return response.text();
		// 		// }
		// 	});
		// },
		fetchOptions: function(filters) {
			if (resource.key) {
				var path = KarmaFields.fetchURL+"/"+history.driver+"/"+resource.method+"/"+resource.key;
				var filters = history.read(["filters"]);
				var params = KarmaFields.Object.serialize(filters);
				if (params) {
					path += "?"+params;
				}
				if (!history.cache[path]) {
					history.cache[path] = fetch(path, {
						cache: "default" // force-cache
					}).then(function(response) {
						return response.json();
					});
				}
				return history.cache[path];
			} else {
				return Promise.resolve();
			}
    }
	};

	manager.id = manager.getId(); //middleware + "/" + (post.uri || post.pseudo_uri).split("/").join("-") + "-" + (resource.key || resource.child_key || "group");

	return manager;
}
