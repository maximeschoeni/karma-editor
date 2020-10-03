
KarmaFields.managers.filter = function(resource, history, parent) {
	var manager = {
		resource: resource,
		// table: table,
		parent: parent,
		// value: resource.value || resource.default,
		children: [],
		// params: {},
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
			return {
				class: "karma-filter",
				init: function(element, update) {
					if (resource.width) {
						element.style.flexBasis = resource.width;
					}
				},
				children: [
					KarmaFields.filters[resource.name](manager),
					{
						class: "karma-filter-children",
						init: function(element, update) {
							manager.onRenderChildren = update;
						},
						children: resource.children && resource.children.map(function(childResource) {
							var child = KarmaFields.managers.filter(childResource, history, manager);
							return child.buildNode();
						})
					}
				]
			};
		},



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
		// bubble: function(params) {
		// 	if (this.onBubble) {
		// 		return this.onBubble();
		// 	} else if (parent) {
		// 		return parent.bubble();
		// 	} else {
		// 		return Promise.resolve();
		// 	}
		// },
		// set: function(value) {
		// 	if (resource.key) {
		// 		table.filters = parent.getAncestorParams();
		// 		table.filters[resource.key] = value || undefined;
		// 		return this.bubble().then(function() {
		// 			// if (table.renderHeader) {
		// 			// 	table.renderHeader();
		// 			// }
		// 			if (manager.onRenderChildren) {
		// 				manager.onRenderChildren();
		// 			}
		// 		});
		// 	}
		// },
		setValue: function(value) {
			history.write(["filters", resource.key], value, "input");
		},
		getValue: function() {
			history.read(["filters", resource.key]);
			// if (resource.key) {
			// 	return table.filters[resource.key];
			// }
		}

	};

	// if (manager.value) {
	// 	manager.setParam(manager.resource.key, manager.value);
	// }


	return manager;
}
