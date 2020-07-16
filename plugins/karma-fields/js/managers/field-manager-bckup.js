
KarmaFieldMedia.managers.field = function(resource, post, table, parent) {
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
		getId: function() {
			return (this.table.middleware + "/" + this.post.uri.split("/").join("-") || this.post.pseudo_uri) + "-" + (resource.key || resource.child_key || "group");
		},
		// getChange: function() {
		// 	return this.original().then(function(value) {
		// 		if (value !== manager.currentValue) {
		// 			return manager;
		// 		}
		// 	});
		// },
		// getPool: function(index) {
		// 	this.table.pool.get(this.post.uri || this.post.pseudo_uri, index, resource.key, resource.type);
		// },
		// getPoolAt: function(index) {
		// 	this.table.pool.getAt(this.post.uri || this.post.pseudo_uri, index, resource.key, resource.type);
		// },
		// setPoolAt: function(value, index) {
		// 	this.table.pool.setAt(value, this.post.uri || this.post.pseudo_uri, index, resource.key, resource.type);
		// },
		// updatePool: function(index) {
		//
		//
		//
		// 	if (resource.key && this.isModified) {
		// 		this.table.pool.setAt(this.value, this.post.uri || this.post.pseudo_uri, index || this.table.history.index, resource.key, resource.type);
		// 	}
		// },
		//
		// getCacheAt: function(index, uri) {
		// 	var value = KarmaFieldMedia.cache.getItem(this.table.resource.middleware+"/"+(uri || this.post.uri || this.post.pseudo_uri)+"/"+index+"/"+resource.key);
		// 	if (value && resource.type === "json") {
		// 		return JSON.parse(value);
		// 	}
		// 	return value;
		// },
		// getCache: function(index, uri) {
		// 	// if (index === undefined) {
		// 	// 	index = this.table.history.index;
		// 	// }
		// 	// var value = KarmaFieldMedia.cache.getItem(this.table.resource.middleware+"/"+uri+"/"+index+"/"+resource.key);
		// 	var index = index || this.table.history.index;
		// 	var value = this.getCacheAt(index, uri);
		// 	while ((value === null || value === undefined) && index > 0) {
		// 		index--;
		// 		value = this.getCacheAt(index, uri);
		// 	}
		// 	// if (resource.type === "json") {
		// 	// 	return JSON.parse(value || "");
		// 	// }
		// 	return value;
		// },
		//
		// updateCacheAt: function(value, index, uri) {
		// 	if (value === null || value === undefined) {
		// 		KarmaFieldMedia.cache.removeItem(this.table.resource.middleware+"/"+(uri || this.post.uri || this.post.pseudo_uri)+"/"+index+"/"+resource.key);
		// 	} else {
		// 		if (value && resource.type === "json") {
		// 			value = JSON.stringify(value || "");
		// 		}
		// 		KarmaFieldMedia.cache.setItem(this.table.resource.middleware+"/"+(uri || this.post.uri || this.post.pseudo_uri)+"/"+index+"/"+resource.key, value);
		// 	}
		// },
		//
		// updateCache: function(value, index, uri) {
		// 	this.updateCacheAt(value, index || this.table.history.index, uri);
		// 	// if (index === undefined) {
		// 	// 	index = this.table.history.index;
		// 	// }
		// 	// // console.log(uri, value);
		// 	// // return;
		// 	// if (value === undefined) {
		// 	// 	KarmaFieldMedia.cache.removeItem(this.table.resource.middleware+"/"+uri+"/"+index+"/"+resource.key);
		// 	// } else {
		// 	// 	if (resource.type === "json") {
		// 	// 		value = JSON.stringify(value || "");
		// 	// 	}
		// 	// 	KarmaFieldMedia.cache.setItem(this.table.resource.middleware+"/"+uri+"/"+index+"/"+resource.key, value);
		// 	// }
		// },

		// blur: function() {
		// 	// if (this.isModified) {
		// 	// 	this.table.history.next();
		// 	// }
		// 	//console.log("blur");
		// },
		// select: function() {
		// 	// if (this.isModified) {
		// 	// 	this.table.history.next();
		// 	// }
		// 	// console.log("select", this.value, this.isModified);
		// },
		// unselect: function() {
		// 	// if (this.isModified) {
		// 	// 	this.table.history.next();
		// 	// }
		// 	// console.log("unselect", this.value, this.isModified);
		// },

		// deleteCache: function(uri) {
		// 	var path = this.table.resource.middleware+"/"+uri+"/"+resource.key;
		// 	KarmaFieldMedia.cache.removeItem(path);
		// },
		// changeURICache: function(uri, newURI) {
		// 	var path = this.table.resource.middleware+"/"+uri+"/"+resource.key;
		// 	KarmaFieldMedia.cache.updateCache(this.table.resource.middleware+"/"+newURI+"/"+resource.key, KarmaFieldMedia.cache.getItem(path));
		// 	KarmaFieldMedia.cache.removeItem(path);
		// },




		// clear: function() {
		// 	var isModified = false;
		// 	var hasChanged = this.get();
		// 	var isUpdated = isModified !== this.isModified;
		// 	if (resource.key) {
		// 		this.value = undefined;
		// 	} else if (this.parent) {
		// 		var parentValue = this.parent.get() || {};
		// 		if (resource.child_key) {
		// 			parentValue[resource.child_key] = undefined;
		// 		}
		// 		this.parent.set(parentValue);
		// 	}
		// 	if (isUpdated) {
		// 		if (this.onModify) {
		// 			this.onModify(isModified);
		// 		}
		// 		if (resource.key && this.table.renderFooter) {
		// 			this.table.renderFooter();
		// 		}
		// 	}
		// 	this.isModified = isModified;
		// 	return Promise.resolve(hasChanged, isModified, isUpdated);
		// },

		get: function() {
			if (resource.key) {
				// var value = this.getCache(this.post.uri);
				// if (value === undefined) {
				// 	if (this.post[resource.key] !== undefined) {
				// 		value = this.post[resource.key];
				// 	} else {
				// 		var path = manager.table.resource.middleware+"/"+manager.post.uri+"/"+resource.key;
				// 		this.query(path).then(function(value) {
				// 			manager.setOriginal(value);
				// 			manager.updateCache(manager.post.uri, value, "0");
				// 		});
				// 	}
				// }
				return this.value;

				// if (this.modifiedValue === undefined) {
				// 	return this.originalValue;
				// } else {
				// 	return this.modifiedValue;
				// }
			} else if (this.parent) {
				var value = this.parent.get();
				if (resource.child_key) {
					return value[resource.child_key];
				} else {
					return value;
				}
			}
		},

		save: function() {
			if (resource.key && this.value !== this.prevValue) {
				this.table.pool.setAt(this.value, this.table.history.index, this.post.uri || this.post.pseudo_uri, resource.key, resource.type);
				if (this.isModified != this.wasModified && this.table.renderFooter) {
					this.table.renderFooter();
				}
			}
		},

		set: function(value) {
			this.wasModified = this.isModified;
			this.isModified = value !== this.getOriginal();
			if (this.isModified != this.wasModified && this.onModify) {
				this.onModify();
			}

			if (resource.key) {
				this.prevValue = this.value;
				this.value = value;
				return Promise.resolve(this, this.table.history);
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


		// set: function(value) {
		// 	var prevValue = this.value;
		// 	var wasModified = this.isModified;
		// 	var isModified;
		// 	if (resource.key) {
		// 		this.value = value;
		// 		isModified = value !== this.originalValue;
		// 		// if (isModified !== this.isModified) {
		// 		// 	this.table.history.save();
		// 		// }
		// 		// this.updateCache(value);
		// 		// if (isModified) {
		// 		// 	this.table.pool.setAt(this.value, this.table.history.index, this.post.uri || this.post.pseudo_uri, resource.key, resource.type);
		// 		// }
		// 	} else if (this.parent) {
		// 		var parentValue = this.parent.get() || {};
		// 		if (resource.child_key) {
		// 			parentValue[resource.child_key] = value;
		// 			isModified = value === parentValue[resource.child_key];
		// 		}
		// 		this.parent.set(parentValue);
		// 	}
		// 	if (isModified !== this.isModified) {
		// 		if (this.onModify) {
		// 			this.onModify(isModified);
		// 		}
		// 		if (resource.key && this.table.renderFooter) {
		// 			this.table.renderFooter();
		// 		}
		// 		this.isModified = isModified;
		// 	}
		// 	return Promise.resolve(this, this.table.history, prevValue, wasModified);
		// },

		change: function(value) {
			var previous = this.get();
			var hasChanged = value !== previous;
			if (resource.key) {
				this.value = value;
				// if (hasChanged) {
				// 	this.table.pool.setAt(value, this.post.uri || this.post.pseudo_uri, this.table.history.index, resource.key, resource.type);
				// }
			}
			this.children.forEach(function(child) {
				if (child.resource.child_key) {
					child.change(value[child.resource.child_key]);
				} else {
					child.change(value);
				}
			});
			var isModified = value !== this.getOriginal();
			var isModifyUpdated = this.isModified !== isModified;
			if (isModifyUpdated) {
				if (this.onModify) {
					this.onModify(isModified); // -> update cell
				}
				// this.table.history.save();
				// -> update Pool

				// if (resource.key && this.table.renderFooter) {
				// 	this.table.renderFooter();
				// }
				this.isModified = isModified;
			}
			if (hasChanged && this.onUpdate) {
				this.onUpdate(value); // -> update input
			}

			// return Promise.resolve(hasChanged, isModified, isModifyUpdated);
		},



		// getIsModified: function() {
		// 	return this.parent.get() === this.parent.getOriginal();
		// 	// if (resource.key) {
		// 	// 	return this.isModifed;
		// 	// } else if (this.parent) {
		// 	// 	var value = this.parent.get() === this.parent.getOriginal()
		// 	// 	if (resource.child_key) {
		// 	// 		return value[resource.child_key];
		// 	// 	} else {
		// 	// 		return value;
		// 	// 	}
		// 	// }
		// },

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
					return inheritedValue[resource.child_key];
				} else {
					return inheritedValue;
				}
			}
		},
		// setOriginal: function(value) {
		// 	if (resource.key && this.originalValue !== value) {
		// 		this.originalValue = value;
		// 		if (this.modifiedValue === undefined) {
		// 			this.update();
		// 		}
		// 		if (this.modifiedValue === value) {
		// 			this.modifiedValue = undefined;
		// 		}
		// 		this.modify();
		// 	}
		// },

		// update: function() {
		// 	if (this.onUpdate) {
		// 		this.onUpdate(this.get());
		// 	}
		// 	this.children.forEach(function(child) {
		// 		child.update();
		// 	});
		// },
		// modify: function() {
		// 	if (this.onModify) {
		// 		this.onModify(this.get() !== this.getOriginal());
		// 	}
		// 	this.children.forEach(function(child) {
		// 		child.modify();
		// 	});
		// },
		// updateDefault: function() {
		// 	if (this.onDefault) {
		// 		this.onDefault(this.getDefault());
		// 	}
		// 	this.children.forEach(function(child) {
		// 		child.updateDefault();
		// 	});
		// },
		// getDefault: function() {
		// 	if (resource.key) {
		// 		return this.defaultValue;
		// 	} else if (this.parent) {
		// 		var inheritedValue = this.parent.getDefault();
		// 		if (resource.child_key) {
		// 			return inheritedValue[resource.child_key];
		// 		} else {
		// 			return inheritedValue;
		// 		}
		// 	}
		// },
		// setDefault: function(value) {
		// 	if (resource.key && this.defaultValue !== value) {
		// 		this.defaultValue = value;
		// 		this.updateDefault();
		// 	}
		// },

		updateDefault: function(value) {
			// if (resource.key && this.defaultValue !== value) {
			// 	this.defaultValue = value;
			// 	this.updateDefault();
			// }
			this.children.forEach(function(child) {
				if (child.resource.child_key) {
					child.changeDefault(value[child.resource.child_key]);
				} else {
					child.changeDefault(value);
				}
			});
			if (this.onDefault) {
				this.onDefault(value);
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


				// console.log(this.post);
				// var value = KarmaFieldMedia.cache.getItem(path);
				var historyIndex = this.table.history.index || "0";
				var dbIndex = this.table.history.dbIndex;



				// var value = this.getCache(this.post.uri);
				var uri = this.post.uri || this.post.pseudo_uri;
				var value = this.table.pool.get(historyIndex, uri, resource.key, resource.type);

				if (value !== undefined) {
					this.originalValue = this.table.pool.get(dbIndex, uri, resource.key, resource.type);
					this.change(value);
					// this.setOriginal(value);
				} else if (this.post[resource.key] !== undefined) {
					// this.setOriginal(this.post[resource.key]);
					// this.updateCache(this.post.uri, this.post[resource.key], historyIndex);
					this.originalValue = this.post[resource.key];
					this.change(this.post[resource.key]);
					this.table.pool.setAt(this.originalValue, historyIndex, uri, resource.key, resource.type);

					// this.updatePool(historyIndex);
				} else if (this.post.uri) {
					var path = manager.table.resource.middleware+"/"+this.post.uri+"/"+resource.key;
					this.query(path).then(function(value) {
						// manager.setOriginal(value);
						// manager.updateCache(manager.post.uri, value, historyIndex);
						manager.originalValue = value;
						manager.change(value);
						// manager.updatePool(historyIndex);
						manager.table.pool.setAt(value, historyIndex, uri, resource.key, resource.type);
					});
				} else {
					this.originalValue = resource.default;
				}
				if (this.post.default_uri) {
					var defaultPath = this.table.resource.middleware+"/"+this.post.default_uri+"/"+resource.key;
					// var defaultValue = KarmaFieldMedia.cache.getItem(defaultPath);
					// var defaultValue = this.getCache(this.post.default_uri, historyIndex);
					var defaultValue = this.table.pool.get(historyIndex, this.post.default_uri, resource.key, resource.type);

					if (defaultValue !== null) {
						// this.setDefault(defaultValue);
						this.updateDefault(defaultValue);
					} else {
						this.query(defaultPath).then(function(value) {
							// manager.setDefault(value);

							manager.updateDefault(value);
							// manager.updateCache(manager.post.default_uri, value, historyIndex);
							manager.table.pool.setAt(defaultValue, historyIndex, this.post.default_uri, resource.key, resource.type);

							// if (resource.type === "json") {
							// 	value = JSON.stringify(value);
							// }
							// KarmaFieldMedia.cache.setItem(defaultPath, value);
						});
					}
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
	manager.post = post;
	manager.table = table;
	manager.parent = parent;

	manager.id = table.middleware + "/" + (post.uri.split("/").join("-") || post.pseudo_uri) + "-" + (resource.key || resource.child_key || "group");

	return manager;
}
