
KarmaFieldMedia.managers.field = function(tableManager, resource, post, parent) {
	var manager = {
		resource: resource,
		post: post,
		parent: parent,
		build: function() {
			if (KarmaFieldMedia.fields[resource.name || "group"]) {
				this.element = KarmaFieldMedia.fields[resource.name || "group"](this);
				return this.element;
			}
		},
		getChildren: function() {
			return (resource.children || []).map(function(resource) {
				return KarmaFieldMedia.managers.field(tableManager.resource.middleware, resource, post, manager);
			});
		},
		getRoot: function() {
			return parent && parent.getRoot() || this;
		},
		loadValue: function() {
			if (resource.key && post[resource.key] !== undefined) {
				manager.value = post[resource.key];
				return Promise.resolve(manager.value);
			} else if (post.uri) {
				return this.request(post.uri).then(function(value) {
					manager.value = value;
					return value;
				});
			} else {
				return Promise.reject(new Error("Field ("+resource.key+") cannot get value: no uri"));
			}

			// if (resource.key) {
			// 	if (resource.object) {
			// 		var postURI = post[resource.locator || "uri"];
			// 		if (postURI) {
			// 			var file = postURI+"/"+resource.key+"."+(resource.extension || "json");
			// 			return this.query(file);
			// 		} else {
			// 			return Promise.reject(new Error("Field ("+resource.key+") cannot get value: no postURI"));
			// 		}
			// 	} else if (parent) {
			// 		return parent.value().then(function(result) {
			// 			return result[resource.key];
			// 		});
			// 	} else {
			// 		return Promise.reject(new Error("Field ("+resource.key+") cannot get value: no object and no parent"));
			// 	}
			// } else {
			// 	return Promise.reject(new Error("Field Manager cannot get value: no key"));
			// }
		},
		default: function() {
			if (post.default_uri) {
				return this.request(post.default_uri);
			} else {
				return Promise.resolve("");
			}
			// if (resource.key) {
			// 	if (resource.object) {
			// 		if (resource.default_locator) {
			// 			var postURI = post[resource.default_locator];
			// 			if (postURI) {
			// 				var file = postURI+"/"+resource.key+"."+(resource.extension || "json");
			// 				return this.query(file);
			// 			} else {
			// 				return Promise.reject(new Error("Field ("+resource.key+") cannot get default: no postURI"));
			// 			}
			// 		} else {
			// 			return Promise.resolve(resource.default || "");
			// 		}
			// 	} else if (parent) {
			// 		return parent.default().then(function(result) {
			// 			return result[key || field.key];
			// 		});
			// 	} else {
			// 		return Promise.reject(new Error("Field ("+resource.key+") cannot get default: no object and no parent"));
			// 	}
			// } else {
			// 	return Promise.reject(new Error("Field Manager cannot get default: no key"));
			// }
		},
		request: function(uri) {
			if (resource.key) {
				if (resource.type) {
					var file = tableManager.resource.middleware+"/"+uri+"/"+resource.key;
					return this.query(file);
				} else if (parent) {
					return parent.request(uri).then(function(result) {
						return result[resource.key];
					});
				} else {
					return Promise.reject(new Error("Karma Fields Get Error: no type and no parent"));
				}
			} else if (parent) {
				return parent.request(uri).then(function(result) {
					return result;
				});
			} else {
				return Promise.reject(new Error("Karma Fields Get Error: no key and no parent"));
			}
		},
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

			// KarmaFieldMedia.cache.match(url).then(function(response) {
			// 	if (!response) {
			// 		return fetch(url, {
			// 			cache: "reload"
			// 		}).then(function(response) {
			// 			KarmaFieldMedia.cache.put(url, response);
			// 		});
			// 	}
			// 	return response;
			// }).then(function(response) {
			// 	return manager.format(response);
			// });


			// var promise = KarmaFieldMedia.cache.query(file);
			// if (!promise) {
			// 	var url = KarmaFields.queryPostURL+"/"+file;
			// 	// var isJson = file.slice(-5) === ".json"; // file.endsWith(".json")
			// 	// promise = fetch(url, {
			// 	// 	cache: "reload"
			// 	// }).then(function(response) {
			// 	// 	if (isJson) {
			// 	// 		return response.json();
			// 	// 	} else {
			// 	// 		return response.text();
			// 	// 	}
			// 	// }).then(function(value) {
			// 	// 	if (isJson && typeof value !== "object") {
			// 	// 		value = {};
			// 	// 	}
			// 	// 	return value;
			// 	// });
			// 	promise = KarmaFieldMedia.cache.query(file) || fetch(KarmaFields.queryPostURL+"/"+file, {
			// 		cache: "reload"
			// 	}).then(function(response) {
			// 		return manager.format(response);
			// 	});
			// 	KarmaFieldMedia.cache.add(file, promise);
			// }
			// return promise;
		},
		update: function(file, value) {
			KarmaFieldMedia.cache.put(KarmaFields.getURL+"/"+file, value);
			return fetch(KarmaFields.saveURL+"/"+file, {
				method: "post",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					value: value
				}),
				mode: "same-origin"
			}).then(function(response) {
				return response.json();
			});
		},
		save: function(value) {
			manager.value = value;
			if (resource.key) {
				if (resource.type) {
					var uri = post[resource.locator || "uri"];
					if (uri) {
						var file = tableManager.resource.middleware+"/"+uri+"/"+resource.key;
						if (post[resource.key]) {
							post[resource.key] = value;
						}
						return this.update(file, value).then(function() {
							// -> update related filter
							if (tableManager.filter) {
								tableManager.filter.updateDescendant(resource.key);
								//tableManager.filter.renderNode();
							}

							// if (tableManager.filters[resource.key]) {
							// 	tableManager.filters[resource.key].update(true);
							// }
						});
					} else {
						return Promise.reject(new Error("Karma Fields Saving Error: no postURI"));
					}
				} else if (parent) {
					return parent.value().then(function(result) {
						result[resource.key] = value;
						return parent.save(result);
					});
				} else {
					return Promise.reject(new Error("Field ("+resource.key+") cannot save: no object and no parent"));
				}
			} else if (parent) {
				return parent.save(value);
			} else {
				return Promise.reject(new Error("Field Manager cannot save: no key and no parent"));
			}
		}
	};
	// resource.children.forEach(function(resource) {
	// 	var child = KarmaFieldMedia.createFieldManager(resource, post, parent);
	// 	manager.children.push(child);
	// });
	return manager;
}
