
KarmaFields.managers.filter = function(resource, table, middleware, parent) {
	var manager = {
		resource: resource,
		table: table,
		parent: parent,
		// value: resource.value || resource.default,
		children: [],
		params: {},
		// build: function() {
		// 	if (resource.name) {
	  //     if (KarmaFields.filters[resource.name]) {
	  //       return KarmaFields.filters[resource.name](this);
	  //     } else {
	  //       console.error("Karma Fields filter manager error: filter not found");
	  //     }
		// 	}
    // },
		buildNode: function() {
			return KarmaFields.build({
				class: "karma-filter",
				init: function(element, update) {
					if (resource.width) {
						element.style.flexBasis = resource.width;
					}
					manager.renderNode = update;
					update();
				},
				children: function() {
					return [
						KarmaFields.filters[resource.name](manager),
						KarmaFields.build({
							class: "karma-filter-children",
							init: function(element, update) {
								manager.onRenderChildren = update;
								update();
							},
							children: function() {
								if (resource.children) {
									return resource.children.map(function(childResource) {
										var child = KarmaFields.managers.filter(childResource, table, middleware, manager);
										return child.buildNode();
									});
								}
							}
						})
					];
					// .concat(manager.getChildren().map(function(child) {
					// 	return child.buildNode();
					// }));
				}
			});
		},

		// getChildren: function() {
		// 	return (resource.children || []).map(function(subResource) {
		// 		var child = KarmaFields.managers.filter(subResource);
		// 		child.table = manager.table;
		// 		child.parent = manager;
		// 		manager.children.push(child);
		// 		return child;
		// 	});
		// },
		// getDescendants: function() {
		// 	// if (!filters) {
		// 	// 	filters = [];
		// 	// }
		// 	// filters.push(this);
		// 	// for (var i = 0; i < this.children.length; i++) {
		// 	// 	this.children[i].getDescendants(filters);
		// 	// }
		// 	// return filters;
		// 	var filters = [this];
		// 	for (var i = 0; i < this.children.length; i++) {
		// 		filters = filters.concat(this.children[i].getDescendants());
		// 	}
		// 	return filters;
		// },
		// build: function() {
		// 	return KarmaFields.build({
		// 		class: "filter-node",
		// 		child: function() {
		// 			if (resource.name) {
		// 				var builder = KarmaFields.filters[resource.name];
		// 	      if (builder) {
		// 	        return builder(this, resource);
		// 	      } else {
		// 	        console.error("Karma Fields filter manager error: filter not found");
		// 	      }
		// 			}
		// 		},
		// 		children: function() {
		// 			return filter.children && filter.children.map(function(child) {
		// 				var filterManager = KarmaFields.managers.filter(tableManager, child, manager);
		// 				tableManager.filters[filter.key] = filterManager;
		// 				return filterManager.build();
		// 			});
		// 		}
		// 	})
		// },
		// getParam: function() {
		// 	// if (resource.key) {
		// 	// 	// return "filter-"+resource.key+"="+this.value;
		// 	// 	return {
		// 	// 		key: "filter-"+resource.key,
		// 	// 		value: this.value
		// 	// 	};
		// 	// } else {
		// 	// 	// return "search="+this.value;
		// 	// 	return {
		// 	// 		key: "search",
		// 	// 		value: this.value
		// 	// 	};
		// 	// }
		// 	return {
		// 		key: resource.key,
		// 		value: this.value
		// 	};
		// },
		// getAncestorParams: function() {
		// 	var params;
		// 	if (this.parent) {
		// 		params = this.parent.getAncestorParams();
		// 		if (this.parent.value && this.parent.resource.key) {
		// 			params[this.parent.resource.key] = this.parent.value;
		// 		}
		// 	} else {
		// 		params = {};
		// 	}
		// 	return params;
		// },

		getAncestorParams: function() {
			var params;
			if (parent) {
				params = parent.getAncestorParams();
			} else {
				params = {};
			}
			if (resource.key) {
				var value = table.filters[resource.key];
				if (value) {
					params[resource.key] = encodeURIComponent(value);
				}
			}
			return params;
		},

		// getAncestorParams: function(params) {
		// 	if (!params) {
		// 		params = {};
		// 	}
		// 	if (this.parent) {
		// 		this.parent.getAncestorParams(params);
		// 		if (this.parent.value && this.parent.resource.key) {
		// 			params[this.parent.resource.key] = this.parent.value;
		// 		}
		// 	}
		// 	return params;
		// },
		// getDescendantParams: function() {
		// 	var params = [];
		// 	if (this.value) {
		// 		params.push(this.getParam());
		// 	}
		// 	for (var i = 0; i < this.children.length; i++) {
		// 		params = params.concat(this.children[i].getDescendantParams());
		// 	}
		// 	return params;
		// },
		// getDescendantParams: function(params) {
		// 	return this.getDescendants().reduce(function(obj, filter) {
		// 		obj[filter.resource.key || "search"] = filter.value;
		// 	}, {});
		// },
		// getDescendantParams: function(params) {
		// 	if (!params) {
		// 		params = {};
		// 	}
		// 	if (this.value) {
		// 		params[resource.key] = this.value;
		// 	}
		// 	for (var i = 0; i < this.children.length; i++) {
		// 		this.children[i].getDescendantParams(params);
		// 	}
		// 	return params;
		// },
		// resetDescendants: function() {
		// 	for (var i = 0; i < this.children.length; i++) {
		// 		this.children[i].resetDescendants();
		// 	}
		// 	this.value = null;
		// },
    // requestOptions: function(noCache) {
    //   if (this.table.resource.middleware) {
		// 		if (resource.key) {
		// 			var file = KarmaFields.filterURL+"/"+this.table.resource.middleware+"/"+resource.key;
		// 			// var params = tableManager.encodeFilters();
		// 			// var params = this.getAncestorParams();
		// 			var params = [];
		// 			var filters = this.getDescendantParams();
		// 			for (var key in filters) {
		// 				params.push(key+"="+filters[key]);
		// 			}
		//
		// 			return this.table.query(file, params, noCache);
		// 		} else {
		// 			return Promise.resolve();
		// 		}
    //   } else {
		// 		return Promise.reject(new Error("Karma Field request filters error: middleware not found"));
		// 	}
    // },
		fetch: function() {
      if (resource.driver || this.table.resource.middleware) {
				if (resource.key) {
					var file = KarmaFields.fetchURL+"/"+(resource.driver || this.table.resource.middleware)+"/"+resource.method+"/"+resource.key;
					if (parent) {
						var params = [];
						var filters = parent.getAncestorParams();
						for (var key in filters) {
							params.push(key+"="+filters[key]);
						}
						if (params.length) {
							file += "?"+params.join("&");
						}
					}
					return fetch(file, {
						cache: "default" // force-cache
					}).then(function(response) {
						return response.json();
					}).then(function(results) {
						manager.options = results.items;
						// if (manager.onFetch) {
						// 	manager.onFetch(results);
						// }
	          return results;
	        });

					// return this.table.query(file, params, noCache);
				} else {
					return Promise.resolve();
				}
      } else {
				return Promise.reject(new Error("Karma Field request filters error: driver or middleware not found"));
			}
    },
		// toggle: function(value) {
		// 	if (value == this.value) {
		// 		this.set();
		// 	} else {
		// 		this.set(value);
		// 	}
		// },
		// bubble: function(key, value, option) {
		// 	if (this.onBubble) {
		// 		this.params[key] = value;
		// 		return this.onBubble(this.params, option);
		// 	} else if (parent) {
		// 		return parent.bubble(key, value, option);
		// 	} else {
		// 		return Promise.resolve();
		// 	}
		// },
		// bubble: function(params) {
		// 	if (!params) {
		// 		params = {};
		// 	}
		// 	if (resource.key && this.value) {
		// 		params[resource.key] = this.value;
		// 	}
		// 	if (this.onBubble) {
		// 		return this.onBubble(params);
		// 	} else if (parent) {
		// 		return parent.bubble(params);
		// 	} else {
		// 		return Promise.resolve();
		// 	}
		// },
		bubble: function(params) {
			if (this.onBubble) {
				return this.onBubble();
			} else if (parent) {
				return parent.bubble();
			} else {
				return Promise.resolve();
			}
		},
		set: function(value) {
			if (resource.key) {
				table.filters = parent.getAncestorParams();
				table.filters[resource.key] = value || undefined;
				return this.bubble().then(function() {
					// if (table.renderHeader) {
					// 	table.renderHeader();
					// }
					if (manager.onRenderChildren) {
						manager.onRenderChildren();
					}
				});
			}
		},
		getValue: function() {
			if (resource.key) {
				return table.filters[resource.key];
			}
		}
		// setParam: function(key, value) {
		// 	if (parent) {
		// 		return parent.setParam(key, value);
		// 	} else {
		// 		this.params[key] = value;
		// 	}
		// },

		// request: function() {
		// 	tableManager.request();
		// 	// .then(function() {
		// 	// 	for (var key in tableManager.filters) {
		// 	// 		if (key !== resource.key) {
		// 	// 			tableManager.filters[key].update();
		// 	// 		}
		// 	// 	}
		// 	// });
		// },
		// update: function(noCache) {
		// 	return this.requestOptions(noCache).then(function(results) {
		// 		if (manager.render) {
		//
		// 			manager.options = results;
		// 			// fix filter selector getting wrong if current value no longer exist in presets
		// 			// if (manager.value && !results.find(function(result) {
		// 			// 	return result.value == manager.value;
		// 			// })) {
		// 			// 	results.push({
		// 			// 		value: manager.value,
		// 			// 		title: manager.value
		// 			// 	});
		// 			// }
		// 			manager.render();
		//
		// 		}
		// 	});
		// },
		// updateDescendant: function(key) {
		// 	if (resource.key === key) {
		// 		this.update();
		// 	} else {
		// 		for (var i = 0; i < this.children.length; i++) {
		// 			this.children[i].updateDescendant(key);
		// 		}
		// 	}
		//
		// }
	};

	// if (manager.value) {
	// 	manager.setParam(manager.resource.key, manager.value);
	// }


	return manager;
}
