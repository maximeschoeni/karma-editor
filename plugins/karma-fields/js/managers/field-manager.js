
KarmaFieldMedia.managers.field = function(resource, post, middleware, history, parent) {
	var manager = {
		resource: resource,
		post: post,
		parent: parent,
		history: history,
		build: function() {
			if (KarmaFieldMedia.fields[resource.field || resource.name || "group"]) {
				this.element = KarmaFieldMedia.fields[resource.field || resource.name || "group"](this);
				// this.init();
				return this.element;
			}
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
		updateState: function(key, value) {
			if (parent) {
				parent.updateState(key, value);
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
		get: function() {
			if (resource.key) {
				if (this.value === undefined) {
					return undefined;
				}
				return JSON.parse(this.value);
			} else if (this.parent) {
				var value = this.parent.get() || {};
				if (resource.child_key) {
					return value[resource.child_key];
				} else {
					return value;
				}
			}
		},
		set: function(value) {
			if (value === "undefined") {
				return Promise.reject("cannot set undefined value");
			}
			this.wasModified = this.isModified;
			this.isModified = value !== this.getOriginal();
			if (this.isModified != this.wasModified && this.onModify) {
				this.onModify(this.isModified);
			}
			if (resource.key) {
				var encodedValue = JSON.stringify(value);
				if (encodedValue !== this.value) {
					this.prevValue = this.value;
					this.value = encodedValue;
					this.updateState(resource.key, value); // for external use
				}
				return Promise.resolve();
			} else if (this.parent) {
				var parentValue = this.parent.get() || {};
				if (resource.child_key) {
					// if (value === parentValue[resource.child_key]) { // do not update parent if value is the same
					// 	return Promise.resolve();
					// }
					parentValue[resource.child_key] = value;
				}
				return this.parent.set(parentValue);
			} else {
				return Promise.reject("field has no key or no parent");
			}
		},
		save: function() {
			// if (this.get() !== this.getPrevious()) { // ! not working with objects...
				if (resource.key) {
					if (this.value !== this.prevValue) {
						history.updatePool(this.post.uri || this.post.pseudo_uri, resource.key, this.value);
						if (this.isModified != this.wasModified && this.onSave) {
							this.onSave(); // -> render footer
						}
					}
				} else if (parent) {
					parent.save();
				}
			// }
		},
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
		getOriginal: function() {
			if (resource.key) {
				if (this.originalValue === undefined) {
					return undefined;
				}
				return JSON.parse(this.originalValue);
			} else if (parent) {
				var original = parent.getOriginal();
				if (original && resource.child_key) {
					return original[resource.child_key];
				} else {
					return original;
				}
			}
		},
		fetch: function(defaultValue) {


			if (resource.key) {
				var historyIndex = history.index;
				var dbIndex = history.dbIndex;
				var uri = this.post.uri || this.post.pseudo_uri;
				var cacheValue = history.get(uri, resource.key);



				if (cacheValue) {
					var value = JSON.parse(cacheValue);
					this.originalValue = history.pool.get(history.dbIndex, uri, resource.key);
					this.set(value);
					return Promise.resolve(value);
				} else if (this.post[resource.key] !== undefined) {
					var value = this.post[resource.key];
					cacheValue = JSON.stringify(value);
					this.originalValue = cacheValue;
					this.set(value);
					history.pool.set(historyIndex, uri, resource.key, cacheValue);
					return Promise.resolve(value);
				} else if (this.post.uri) {
					if (!this.promise) {
						var path;
						if (KarmaFields.cacheURL && resource.cache) {
							path = KarmaFields.cacheURL+"/"+middleware+"/"+this.post.uri+"/"+resource.cache;
						} else {
							path = KarmaFields.getURL+"/"+middleware+"/"+this.post.uri+"/"+resource.key;
						}
						this.promise = this.query(path).then(function(value) {
							if (value === undefined) {
								console.error("queried value must not be undefined");
							}
							if (!value && defaultValue) {
								value = defaultValue;
							}
							cacheValue = JSON.stringify(value);
							manager.originalValue = cacheValue;
							manager.set(value);
							history.pool.set(historyIndex, uri, resource.key, cacheValue);
							// console.log(value, manager.value);
							return value;
						});
					}
					return this.promise;
					// return this.query(path).then(function(value) {
					// 	manager.originalValue = value;
					// 	manager.set(value);
					// 	history.pool.set(historyIndex, uri, resource.key, value);
					// 	return value;
					// });
				} else { // -> item was added
					var value = defaultValue || resource.defaultValue || ""; // -> must not be undefined
					this.originalValue = null;
					this.set(value);
					return Promise.resolve(value);
				}
			} else if (parent) {
				return parent.fetch().then(function(parentValue) {
					if (parentValue && resource.child_key) {
						return parentValue[resource.child_key];
					}
					return parentValue;
				});
			} else {
				return Promise.reject("field has no key and no parent");
			}
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
		fetchPlaceholder: function() {
			if (this.post.placeholder_uri) {
				if (resource.key) {
					var historyIndex = history.index;
					var value = history.pool.get(historyIndex, this.post.placeholder_uri, resource.key);
					if (value !== undefined) {
						return Promise.resolve(value);
					} else {
						return this.query(middleware+"/"+this.post.placeholder_uri+"/"+resource.key).then(function(value) {
							history.pool.set(historyIndex, this.post.placeholder_uri, resource.key, value);
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
				} else {
					return Promise.reject("field has no key and no parent");
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
