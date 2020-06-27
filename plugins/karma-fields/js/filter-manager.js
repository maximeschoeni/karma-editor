
KarmaFieldMedia.managers.filter = function(resource) {
	var manager = {
		resource: resource,
		table: null,
		parent: null,
		value: resource.value,
		children: [],
		build: function() {
			if (resource.name) {
	      if (KarmaFieldMedia.filters[resource.name]) {
	        return KarmaFieldMedia.filters[resource.name](this);
	      } else {
	        console.error("Karma Fields filter manager error: filter not found");
	      }
			}
    },
		getChildren: function() {
			return (resource.children || []).map(function(subResource) {
				var child = KarmaFieldMedia.managers.filter(subResource);
				child.table = manager.table;
				child.parent = manager;
				manager.children.push(child);
				return child;
			});
		},
		// build: function() {
		// 	return build({
		// 		class: "filter-node",
		// 		child: function() {
		// 			if (resource.name) {
		// 				var builder = KarmaFieldMedia.filters[resource.name];
		// 	      if (builder) {
		// 	        return builder(this, resource);
		// 	      } else {
		// 	        console.error("Karma Fields filter manager error: filter not found");
		// 	      }
		// 			}
		// 		},
		// 		children: function() {
		// 			return filter.children && filter.children.map(function(child) {
		// 				var filterManager = KarmaFieldMedia.managers.filter(tableManager, child, manager);
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
		// 	if (this.parent) {
		// 		params = this.parent.getAncestorParams();
		// 		if (this.parent.value) {
		// 			params.push(this.parent.getParam());
		// 		}
		// 	} else {
		// 		params = [];
		// 	}
		// 	return params;
		// },
		getAncestorParams: function(params) {
			if (!params) {
				params = {};
			}
			if (this.parent) {
				this.parent.getAncestorParams(params);
				if (this.parent.value) {
					params[this.parent.resource.key || "search"] = this.parent.value;
				}
			}
			return params;
		},
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
		getDescendantParams: function(params) {
			if (!params) {
				params = {};
			}
			if (this.value) {
				params[resource.key || "search"] = this.value;
			}
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].getDescendantParams(params);
			}
			return params;
		},
		resetDescendants: function() {
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].resetDescendants();
			}
			this.value = null;
		},
    requestOptions: function(noCache) {
      if (this.table.resource.middleware) {
				if (resource.key) {
					var file = KarmaFields.filterURL+"/"+this.table.resource.middleware+"/"+resource.key;
					// var params = tableManager.encodeFilters();
					// var params = this.getAncestorParams();
					var params = [];
					var filters = this.getDescendantParams();
					for (var key in filters) {
						params.push(key+"="+filters[key]);
					}

					return this.table.query(file, params, noCache);
				} else {
					return Promise.resolve();
				}
      } else {
				return Promise.reject(new Error("Karma Field request filters error: middleware not found"));
			}
    },
		toggle: function(value) {
			if (value == this.value) {
				this.set();
			} else {
				this.set(value);
			}
		},
		set: function(value) {
			this.resetDescendants();
			this.value = value || "";
			this.table.page = 1;
			return this.table.request().then(function() {
				manager.children.forEach(function(child) {
					child.update();
				});
			});
		},
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
		update: function(noCache) {
			return this.requestOptions(noCache).then(function(results) {
				if (manager.render) {

					// fix filter selector getting wrong if current value no longer exist in presets
					// if (manager.value && !results.find(function(result) {
					// 	return result.value == manager.value;
					// })) {
					// 	results.push({
					// 		value: manager.value,
					// 		title: manager.value
					// 	});
					// }
					manager.render(results);

				}
			});
		},
		updateDescendant: function(key) {
			if (resource.key === key) {
				this.update();
			} else {
				for (var i = 0; i < this.children.length; i++) {
					this.children[i].updateDescendant(key);
				}
			}

		}
	};
	return manager;
}
