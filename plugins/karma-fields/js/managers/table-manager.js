KarmaFields.managers.table = function(resource) {
	var history = KarmaFields.managers.history(resource.middleware);
	var manager = {
		resource: resource,
		posts: [], // -> moved to history
		select: KarmaFields.selectors.grid(),
		filter: null, // deprecated
		filters: {},
		fields: [],
		options: {},
		changes: {},

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
				var filter = KarmaFields.managers.filter(resource.filter, this, resource.middleware);
				filter.onBubble = function() {
					manager.options.page = 1;
					return manager.request();
				}
				return filter.buildNode();
			}
		},

		buildFooter: function() {
			return KarmaFields.tables.footer(this);
		},
		buildOptions: function() {
			var field = KarmaFields.managers.field(this.resource.options, {
				pseudo_uri: "options"
			}, "posts", history);

			field.onBubble = function(key, value) {
				manager.options[key] = value;
			}
			field.onSubmit = function() {
				manager.request();
			}
			return field;
		},

		addRow: function(item, index) {
		},

		getItems: function() {

			return history.posts.filter(function(item) {
				// var action = history.pool.get(history.index, item.uri || item.pseudo_uri, "action");
				var action = history.get(item.uri || item.pseudo_uri, "action");
				return action !== "remove" && action !== "cancel";
			});
		},

		getParams: function() {
			var params = {};

			for (var i in this.filters) {
				params[i] = this.filters[i];
			}

			for (var i in this.options) {
				params[i] = this.options[i];
			}

			// this.getOptionsFilter(resource.options, params); // -> find key/values in options that we have to send as filter



			// if (this.page > 1) {
			// 	params.page = this.page;
			// }


			// if (this.ppp || resource.ppp) {
			// 	params.ppp = (this.ppp || resource.ppp);
			// }
			// if (this.options.gridoptions.ppp) {
			// 	params.ppp = this.options.gridoptions.ppp;
			// }
			// if (this.order || resource.default_order) {
			// 	params.order = (this.order || resource.default_order);
			// }
			// if (this.orderby || resource.default_orderby) {
			// 	params.orderby = (this.orderby || resource.default_orderby);
			// }
			return params;
		},
		request: function() {
			if (resource.middleware) {
				// var file = KarmaFields.queryURL+"/"+resource.middleware;
				var file = KarmaFields.fetchURL+"/"+resource.middleware+"/"+resource.key;
				var params = this.getParams();
				var paramList = [];
				for (var key in params) {
					if (params[key]) {
						paramList.push(key+"="+params[key]);
					}
				}
				if (paramList.length) {
					file += "?"+paramList.join("&");
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
          // history.posts = results.items;
					history.posts = results.items.concat(history.posts.filter(function(item) {
						return item.pseudo_uri && history.get(item.pseudo_uri, "action") === "add";
					}));
					manager.num = parseInt(results.count);


					if (manager.resource.options) {
						manager.optionsField = manager.buildOptions();
						// manager.optionsField = KarmaFields.managers.field(manager.resource.options, {
						// 	pseudo_uri: "options"
						// }, "posts", history);
						//
						// manager.optionsField.onBubble = function(key, value) {
						// 	manager.options[key] = value;
						// }

						// manager.optionsField.onModify = function(modified) {
						// 	console.log(manager.options);
						// 	// update();
						// }
						// manager.optionsField.onSubmit = function(modified) {
						// 	manager.displayOptions = false;
						// 	manager.sync();
						// }


					}

          if (manager.render) {
            manager.render();
          }
					manager.loading = false;
					if (manager.renderFooter) {
						manager.renderFooter();
					}
          return results;
        });
			} else {
				return Promise.reject(new Error("Table Manager cannot request uri ("+uri+"): no resource middleware"));
			}
		},

		// deprecated
		query: function(url, params, noCache) {
			return fetch(url, {
				cache: "default" // force-cache
			}).then(function(response) {
				return response.json();
			});
		},


		reorder: function(key, default_order) {
			if (this.options.orderby === key) {
				if (this.options.order === "asc") {
					this.options.order = "desc";
				} else {
					this.options.order = "asc";
				}
			} else {
				this.options.orderby = key;
				this.options.order = default_order || "asc";
			}
			this.options.page = 1;

			history.pool.set("options", "orderby", history.index, this.options.orderby);
			history.pool.set("options", "order", history.index, this.options.order);
			history.pool.set("options", "page", history.index, this.options.page);

			this.request();
		},


		// deprecated
		getChanges: function() {
			// return history.pool.get(history.index);

			return this.fields.reduce(function(obj, field) {
				var uri = field.post.uri || field.post.pseudo_uri;
				if (uri && field.resource.key && field.modified) {
					if (!obj[uri]) {
						obj[uri] = {};
					}
					obj[uri][field.resource.key] = field.get();
				}
				return obj;
			}, history.posts.reduce(function(obj, item) {
				var uri = item.uri || item.pseudo_uri;
				var action = history.get(uri, "action");
				if (action) {
					if (!obj[uri]) {
						obj[uri] = {};
					}
					obj[uri].action = action;
				}
				return obj;
			}, {}));
		},
		addChange: function(post, key, value) {
			if (!this.changes[post.uri || post.pseudo_uri]) {
				this.changes[post.uri || post.pseudo_uri] = {};
			}
			this.changes[post.uri || post.pseudo_uri][key] = value;

			// console.log(post, key, value, this.changes);
		},
		// add, delete, save fields
		sync: function() {
			var params = this.getParams();
			// params.fields = this.getChanges();

			params.fields = this.changes;
			this.loading = true;
			this.renderFooter();
			return fetch(KarmaFields.saveURL+"/"+resource.middleware+"/"+resource.key, {
				method: "post",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(params),
				mode: "same-origin"
			}).then(function(response) {
				return response.json();
			}).then(function(results) {
				history.posts = results.items;
				manager.num = parseInt(results.num);
				// history.dbIndex = history.index;

				for (var uri in params.fields) {
					for (var key in params.fields[uri]) {
						history.pool.deleteKey(uri, key);
					}
				}

				manager.changes = {};

				if (manager.resource.options) {
					manager.optionsField = manager.buildOptions();
				}

				// if (manager.resource.options) {
				// 	manager.optionsField = KarmaFields.managers.field(manager.resource.options, manager.options);
				//
				// 	manager.optionsField.onModify = function(modified) {
				// 		console.log(manager.options);
				// 		// update();
				// 	}
				// }


				manager.num = parseInt(results.count);
				if (manager.render) {
					manager.render();
				}
				// manager.fields.forEach(function(field) {
				// 	field.fetch();
				// });

				manager.loading = false;
				if (manager.renderFooter) {
					manager.renderFooter("Items saved");
				}
			});
		},
		addItem: function() {
			history.save();
			var post = {};
			post.pseudo_uri = "-draft-"+(Math.random()*1000000000000).toFixed();
			history.set(post.pseudo_uri, "action", "add");

			this.addChange(post, "action", "add");



			// if (this.onAddRow) {
			// 	this.onAddRow(post, this.getItems().length);
			// }

			resource.columns.forEach(function(column) {
				if (column.default_as_filter && column.key && manager.filters[column.key]) {
					// post[column.key] = manager.filters[column.key];

					history.pool.set(post.pseudo_uri, column.key, history.initialIndex, manager.filters[column.key]);

					// console.log(history.pool.storage);

					manager.addChange(post, column.key, manager.filters[column.key]);


				} else if (column.default_as_last && column.key && history.posts.length) {
					var field = manager.fields.reverse().find(function(field) {
						return field.resource.key === column.key;
					});
					if (field) {
						// post[column.key] = field.get();
						history.pool.set(post.pseudo_uri, column.key, history.initialIndex, field.get());

						manager.addChange(post, column.key, field.get());
					}
				} else if (column.default_field) {
					// ...
				}
			});

			history.posts.push(post);




			if (manager.render) {
				manager.render();
			}

			this.select.select(0, history.posts.length-1, this.select.width, 1);

			var cells = this.select.getSelectedCells();
			if (cells.length && cells[0].field && cells[0].field.onFocus) {
				cells[0].field.onFocus();
			}

			if (manager.renderFooter) {
				manager.renderFooter();
			}


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
			history.save();
			var items = this.getItems();
			rows.forEach(function(index) {
				var item = items[index];
				if (item) {
					if (item.uri) {
						// manager.pool.setAt("remove", manager.history.index, item.uri, "action");
						history.set(item.uri, "action", "remove");
						manager.addChange(item, "action", "remove");

					} else if (item.pseudo_uri) {
						// manager.pool.setAt("cancel", manager.history.index, item.pseudo_uri, "action");
						history.set(item.pseudo_uri, "action", "cancel");
						manager.addChange(item, "action", "cancel");
					}
				}
			});
			this.render();
			this.renderFooter();
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
			if (resource.key && resource.default_value) {
				params[resource.key] = resource.default_value;
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
	if (!resource.middleware) {
		console.error("Middleware is missing");
	}
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
	history.onUpdate = function() {
		//
		// manager.fields.forEach(function(field) {
		// 	field.fetch();
		// });

		// manager.fields.forEach(function(field) {
		// 	field.update();
		// });

		if (manager.renderOptions) {
			manager.renderOptions();
		}
		manager.render();
		manager.renderFooter();
	}
	manager.history = history;

	// manager.optionsField = KarmaFields.managers.field(manager.resource.options, manager.options);


	if (resource.filter) {
		manager.filters = manager.getDefaultFilters(resource.filter);
	}
	if (resource.options) {
		manager.options = manager.getDefaultOptions(resource.options);
	}

	return manager;
}
