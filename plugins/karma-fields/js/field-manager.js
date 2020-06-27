
KarmaFieldMedia.managers.field = function(resource) {
	var manager = {
		resource: resource,
		post: null,
		parent: null,
		table: null,
		build: function() {
			if (KarmaFieldMedia.fields[resource.name || "group"]) {
				this.element = KarmaFieldMedia.fields[resource.name || "group"](this);
				return this.element;
			}
		},
		getChildren: function() {
			return (resource.children || []).map(function(resource) {
				var child = KarmaFieldMedia.managers.field(resource);
				child.table = manager.table;
				child.post = manager.post;
				child.parent = manager;
				return child;
			});
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
		update: function(value) {
			return this.original().then(function(originalValue) {
				if (value === originalValue) {
					manager.modifiedValue = undefined;
				} else {
					manager.modifiedValue = value;
				}
				if (manager.onUpdate) {
					manager.onUpdate();
				}
				if (manager.table.renderFooter) {
					manager.table.renderFooter();
				}
				return manager.modifiedValue;
			});
		},
		// modified: function() {
		// 	return this.original().then(function(originalValue) {
		// 		if (originalValue === manager.currentValue) {
		// 			return undefined;
		// 		} else {
		// 			return manager.currentValue;
		// 		}
		// 	});
		// },
		original: function() {
			if (resource.key) {
				if (resource.type) {
					if (!this.originalValue) {
						if (this.post[resource.key] !== undefined) {
							this.originalValue = Promise.resolve(this.post[resource.key]);
						} else if (this.post.uri) {
							var file = this.table.resource.middleware+"/"+this.post.uri+"/"+resource.key;
							this.originalValue = this.query(file).then(function(value) {
								return value;
							});
						} else {
							this.originalValue = Promise.resolve(undefined);
							// this.originalValue = Promise.reject(new Error("Karma Fields field manager error: no uri"));
						}
					}
					return this.originalValue;
				} else if (this.parent) {
					return this.parent.original().then(function(result) {
						return result[resource.key];
					});
				} else {
					return Promise.reject(new Error("Karma Fields field manager Error: no type and no parent"));
				}
			} else if (this.parent) {
				return this.parent.original();
			} else {
				return Promise.reject(new Error("Karma Fields field manager Error: no key and no parent"));
			}
		},
		// original: function() {
		// 	if (this.originalValue !== undefined) {
		// 		return Promise.resolve(this.originalValue);
		// 	} else if (resource.key && this.post[resource.key] !== undefined) {
		// 		this.originalValue = this.post[resource.key];
		// 		return Promise.resolve(this.post[resource.key]);
		// 	} else if (this.post.uri) {
		// 		return this.request(this.post.uri).then(function(value) {
		// 			manager.originalValue = value;
		// 			return value;
		// 		});
		// 	} else {
		// 		return Promise.reject(new Error("Karma Fields field error: uri not found"));
		// 	}
		// },
		value: function() {
			if (this.modifiedValue !== undefined) {
				return Promise.resolve(this.modifiedValue);
			} else {
				return this.original();
			}
			// var uri = this.post.uri;
			// var key = resource.key;
			//
			// if (uri && key) {
			// 	if (this.currentValue !== undefined) {
			// 		return Promise.resolve(this.currentValue);
			// 	// if (this.table.hasChange(uri, key)) {
			// 	// 	return Promise.resolve(this.table.getChange(uri, key));
			// 	// }
			// 	// if (this.currentValue !== undefined) {
			// 	// 	return Promise.resolve(this.currentValue);
			// 	// } else {
			// 	// 	return this.original();
			// 	// }
			// 	} else if (this.originalValue !== undefined) {
			// 		return Promise.resolve(this.originalValue);
			// 	} else if (this.post[key] !== undefined) {
			// 		this.originalValue = this.post[key];
			// 		return Promise.resolve(this.post[key]);
			// 	} else {
			// 		return this.request(uri, key).then(function(value) {
			// 			manager.originalValue = value;
			// 			return value;
			// 		});
			// 	}
			// } else {
			// 	return Promise.reject(new Error("Karma Fields field manager error: uri or key not found"));
			// }
			// else if (resource.key && this.post[resource.key] !== undefined) {
			// 	this.originalValue = this.post[resource.key];
			// 	return Promise.resolve(this.post[resource.key]);
			// } else if (this.post.uri) {
			// 	return this.request(this.post.uri).then(function(value) {
			// 		manager.originalValue = value;
			// 		return value;
			// 	});
			// } else {
			// 	return Promise.reject(new Error("Karma Fields field error: uri not found"));
			// }
		},
		default: function() {
			if (this.post.default_uri && (resource.key && resource.type || this.parent)) {
				if (resource.key) {
					if (resource.type) {
						var file = this.table.resource.middleware+"/"+uri+"/"+resource.key;
						return this.query(file);
					} else if (this.parent) {
						return this.parent.default().then(function(result) {
							return result[resource.key];
						});
					}
				} else if (this.parent) {
					return this.parent.default();
				}
			} else {
				return Promise.resolve("");
			}
		},
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

			var cache = KarmaFieldMedia.cache.query(url);
			if (cache) {
				// manager.format(cache).then(console.log)
				// return manager.format(cache);
				return Promise.resolve(cache);
			}

			return fetch(url, {
				cache: "reload"
			}).then(function(response) {
				var results = manager.format(response);
				KarmaFieldMedia.cache.put(url, results);
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
