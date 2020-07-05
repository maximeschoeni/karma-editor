
KarmaFieldMedia.managers.field = function(resource) {
	var manager = {
		resource: resource,
		post: null,
		parent: null,
		table: null,
		build: function() {
			if (KarmaFieldMedia.fields[resource.name || "group"]) {
				this.element = KarmaFieldMedia.fields[resource.name || "group"](this);
				this.init();
				return this.element;
			}
		},
		getChildren: function() {
			// if (!this.children) {
			// 	this.children = (resource.children || []).map(function(resource) {
			// 		var child = KarmaFieldMedia.managers.field(resource);
			// 		child.table = manager.table;
			// 		child.post = manager.post;
			// 		child.parent = manager;
			// 		return child;
			// 	});
			// }
			return this.children;
		},
		getRoot: function() {
			return this.parent && this.parent.getRoot() || this;
		},
		// getChange: function() {
		// 	return this.original().then(function(value) {
		// 		if (value !== manager.currentValue) {
		// 			return manager;
		// 		}
		// 	});
		// },
		getCache: function(uri) {
			var index = this.table.history.index;
			var value = KarmaFieldMedia.cache.getItem(this.table.resource.middleware+"/"+uri+"/"+index+"/"+resource.key);
			// while (value === null && index > 0) {
			// 	index--;
			// 	value = KarmaFieldMedia.cache.getItem(this.table.resource.middleware+"/"+uri+"/"+index+"/"+resource.key);
			// }
			if (resource.type === "json") {
				return JSON.parse(value || "");
			}
			return value;
		},
		updateCache: function(uri, value) {
			if (resource.type === "json") {
				value = JSON.stringify(value || "");
			}
			KarmaFieldMedia.cache.setItem(this.table.resource.middleware+"/"+uri+"/"+this.table.history.index+"/"+resource.key, value);
		},
		// deleteCache: function(uri) {
		// 	var path = this.table.resource.middleware+"/"+uri+"/"+resource.key;
		// 	KarmaFieldMedia.cache.removeItem(path);
		// },
		// changeURICache: function(uri, newURI) {
		// 	var path = this.table.resource.middleware+"/"+uri+"/"+resource.key;
		// 	KarmaFieldMedia.cache.updateCache(this.table.resource.middleware+"/"+newURI+"/"+resource.key, KarmaFieldMedia.cache.getItem(path));
		// 	KarmaFieldMedia.cache.removeItem(path);
		// },

		get: function() {
			if (resource.key) {
				if (this.modifiedValue === undefined) {
					return this.originalValue;
				} else {
					return this.modifiedValue;
				}
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
			var isModified;
			if (resource.key) {
				if (value === this.originalValue) {
					isModified = false;
					this.modifiedValue = undefined;
				} else {
					isModified = true;
					this.modifiedValue = value;
				}
				if (isModified !== this.isModified) {
					if (this.table.renderFooter) {
						this.table.renderFooter();
					}
				}
				this.updateCache(this.post.uri, value);
			} else if (this.parent) {
				var parentValue = this.parent.get() || {};
				if (resource.child_key) {
					parentValue[resource.child_key] = value;
					isModified = value === parentValue[resource.child_key];
				}
				this.parent.set(value);
			}
			if (isModified !== this.isModified) {
				if (this.onModify) {
					this.onModify(isModified);
				}
				this.isModified = isModified;
			}




			// // if (this.originalValue !== undefined) {
			// var isModified = (value === this.originalValue);
			// if (isModified) {
			// 	manager.modifiedValue = undefined;
			// } else {
			// 	manager.modifiedValue = value;
			// }
			// if (isModified !== manager.isModified) {
			// 	if (manager.onModify) {
			// 		manager.onModify(isModified);
			// 	}
			// 	if (manager.table.renderFooter) {
			// 		manager.table.renderFooter();
			// 	}
			// }
			// manager.isModified = isModified;
			//
			// // if (manager.originalValue !== undefined) {
			// // 	this.updateCache();
			// // }
			//
			// if (this.parent && resource.child_key) {
			// 	// this.parent.set(this.parent.);
			//
			// }


		},

		// update: function() {
		// 	if (manager.onUpdate && manager.modifiedValue === undefined) {
		// 		manager.onUpdate(manager.originalValue);
		// 	}
		// },

		getOriginal: function() {
			if (resource.key) {
				return this.originalValue;
			} else if (this.parent) {
				var inheritedValue = this.parent.getOriginal();
				if (resource.child_key) {
					return inheritedValue[resource.child_key]);
				} else {
					return inheritedValue;
				}
			}
		},
		setOriginal: function(value) {
			if (resource.key && this.originalValue !== value) {
				this.originalValue = value;
				if (this.modifiedValue === null) {
					this.update();
				}
				if (this.modifiedValue === value) {
					this.modifiedValue = undefined;
				}
				this.modify();
			}
		},

		update: function() {
			if (this.onUpdate) {
				this.onUpdate(this.get());
			}
			this.children.forEach(function(child) {
				child.update();
			});
		},
		modify: function() {
			if (this.onModify) {
				this.onModify(this.get() !== this.getOriginal());
			}
			this.children.forEach(function(child) {
				child.modify();
			});
		},
		updateDefault: function() {
			if (this.onDefault) {
				this.onDefault(this.getDefault());
			}
			this.children.forEach(function(child) {
				child.updateDefault();
			});
		},
		getDefault: function() {
			if (resource.key) {
				return this.defaultValue;
			} else if (this.parent) {
				var inheritedValue = this.parent.getDefault();
				if (resource.child_key) {
					return inheritedValue[resource.child_key]);
				} else {
					return inheritedValue;
				}
			}
		},
		setDefault: function(value) {
			if (resource.key && this.defaultValue !== value) {
				this.defaultValue = value;
				this.updateDefault();
			}
		},



		// init once parent, children, table and post are set
		init: function() {

			this.children = (resource.children || []).map(function(resource) {
				var child = KarmaFieldMedia.managers.field(resource);
				child.table = manager.table;
				child.post = manager.post;
				child.parent = manager;
				return child;
			});
			if (resource.key) {


				// var path = this.table.resource.middleware+"/"+this.post.uri+"/"+resource.key;
				// var value = KarmaFieldMedia.cache.getItem(path);
				var value = this.getCache(this.post.uri);
				if (value !== undefined) {
					// if (resource.type === "json") {
					// 	value = JSON.parse(value);
					// }
					this.setOriginal(value);
				} else if (this.post[resource.key] !== undefined) {
					this.setOriginal(this.post[resource.key]);
					this.updateCache(this.post.uri, this.post[resource.key]);
				} else {
					this.query(path).then(function(value) {
						manager.setOriginal(value);
						manager.updateCache(manager.post.uri, value);
					});
				}
				// var defaultPath = this.table.resource.middleware+"/"+this.post.default_uri+"/"+resource.key;
				// var defaultValue = KarmaFieldMedia.cache.getItem(defaultPath);
				var defaultValue = this.getCache(this.post.default_uri);
				if (defaultValue !== null) {
					// if (resource.type === "json") {
					// 	defaultValue = JSON.parse(defaultValue);
					// }
					this.setDefault(defaultValue);
				} else {
					this.query(defaultPath).then(function(value) {
						manager.setDefault(value);
						manager.updateCache(manager.post.default_uri, value);
						// if (resource.type === "json") {
						// 	value = JSON.stringify(value);
						// }
						// KarmaFieldMedia.cache.setItem(defaultPath, value);
					});
				}
			}

		},
		// original: function() {
		// 	if (resource.key) {
		// 		if (resource.type) {
		// 			if (!this.originalValue) {
		// 				if (this.post[resource.key] !== undefined) {
		// 					this.originalValue = Promise.resolve(this.post[resource.key]);
		// 				} else if (this.post.uri) {
		// 					var file = this.table.resource.middleware+"/"+this.post.uri+"/"+resource.key;
		// 					this.originalValue = this.query(file).then(function(value) {
		// 						return value;
		// 					});
		// 				} else {
		// 					this.originalValue = Promise.resolve(undefined);
		// 					// this.originalValue = Promise.reject(new Error("Karma Fields field manager error: no uri"));
		// 				}
		// 			}
		// 			return this.originalValue;
		// 		} else if (this.parent) {
		// 			return this.parent.original().then(function(result) {
		// 				return result[resource.key];
		// 			});
		// 		} else {
		// 			return Promise.reject(new Error("Karma Fields field manager Error: no type and no parent"));
		// 		}
		// 	} else if (this.parent) {
		// 		return this.parent.original();
		// 	} else {
		// 		return Promise.reject(new Error("Karma Fields field manager Error: no key and no parent"));
		// 	}
		// },

		// value: function() {
		// 	if (this.modifiedValue !== undefined) {
		// 		return Promise.resolve(this.modifiedValue);
		// 	} else {
		// 		return this.original();
		// 	}
		// 	// var uri = this.post.uri;
		// 	// var key = resource.key;
		// 	//
		// 	// if (uri && key) {
		// 	// 	if (this.currentValue !== undefined) {
		// 	// 		return Promise.resolve(this.currentValue);
		// 	// 	// if (this.table.hasChange(uri, key)) {
		// 	// 	// 	return Promise.resolve(this.table.getChange(uri, key));
		// 	// 	// }
		// 	// 	// if (this.currentValue !== undefined) {
		// 	// 	// 	return Promise.resolve(this.currentValue);
		// 	// 	// } else {
		// 	// 	// 	return this.original();
		// 	// 	// }
		// 	// 	} else if (this.originalValue !== undefined) {
		// 	// 		return Promise.resolve(this.originalValue);
		// 	// 	} else if (this.post[key] !== undefined) {
		// 	// 		this.originalValue = this.post[key];
		// 	// 		return Promise.resolve(this.post[key]);
		// 	// 	} else {
		// 	// 		return this.request(uri, key).then(function(value) {
		// 	// 			manager.originalValue = value;
		// 	// 			return value;
		// 	// 		});
		// 	// 	}
		// 	// } else {
		// 	// 	return Promise.reject(new Error("Karma Fields field manager error: uri or key not found"));
		// 	// }
		// 	// else if (resource.key && this.post[resource.key] !== undefined) {
		// 	// 	this.originalValue = this.post[resource.key];
		// 	// 	return Promise.resolve(this.post[resource.key]);
		// 	// } else if (this.post.uri) {
		// 	// 	return this.request(this.post.uri).then(function(value) {
		// 	// 		manager.originalValue = value;
		// 	// 		return value;
		// 	// 	});
		// 	// } else {
		// 	// 	return Promise.reject(new Error("Karma Fields field error: uri not found"));
		// 	// }
		// },
		// default: function() {
		// 	if (this.post.default_uri && (resource.key && resource.type || this.parent)) {
		// 		if (resource.key) {
		// 			if (resource.type) {
		// 				var file = this.table.resource.middleware+"/"+uri+"/"+resource.key;
		// 				return this.query(file);
		// 			} else if (this.parent) {
		// 				return this.parent.default().then(function(result) {
		// 					return result[resource.key];
		// 				});
		// 			}
		// 		} else if (this.parent) {
		// 			return this.parent.default();
		// 		}
		// 	} else {
		// 		return Promise.resolve("");
		// 	}
		// },
		// request: function(uri) {
		// 	if (resource.key) {
		// 		if (resource.type) {
		// 			var file = this.table.resource.middleware+"/"+uri+"/"+resource.key;
		// 			return this.query(file);
		// 		} else if (this.parent) {
		// 			return this.parent.request(uri).then(function(result) {
		// 				return result[resource.key];
		// 			});
		// 		} else {
		// 			return Promise.reject(new Error("Karma Fields field manager Error: no type and no parent"));
		// 		}
		// 	} else if (this.parent) {
		// 		return this.parent.request(uri).then(function(result) {
		// 			return result;
		// 		});
		// 	} else {
		// 		return Promise.reject(new Error("Karma Fields field manager Error: no key and no parent"));
		// 	}
		// },
		format: function(response) {
			if (response.ok) {
				var result;
				if (response.url.slice(-5) === ".json") { // file.endsWith(".json")
					return response.json();
					// .then(function(result) {
					// 	if (typeof result !== "object") {
					// 		return {};
					// 	}
					// 	return result;
					// });
				} else {
					return response.text();
				}
			} else {
				return response;
			}
		},
		query: function(file) {
			var url = KarmaFields.getURL+"/"+file;

			// var cache = KarmaFieldMedia.cache.query(url);
			// if (cache) {
			// 	// manager.format(cache).then(console.log)
			// 	// return manager.format(cache);
			// 	return Promise.resolve(cache);
			// }

			return fetch(url, {
				cache: "reload"
			}).then(function(response) {
				if (resource.type === "json") { // file.endsWith(".json")
					return response.json();
				} else {
					return response.text();
				}
				return results;
			});
		}
		// update: function(file, value) {
		// 	KarmaFieldMedia.cache.put(KarmaFields.getURL+"/"+file, value);
		// 	return fetch(KarmaFields.saveURL+"/"+file, {
		// 		method: "post",
		// 		headers: {"Content-Type": "application/json"},
		// 		body: JSON.stringify({
		// 			value: value
		// 		}),
		// 		mode: "same-origin"
		// 	}).then(function(response) {
		// 		return response.json();
		// 	});
		// },
		// change: function() {
		//
		// 	this.value().then(function(originalValue) {
		//
		// 	});
		//
		//
		// 	if (resource.key) {
		// 		if (resource.type) {
		// 			var uri = this.post[resource.locator || "uri"];
		// 			if (uri) {
		// 				// var file = this.table.resource.middleware+"/"+uri+"/"+resource.key;
		//
		// 				if (this.currentValue === undefined) {
		// 					this.original().then(function(originalValue) {
		// 						if (value === originalValue) {
		// 							manager.currentValue = undefined;
		// 						} else {
		// 							manager.table.addChange(uri, resource.key, value);
		// 						}
		// 					});
		// 				}
		//
		// 				this.table.addChange(uri, resource.key, value);
		//
		// 				// if (this.post[resource.key]) {
		// 				// 	this.post[resource.key] = value;
		// 				// }
		// 				//
		// 				// return this.update(file, value).then(function() {
		// 				// 	// -> update related filter
		// 				// 	if (manager.table.filter) {
		// 				// 		manager.table.filter.updateDescendant(resource.key);
		// 				// 	}
		// 				//
		// 				// });
		// 			} else {
		// 				return Promise.reject(new Error("Karma Fields Saving Error: no postURI"));
		// 			}
		// 		} else if (this.parent) {
		// 			return this.parent.value().then(function(result) {
		// 				result[resource.key] = value;
		// 				return this.parent.save(result);
		// 			});
		// 		} else {
		// 			return Promise.reject(new Error("Field ("+resource.key+") cannot save: no object and no parent"));
		// 		}
		// 	} else if (this.parent) {
		// 		return this.parent.save(value);
		// 	} else {
		// 		return Promise.reject(new Error("Field Manager cannot save: no key and no parent"));
		// 	}
		// }
	};
	return manager;
}
