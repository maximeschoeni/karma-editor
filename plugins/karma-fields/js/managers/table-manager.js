KarmaFields.managers.table = function(resource) {
	// var history = KarmaFields.managers.history(resource.driver || resource.middleware);
	var history = KarmaFields.History.createInstance();

	var manager = {
		resource: resource,
		posts: [], // -> moved to history
		select: KarmaFields.selectors.grid(),
		filter: null, // deprecated
		filters: {},
		fields: [],
		options: {},
		changes: {},

		table: null, // -> for accesding filters

		    // search: "",
    order: null,
    orderby: null,
    page: 1,
    ppp: resource.ppp || 10,

		build: function() {
			if (KarmaFields.tables[resource.name || "grid"]) {
				return KarmaFields.tables[resource.name || "grid"](this);
			}
		},
		buildFilter: function() {
			if (resource.filter) {
				var filter = KarmaFields.managers.filter(resource.filter, this, (resource.driver || resource.middleware));
				// filter.onBubble = function() {
				// 	manager.options.page = 1;
				// 	return manager.request();
				// }
				return filter.buildNode();
			}
		},

		buildFooter: function() {
			return KarmaFields.tables.footer(this);
		},
		// buildOptions: function() {
		// 	var field = KarmaFields.managers.field(this.resource.options, {
		// 		pseudo_uri: "options"
		// 	}, "posts", history);
		//
		// 	field.onBubble = function(key, value) {
		// 		manager.options[key] = value;
		// 	}
		// 	field.onSubmit = function() {
		// 		manager.request();
		// 	}
		// 	return field;
		// },

		// addRow: function(item, index) {
		// },

		getItems: function() {
			return history.read(["items"] || []);
			// return history.posts.filter(function(item) {
			// 	// var action = history.pool.get(history.index, item.uri || item.pseudo_uri, "action");
			// 	var action = history.get(item.uri || item.pseudo_uri, "action");
			// 	return action !== "remove" && action !== "cancel";
			// });
		},

		// getParams: function() {
		// 	var params = {};
		//
		// 	for (var i in this.filters) {
		// 		params[i] = this.filters[i];
		// 	}
		//
		// 	for (var i in this.options) {
		// 		params[i] = this.options[i];
		// 	}
		//
		// 	// this.getOptionsFilter(resource.options, params); // -> find key/values in options that we have to send as filter
		//
		//
		//
		// 	// if (this.page > 1) {
		// 	// 	params.page = this.page;
		// 	// }
		//
		//
		// 	// if (this.ppp || resource.ppp) {
		// 	// 	params.ppp = (this.ppp || resource.ppp);
		// 	// }
		// 	// if (this.options.gridoptions.ppp) {
		// 	// 	params.ppp = this.options.gridoptions.ppp;
		// 	// }
		// 	// if (this.order || resource.default_order) {
		// 	// 	params.order = (this.order || resource.default_order);
		// 	// }
		// 	// if (this.orderby || resource.default_orderby) {
		// 	// 	params.orderby = (this.orderby || resource.default_orderby);
		// 	// }
		// 	return params;
		// },
		request: function() {
			if (resource.driver || resource.middleware) {
				var file = KarmaFields.queryURL+"/"+(resource.driver || resource.middleware)+"/"+resource.method;
				var options = history.read(["options"]);
				var filters = history.read(["filters"]);
				var params = KarmaFields.Object.serialize(KarmaFields.Object.merge(options, filters));
				if (params) {
					file += "?"+params.join("&");
				}
				this.loading = true;
				if (this.renderFooter) {
					this.renderFooter();
				}
        return fetch(file, {
					cache: "default" // force-cache
				}).then(function(response) {
					return response.json();
				}).then(function(results) {
					console.log(results);
					history.write(["items"], results.items.map(function(item) {
						history.write(["field", item.uri], item, "input");
						return item.uri;
					}), "input");
					// manager.num = parseInt(results.count);
					history.write(["count"], parseInt(results.count), "input");
					manager.loading = false;
          if (manager.render) {
            manager.render();
          }
          return results;
        });
			} else {
				return Promise.reject(new Error("Table Manager error: no resource driver or middleware"));
			}
		},

		// // deprecated
		// query: function(url, params, noCache) {
		// 	return fetch(url, {
		// 		cache: "default" // force-cache
		// 	}).then(function(response) {
		// 		return response.json();
		// 	});
		// },


		reorder: function(key, default_order) {
			var options = history.read(["options"]);
			if (options.orderby === key) {
				if (options.order === "asc") {
					options.order = "desc";
				} else {
					options.order = "asc";
				}
			} else {
				options.orderby = key;
				options.order = default_order || "asc";
			}
			options.page = 1;
			history.write(["options"], options, true);
			this.request();
		},


		// // deprecated
		// getChanges: function() {
		// 	// return history.pool.get(history.index);
		//
		// 	return this.fields.reduce(function(obj, field) {
		// 		var uri = field.post.uri || field.post.pseudo_uri;
		// 		if (uri && field.resource.key && field.modified) {
		// 			if (!obj[uri]) {
		// 				obj[uri] = {};
		// 			}
		// 			obj[uri][field.resource.key] = field.get();
		// 		}
		// 		return obj;
		// 	}, history.posts.reduce(function(obj, item) {
		// 		var uri = item.uri || item.pseudo_uri;
		// 		var action = history.get(uri, "action");
		// 		if (action) {
		// 			if (!obj[uri]) {
		// 				obj[uri] = {};
		// 			}
		// 			obj[uri].action = action;
		// 		}
		// 		return obj;
		// 	}, {}));
		// },
		// addChange: function(post, driver, key, value) {
		// 	if (!this.changes[post.uri || post.pseudo_uri]) {
		// 		this.changes[post.uri || post.pseudo_uri] = {};
		// 	}
		// 	if (!this.changes[post.uri || post.pseudo_uri][driver]) {
		// 		this.changes[post.uri || post.pseudo_uri][driver] = {};
		// 	}
		// 	this.changes[post.uri || post.pseudo_uri][driver][key] = value;
		//
		// 	// console.log(post, key, value, this.changes);
		// },
		// addAction: function(post, value) {
		// 	if (!this.changes[post.uri || post.pseudo_uri]) {
		// 		this.changes[post.uri || post.pseudo_uri] = {
		// 			value: {},
		// 			action: value
		// 		};
		// 	} else if (value === "cancel") {
		// 		this.changes[post.uri || post.pseudo_uri] = undefined;
		// 	} else {
		// 		this.changes[post.uri || post.pseudo_uri].action = value;
		// 	}
		// 	// if (!this.changes[post.uri || post.pseudo_uri].action) {
		// 	// 	this.changes[post.uri || post.pseudo_uri].action = {};
		// 	// }
		// 	// this.changes[post.uri || post.pseudo_uri].action = value;
		// },
		// addChange: function(post, driver, key, value) {
		// 	if (!this.changes[post.uri || post.pseudo_uri]) {
		// 		this.changes[post.uri || post.pseudo_uri] = {
		// 			value: {},
		// 			action: "update"
		// 		};
		// 	}
		// 	// if (!this.changes[post.uri || post.pseudo_uri].value) {
		// 	// 	this.changes[post.uri || post.pseudo_uri].value = {};
		// 	// }
		// 	if (!this.changes[post.uri || post.pseudo_uri].value[driver]) {
		// 		this.changes[post.uri || post.pseudo_uri].value[driver] = {};
		// 	}
		// 	this.changes[post.uri || post.pseudo_uri].value[driver][key] = value;
		// },
		// add, delete, save fields
		sync: function() {
			var options = history.read(["options"]);
			var filters = history.read(["filters"]);
			var params = Object.merge(options, filters);
			var params = Object.merge(params, history.buffer);

			this.loading = true;
			this.renderFooter();
			return fetch(KarmaFields.saveURL+"/"+(resource.driver || resource.middleware)+"/"+resource.method, {
				method: "post",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(params),
				mode: "same-origin"
			}).then(function(response) {
				return response.json();
			}).then(function(results) {
				history.write(["items"], results.items.map(function(item) {
					history.write(["field", item.uri], item, "input");
					return item.uri;
				}), "input");
				history.write(["count"], parseInt(results.count), "input");

				history.buffer = {};
				manager.loading = false;
				manager.num = parseInt(results.count);
				if (manager.render) {
					manager.render();
				}
			});
		},
		addItem: function() {
			var options = history.read(["options"]);
			var filters = history.read(["filters"]);
			var params = Object.merge(options, filters);
			this.loading = true;
			this.renderFooter();
			return fetch(KarmaFields.addURL+"/"+(resource.driver || resource.middleware)+"/"+resource.method, {
				method: "post",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(params),
				mode: "same-origin"
			}).then(function(response) {
				return response.json();
			}).then(function(results) {
				history.write(["items"], results.items.map(function(item) {
					history.write(["field", item.uri], item, "input");
					return item.uri;
				}), "input");
				history.write(["count"], parseInt(results.count), "input");

				manager.loading = false;
				manager.num = parseInt(results.count);
				if (manager.render) {
					manager.render();
				}
			});

			//
			//
			// history.posts.push(post);
			//
			//
			//
			//
			// if (manager.render) {
			// 	manager.render();
			// }
			//
			// this.select.select(0, history.posts.length-1, this.select.width, 1);
			//
			// var cells = this.select.getSelectedCells();
			// if (cells.length && cells[0].field && cells[0].field.onFocus) {
			// 	cells[0].field.onFocus();
			// }
			//
			// if (manager.renderFooter) {
			// 	manager.renderFooter();
			// }


		},
		// removeItems: function(items) {
		// 	history.save();
		// 	items.forEach(function(item) {
		// 		if (item.uri) {
		// 			// manager.pool.setAt("remove", manager.history.index, item.uri, "action");
		// 			history.set(item.uri, "action", "remove");
		// 		} else if (item.pseudo_uri) {
		// 			// manager.pool.setAt("cancel", manager.history.index, item.pseudo_uri, "action");
		// 			history.set(item.pseudo_uri, "action", "cancel");
		// 		}
		// 	});
		// 	this.render();
		// 	this.renderFooter();
		// },
		removeItems: function(rows) {
			var items = history.read(["items", "items"]);
			rows.forEach(function(index) {
				history.write(["field", "uri", items[index]], "output");
			});
			this.render();
			// history.save();
			// var items = this.getItems();
			// rows.forEach(function(index) {
			// 	var item = items[index];
			// 	if (item) {
			// 		if (item.uri) {
			// 			// manager.pool.setAt("remove", manager.history.index, item.uri, "action");
			// 			history.set(item.uri, "action", "remove");
			// 			manager.addAction(item, "remove");
			//
			// 		} else if (item.pseudo_uri) {
			// 			// manager.pool.setAt("cancel", manager.history.index, item.pseudo_uri, "action");
			// 			history.set(item.pseudo_uri, "action", "cancel");
			// 			manager.addAction(item, "cancel");
			// 		}
			// 	}
			// });
			// this.render();
			// this.renderFooter();
		},
		getDefaultFilters: function(resource, params) {
			if (!params) {
				params = {};
			}
			if (resource.key && resource.default) {
				params[resource.key] = resource.default;
			}
			if (resource.children) {
				for (var i = 0; i < resource.children.length; i++) {
					this.getDefaultFilters(resource.children[i], params);
				}
			}
			return params;
		},
		getDefaultOptions: function(resource, params) {
			if (!params) {
				params = {};
			}
			if (resource.key && resource.default) {
				params[resource.key] = resource.default;
			}
			if (resource.children) {
				for (var i = 0; i < resource.children.length; i++) {
					this.getDefaultOptions(resource.children[i], params);
				}
			}
			return params;
		},
		// getOptionsFilter: function(resource, params) {
		// 	if (!params) {
		// 		params = {};
		// 	}
		// 	// console.log(resource.filter_key, resource);
		// 	if (resource.filter_key) {
		// 		params[resource.filter_key] = this.options.gridoptions[resource.filter_key];
		// 	}
		// 	if (resource.children) {
		// 		for (var i = 0; i < resource.children.length; i++) {
		// 			this.getOptionsFilter(resource.children[i], params);
		// 		}
		// 	}
		// 	return params;
		// }
	};
	// if (!resource.middleware) {
	// 	console.error("Middleware is missing");
	// }
	KarmaFields.events.onSelectAll = function(event) {
		if (document.activeElement === document.body) {
			manager.select.onSelectAll(event);
			event.preventDefault();
		}
	};
	KarmaFields.events.onAdd = function(event) {
		if (document.activeElement === document.body) {
			manager.addItem();
			event.preventDefault();
		}
	};
	KarmaFields.events.onDelete = function(event) {
		var items = manager.select.getSelectedItems();
		if (items.length) {
			manager.removeItems(items);
			event.preventDefault();
		}
	};

	KarmaFields.events.onCopy = function(event) {
		manager.select.onCopy(event);
	}
	KarmaFields.events.onPast = function(event) {
		manager.select.onPast(event);
	}

	KarmaFields.events.onSave = function(event) {
		manager.sync();
		event.preventDefault();
	}
	KarmaFields.events.onUndo = function(event) {
		history.undo();
		event.preventDefault();
	}
	KarmaFields.events.onRedo = function(event) {
		history.redo();
		event.preventDefault();
	}
	// history.onUpdate = function() {
	// 	//
	// 	// manager.fields.forEach(function(field) {
	// 	// 	field.fetch();
	// 	// });
	//
	// 	// manager.fields.forEach(function(field) {
	// 	// 	field.update();
	// 	// });
	//
	// 	if (manager.renderOptions) {
	// 		manager.renderOptions();
	// 	}
	// 	manager.render();
	// 	manager.renderFooter();
	// }
	manager.history = history;

	// manager.optionsField = KarmaFields.managers.field(manager.resource.options, manager.options);


	if (resource.filter) {
		var filters = manager.getDefaultFilters(resource.filter);
		history.write(["filters"], filters, "input");
	}
	if (resource.options) {
		var options = manager.getDefaultOptions(resource.options);
		history.write(["options"], options, "input");
	}

	return manager;
}
