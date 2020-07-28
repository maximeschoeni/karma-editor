
KarmaFieldMedia.managers.field = function(resource, post, middleware, history, parent) {
	var manager = {
		resource: resource,
		post: post,
		parent: parent,
		history: history,

		// build: function() {
		// 	if (KarmaFieldMedia.fields[resource.field || resource.name || "group"]) {
		// 		this.element = KarmaFieldMedia.fields[resource.field || resource.name || "group"](this);
		// 		// this.init();
		// 		return this.element;
		// 	}
		// },
		// buildRaw: function() {
		// 	return KarmaFieldMedia.fields[resource.field || resource.name || "group"](manager);
		// },
		build: function() {
			return build({
				class: "karma-field " + (resource.field || resource.name || "group") + " display-"+(resource.display || "block"),
				init: function(element, update) {
					manager.render = update;
					update();
				},
				children: function() {
					return [
						resource.label && build({
							tag: "label",
							init: function(label) {
								if (manager.id) {
									label.htmlFor = manager.id;
								}
								label.innerText = resource.label;
							}
						}),
						build({
							class: "karma-field-content",
							child: function() {
								return KarmaFieldMedia.fields[resource.field || resource.name || "group"](manager);
							}
						})
					];
				}
			})
		},


		createChild: function(resource) {
			return KarmaFieldMedia.managers.field(resource, post, middleware, history, this);
		},
		getChildren: function() {
			return (resource.children || []).map(function(resource) {
				return KarmaFieldMedia.managers.field(resource, post, middleware, history, manager);
			});
		},
		getId: function() {
			if (resource.key) {
				return middleware + "-" + (post.uri || post.pseudo_uri).split("/").join("-") + "-" + resource.key;
			} else if (parent) {
				return parent.getId() + "-" + (resource.child_key || "group");
			}
		},
		// for external use
		bubble: function(key, value) {
			if (parent) {
				parent.bubble(key, value);
			} else {
				if (!this.state) {
					this.state = {};
				}
				this.state[key] = value;
				if (this.onUpdateState) {
					this.onUpdateState(this.state);
				}
			}
		},
		// get: function(defaultValue) {
		// 	if (resource.key) {
		// 		if (this.value === undefined) {
		// 			return defaultValue;
		// 		}
		// 		return JSON.parse(this.value);
		// 	} else if (this.parent) {
		// 		var value = this.parent.get() || {};
		// 		if (resource.child_key) {
		// 			return value[resource.child_key];
		// 		} else {
		// 			return value;
		// 		}
		// 	}
		// },
		get: function(defaultValue) {
			if (resource.key) {
				return this.value;
			} else if (this.parent) {
				var value = this.parent.get() || {};
				if (resource.child_key) {
					return value[resource.child_key];
				} else {
					return value;
				}
			}
		},
		// set: function(value) {
		// 	if (value === "undefined") {
		// 		return Promise.reject("cannot set undefined value");
		// 	}
		// 	this.wasModified = this.isModified;
		// 	this.isModified = value !== this.getOriginal();
		// 	if (this.isModified != this.wasModified && this.onModify) {
		// 		this.onModify(this.isModified);
		// 	}
		// 	if (resource.key) {
		// 		var encodedValue = JSON.stringify(value);
		// 		if (encodedValue !== this.value) {
		// 			this.prevValue = this.value;
		// 			this.value = encodedValue;
		// 			this.updateState(resource.key, value); // for external use
		// 		}
		// 		return Promise.resolve();
		// 	} else if (this.parent) {
		// 		var parentValue = this.parent.get() || {};
		// 		if (resource.child_key) {
		// 			// if (value === parentValue[resource.child_key]) { // do not update parent if value is the same
		// 			// 	return Promise.resolve();
		// 			// }
		// 			parentValue[resource.child_key] = value;
		// 		}
		// 		return this.parent.set(parentValue);
		// 	} else {
		// 		return Promise.reject("field has no key or no parent");
		// 	}
		// },

		// set: function(value) {
		// 	if (resource.key) {
		// 		var json = JSON.stringify(value);
		// 		if (json !== this.json) {
		// 			this.json = json;
		// 			this.value = value;
		// 			this.bubble(resource.key, value);
		// 			this.save();
		// 		}
		// 		if (this.originalJson === undefined) {
		// 			this.originalJson = json;
		// 		}
		// 		if (this.originalValue === undefined) {
		// 			this.originalValue = value;
		// 		}
		// 		var isModified = json !== this.originalJson;
		// 		if (isModified !== this.isModified && this.onModify) {
		// 			this.onModify(isModified);
		// 		}
		// 		this.isModified = isModified;
		// 	} else if (this.parent) {
		// 		var parentValue = this.parent.get() || {};
		// 		if (resource.child_key) {
		// 			var parentOriginal = this.parent.getOriginal() || {};
		// 			if (parentOriginal[value] !== value && this.onModify) {
		// 				this.onModify(parentValue[resource.child_key] === value);
		// 			}
		// 			parentValue[resource.child_key] = value;
		// 		}
		// 		this.parent.set(parentValue);
		// 	}
		// },
		isModified: function(value) {
			if (typeof value === "object") {
				return JSON.stringify(value) !== JSON.stringify(this.getOriginal());
			} else {
				return value !== this.getOriginal();
			}
		},
		isDifferent: function(value) {
			if (typeof value === "object") {
				return JSON.stringify(value) !== JSON.stringify(this.get());
			} else {
				return value !== this.get();
			}
		},
		// set: function(value) {
		// 	if (typeof value === "object") {
		// 		var json = JSON.stringify(value);
		// 		if (json !== JSON.stringify(this.get())) {
		// 			this.changeValue(value, json !== JSON.stringify(this.getOriginal()), history && history.index);
		// 		}
		// 	} else {
		// 		if (value !== this.get()) {
		// 			this.changeValue(value, value !== this.getOriginal(), history && history.index);
		// 		}
		// 	}
		// },
		set: function(value) {
			if (this.isDifferent(value)) {
				this.changeValue(value, this.isModified(value));
			}
		},
		// set: function(value) {
		// 	var isDifferent;
		// 	var isModified;
		// 	if (typeof value === "object") {
		// 		var json = JSON.stringify(value));
		// 		isDifferent = json !== JSON.stringify(this.get());
		// 		isModified = json !== JSON.stringify(this.getOriginal());
		// 	} else {
		// 		isDifferent = value !== this.get();
		// 		isModified = value !== this.getOriginal();
		// 	}
		// 	if (isDifferent) {
		// 		this.changeValue(value);
		// 		if (isModified !== this.isModified && this.onSave) { // if this.isModified is undefined -> no care!
		// 			this.onSave(); // -> render footer
		// 		}
		// 		this.isModified = isModified;
		// 	}
		// },



		changeValue: function(value, modified) {
			if (resource.key) {
				this.value = value;
				this.bubble(resource.key, value); // todo: prevent bubbling if not needed
				if (history) {
					history.pool.set(this.post.uri || this.post.pseudo_uri, resource.key, history.index, this.value);
				}
				if (modified !== this.modified && this.onSave) { // if this.isModified is undefined -> no care!
					this.onSave(); // -> render footer
				}
				this.modified = modified;
			} else if (this.parent) {
				var parentValue = this.parent.get() || {};
				if (resource.child_key) {
					parentValue[resource.child_key] = value;
				}
				this.parent.changeValue(parentValue, modified);
			}
			if (this.onModify) {
				this.onModify(modified);
			}
		},


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
		getOriginal: function() {
			if (resource.key) {
				return this.originalValue;
			} else if (parent) {
				var original = parent.getOriginal();
				if (original && resource.child_key) {
					return original[resource.child_key];
				} else {
					return original;
				}
			}
		},
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

		update: function() {
			if (resource.key) {
				var uri = this.post.uri || this.post.pseudo_uri;
				var value = history.pool.get(uri, resource.key, history.index);

				if (this.isDifferent(value)) {
					var modified = this.isModified();
					this.value = value;
					this.bubble(resource.key, value);
					if (modified !== this.modified && this.onSave) { // if this.isModified is undefined -> no care!
						this.onSave(); // -> render footer
					}
					this.modified = modified;
					if (this.onUpdate) {
						this.onUpdate(value);
					}
				}
			} else if (this.onUpdate) {
				this.onUpdate(this.get());
			}
		},
		remove: function() {
			if (manager.onRemove) {
				manager.onRemove();
			}
		},
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

		fetch: function() {

			if (!this.promise) {
				if (resource.key) {
					var historyIndex = history.index;
					var initialIndex = history.initialIndex;
					var uri = this.post.uri || this.post.pseudo_uri;
					var currentValue = history.pool.get(uri, resource.key, history.index);
					var initialValue = history.pool.get(uri, resource.key, history.initialIndex);
					if (initialValue !== undefined) {
						this.originalValue = initialValue;
						if (currentValue !== undefined) {
							this.value = currentValue;
							this.bubble(resource.key, currentValue);
							this.modified = false;
						}
						if (manager.onFetch) {
							currentValue = manager.onFetch(currentValue);
						}
						this.promise = Promise.resolve(currentValue);
					} else if (this.post[resource.key] !== undefined) {
						this.originalValue = this.post[resource.key];
						if (currentValue === undefined) {
							currentValue = this.post[resource.key];
						}
						this.value = currentValue;
						this.bubble(resource.key, currentValue);
						this.modified = false;
						if (this.onFetch) {
							currentValue = manager.onFetch(currentValue);
						}
						this.promise = Promise.resolve(currentValue);
					} else if (this.post.uri) {
						var path;
						if (KarmaFields.cacheURL && resource.cache) {
							path = KarmaFields.cacheURL+"/"+middleware+"/"+this.post.uri+"/"+resource.cache;
						} else {
							path = KarmaFields.getURL+"/"+middleware+"/"+this.post.uri+"/"+resource.key;
						}
						this.promise = this.query(path).then(function(value) {
							manager.originalValue = value;
							if (currentValue === undefined) {
								currentValue = manager.getDefault && manager.getDefault(value) || value || resource.default;
							}
							if (manager.onFetch) {
								currentValue = manager.onFetch(currentValue);
							}
							history.pool.set(uri, resource.key, initialIndex, currentValue);
							if (manager.value === undefined) {
								manager.value = currentValue;
								manager.bubble(resource.key, currentValue);
								manager.modified = false;
							} else if (manager.isDifferent(currentValue)) {
								manager.modified = true;
								if (manager.onModify) {
									manager.onModify(true);
								}
							}
							return value;
						});
					} else { // -> item was added
						this.originalValue = null;
						this.promise = Promise.resolve(resource.default);
					}
				} else if (parent) {
					return parent.fetch().then(function(parentValue) {
						if (parentValue && resource.child_key) {
							return parentValue[resource.child_key];
						}
						return parentValue;
					});
				} else {
					this.promise = Promise.resolve();
				}
			}
			return this.promise;
		},

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
		fetchInherit: function() {
			if (this.post.placeholder_uri) {
				if (resource.key) {
					var historyIndex = history.index;
					var value = history.pool.get(this.post.placeholder_uri, resource.key, historyIndex);
					if (value !== undefined) {
						return Promise.resolve(value);
					} else {
						return this.query(middleware+"/"+this.post.placeholder_uri+"/"+resource.key).then(function(value) {
							history.pool.set(this.post.placeholder_uri, resource.key, historyIndex, value);
							return value || resource.placeholder;
						});
					}
				} else if (parent) {
					return parent.fetchInherit().then(function(parentValue) {
						if (parentValue && resource.child_key) {
							return parentValue[resource.child_key] || resource.placeholder;
						}
						return parentValue;
					});
				}
			}
			return Promise.resolve(resource.placeholder);
		},
		query: function(file) {
			return fetch(file, {
				cache: "reload"
			}).then(function(response) {
				if (!resource.cache || resource.cache.slice(-5) === ".json") {
					return response.json();
				} else {
					return response.text();
				}
			});
		}
	};

	manager.id = manager.getId(); //middleware + "/" + (post.uri || post.pseudo_uri).split("/").join("-") + "-" + (resource.key || resource.child_key || "group");

	return manager;
}
