
KarmaFieldMedia.managers.field = function(resource, post, middleware, history, parent) {
	var manager = {
		resource: resource,
		post: post,
		parent: parent,
		history: history,
		build: function() {
			if (KarmaFieldMedia.fields[resource.name || "group"]) {
				this.element = KarmaFieldMedia.fields[resource.name || "group"](this);
				// this.init();
				return this.element;
			}
		},
		getChildren: function() {
			return (resource.children || []).map(function(resource) {
				return KarmaFieldMedia.managers.field(resource, post, middleware, history, manager);
			});
		},
		get: function() {
			if (resource.key) {
				return this.value;
			} else if (this.parent) {
				var value = this.parent.get();
				if (resource.child_key) {
					return value[resource.child_key];
				} else {
					return value;
				}
			}
		},
		set: function(value) {
			this.wasModified = this.isModified;
			this.isModified = value !== this.getOriginal();
			if (this.isModified != this.wasModified && this.onModify) {
				this.onModify(this.isModified);
			}
			if (resource.key) {
				this.prevValue = this.value;
				this.value = value;

				return Promise.resolve(this);
			} else if (this.parent) {
				var parentValue = this.parent.get() || {};
				if (resource.child_key) {
					parentValue[resource.child_key] = value;
				}
				return this.parent.set(parentValue);
			} else {
				return Promise.reject("field has no key or no parent");
			}
		},
		save: function() {
			if (resource.key && this.value !== this.prevValue) {
				history.updatePool(this.post.uri || this.post.pseudo_uri, resource.key, this.value);
				if (this.isModified != this.wasModified && this.onSave) {
					this.onSave(); // -> render footer
					// this.table.renderFooter();
				}
			}
		},
		getOriginal: function() {
			if (resource.key) {
				return this.originalValue;
			} else if (this.parent) {
				var original = this.parent.getOriginal();
				if (resource.child_key) {
					return original[resource.child_key];
				} else {
					return original;
				}
			}
		},
		fetch: function() {
			if (resource.key) {
				var historyIndex = history.index;
				var dbIndex = history.dbIndex;
				var uri = this.post.uri || this.post.pseudo_uri;
				var value = history.get(uri, resource.key);
				if (value !== undefined) {
					this.originalValue = history.pool.get(history.dbIndex, uri, resource.key);
					this.set(value);
					return Promise.resolve(value);
				} else if (this.post[resource.key] !== undefined) {
					value = this.post[resource.key];
					this.originalValue = value;
					this.set(value);
					history.pool.set(historyIndex, uri, resource.key, value);
					return Promise.resolve(value);
				} else if (this.post.uri) {
					var path = middleware+"/"+this.post.uri+"/"+resource.key;
					return this.query(path).then(function(value) {
						manager.originalValue = value;
						manager.set(value);
						history.pool.set(historyIndex, uri, resource.key, value);
						return value;
					});
				} else { // -> item was added
					value = resource.defaultValue;
					this.originalValue = null;
					// field.wasModified = true;
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
			var url = KarmaFields.getURL+"/"+file;
			return fetch(url, {
				cache: "reload"
			}).then(function(response) {
				if (resource.type === "json") { // file.endsWith(".json")
					return response.json();
				} else {
					return response.text();
				}
			});
		}
	};
	manager.id = middleware + "/" + (post.uri || post.pseudo_uri).split("/").join("-") + "-" + (resource.key || resource.child_key || "group");
	return manager;
}
