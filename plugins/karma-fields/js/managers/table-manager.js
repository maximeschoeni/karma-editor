KarmaFields.managers.table = function(resource) {
	// var history = KarmaFields.managers.history(resource.driver || resource.middleware);
	var history = KarmaFields.History.createInstance();

	var manager = {
		resource: resource,
		// posts: [], // -> moved to history
		select: null,
		// filter: null, // deprecated
		// filters: {},
		// fields: [],
		// options: {},
		// changes: {},
		//
		// table: null, // -> for accesding filters
		//
		//     // search: "",
    // order: null,
    // orderby: null,
    // page: 1,
    // ppp: resource.ppp || 10,

		build: function() {
			if (KarmaFields.tables[resource.name || "grid"]) {
				return KarmaFields.tables[resource.name || "grid"](this);
			}
		},
		// buildFilter: function() {
		// 	if (resource.filter) {
		// 		// var filter = KarmaFields.managers.filter(resource.filter, this, (resource.driver || resource.middleware));
		// 		// var filter = KarmaFields.managers.field(resource.filter, "filters", [], [resource.key || "nokey"], history, null);
		// 		var filter = KarmaFields.managers.field(resource.filter, {
		// 			inputBuffer: "filters",
		// 			outputBuffer: "filters",
		// 			history: history,
		// 			tableManager: this,
		// 			onSetValue: function() {
		// 				console.log("submit");
		// 			}
		// 		});
		// 		return filter.build();
		// 	}
		// },

		// buildFooter: function() {
		// 	return KarmaFields.tables.footer(this);
		// },
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
			return history.read("inner", ["table", "items"]);
			// return history.posts.filter(function(item) {
			// 	// var action = history.pool.get(history.index, item.uri || item.pseudo_uri, "action");
			// 	var action = history.get(item.uri || item.pseudo_uri, "action");
			// 	return action !== "remove" && action !== "cancel";
			// });
		},

		// getParams: function() {
		// 	var params = {};
		// 	var options = history.read(["options"]);
		// 	var filters = history.read(["filters"]);
		// 	for (var i in options) {
		// 		params[i] = options[i];
		// 	}
		// 	for (var i in filters) {
		// 		params[i] = filters[i];
		// 	}
		// 	return params;
		// },
		request: function() {

			if (resource.driver) {
				var params = {};
				var options = history.read("inner", ["options"]);
				var filters = history.read("inner", [resource.driver, "filters"]);


				KarmaFields.Object.merge(params, filters);
				KarmaFields.Object.merge(params, options);

				history.write("static", ["loading"], 1);

				if (this.renderFooter) {
					this.renderFooter();
				}

				return KarmaFields.Transfer.query(resource.driver, params).then(function(results) {

					history.write("input", [resource.driver], results.items.reduce(function(obj, item) {
						obj[item.uri] = item;
						return obj;
					}, {}));

					history.write("inner", ["table", "items"], results.items.map(function(item) {
						return item.uri;
					}));
					history.write("inner", ["table", "count"], parseInt(results.count));

					history.write("static", ["loading"], 0);



					// results.items.forEach(function(item) {
					// 	history.write(["input", item.uri], item);
					// });
					//
					// var uris = results.items.map(function(item) {
					// 	return item.uri;
					// });
					// history.write(["table", "items"], uris);
					// history.write(["table", "count"], parseInt(results.count));
					// history.write(["table", "loading"], 0);
					//
					// if (uris) {
					// 	history.save(["table", "items"], uris);
					// }
					// if (count) {
					// 	history.save(["table", "count"], count);
					// }

					console.time('render');
          if (manager.render) {
            manager.render();
          }
					console.timeEnd('render');

          return results;
        });
			} else {
				return Promise.reject(new Error("Table Manager error: no resource driver"));
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
			var options = history.read("inner", ["options"]);
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
			history.write("inner", ["options"], options);
			this.request();
		},

		getPpp: function() {
			var ppp = manager.history.read("inner", ["options", "ppp"]);
			return parseInt(ppp || Number.MAX_SAFE_INTEGER);
		},
		getPage: function() {
			var page = manager.history.read("inner", ["options", "page"]);
			return parseInt(page || 1);
		},
		setPage: function(page) {
			manager.history.write("inner", ["options", "page"], page.toString());
		},
		getCount: function() {
			var count = manager.history.read("inner", ["table", "count"]);
			return parseInt(count || 0);
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
			var output = history.read("output", []);

			if (KarmaFields.Object.isEmpty(output)) {
				console.error("Output is empty");
			}
			var params = {
				drivers: output
			};

			// console.log(params);

			var options = history.read("inner", ["options"]);
			var filters = history.read("inner", [resource.driver, "filters"]);
			KarmaFields.Object.merge(params, filters);
			KarmaFields.Object.merge(params, options);
			// var options = history.read(["options"]);
			// var filters = history.read(["filters"]);
			// var params = Object.merge(options, filters);
			// params = Object.merge(params, {
			// 	fields: history.output
			// });

			manager.stopRefresh();

			history.write("static", ["loading"], 1);
			this.renderFooter();

			return KarmaFields.Transfer.update(resource.driver, params).then(function(results) {

				// history.write("output", [], undefined);
				history.empty("output", []);
				history.write("input", [], output);
				if (results && !KarmaFields.Object.isEmpty(results)) {
					history.write("input", [], results);
				}


				// history.write("input", [], results.items.reduce(function(obj, item) {
				// 	obj[item.uri] = item;
				// 	return obj;
				// }, output));

				// history.write("inner", ["table", "items"], results.items.map(function(item) {
				// 	return item.uri;
				// }));
				// history.write("inner", ["table", "count"], parseInt(results.count));

				history.write("static", ["loading"], 0);


				if (manager.render) {
					manager.render();
				}

				manager.autoRefresh();
			});
		},
		addItem: function() {
			var params = {};
			params.fields = resource.children.reduce(function(obj, child) {
				if (child.key && child.default !== undefined) {
					obj[child.key] = child.default;
				}
				return obj;
			}, {});
			var options = history.read("inner", ["options"]);
			var filters = history.read("inner", [resource.driver, "filters"]);
			KarmaFields.Object.merge(params, filters);
			KarmaFields.Object.merge(params, options);

			history.write("static", ["loading"], 1);

			this.renderFooter();

			KarmaFields.Transfer.add(resource.driver, params).then(function(result) {

				history.write("input", [resource.driver, result.uri], result);

				history.write("output", [resource.driver, result.uri, "trash"], "0");

				var uris = history.read("inner", ["table", "items"]) || [];
				var count = history.read("inner", ["table", "count"]) || 0;

				history.write("inner", ["table", "items"], [result.uri, ...uris]);
				history.write("inner", ["table", "count"], count+1);

				history.write("static", ["loading"], 0);


				// console.log(history.read("inner", ["table", "items"]));

				// history.write(["input", item.uri], item);
				//
				//
				// var uris = history.read(["table", "items"]);
				// history.save(["table", "items"], uris);
				// history.save(["output", item.uri, "trash"], 0, true);
				// history.write(["output", item.uri, "trash"], 1);
				// uris.unshift(item.uri);
				// history.write(["table", "items"], uris);
				// history.write(["table", "count"], history.read(["table", "count"])+1);
				// history.write(["table", "loading"], 0);


				if (manager.render) {
					manager.render();
				}

				// manager.autoRefresh();
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

			history.write("output", [], rows.reduce(function(obj, item) {
				obj[item] = {};
				obj[item].trash = "1";
				return obj;
			}, {}))

			var uris = history.read("inner", ["table", "items"]) || [];

			history.write("inner", ["table", "items"], uris.filter(function(uri) {
				return rows.indexOf(uri) === -1;
			}));

			this.render();



			// rows.forEach(function(cell, index) {
			// 	cell.field.setValue("1", index !== 0, true);
			// });
			// var uris = history.read(["table", "items"]);
			// history.save(["table", "items"], uris, true);
			// uris = uris.filter(function(uri) {
			// 	return rows.every(function(cell) {
			// 		return cell.field.path !== uri;
			// 	});
			// });
			// history.write(["table", "items"], uris);
			// this.render();

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

		autoRefresh: function() {
			// this.refreshTimer = setTimeout(function() {
			// 	if (manager.onRefresh) {
			// 		manager.onRefresh();
			// 	}
			// 	// manager.autoRefresh();
			// }, this.autorefreshInterval || 5000);
		},
		stopRefresh: function() {
			// if (this.refreshTimer) {
			// 	clearTimeout(this.refreshTimer);
			// }
		}
		// ,
		// resetRefresh: function() {
		// 	this.stopRefresh();
		// 	this.autoRefresh();
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

	manager.select = KarmaFields.selectors.grid(manager);

	// manager.optionsField = KarmaFields.managers.field(manager.resource.options, manager.options);


	if (resource.filter) {
		var filters = manager.getDefaultFilters(resource.filter);
		history.write("inner", ["filters"], filters);
	}

	history.write("inner", ["options"], {
		page: 1,
		ppp: 50
	});

	if (resource.options) {
		var options = manager.getDefaultOptions(resource.options);
		history.write("inner", ["options"], options);
	}



	// autorefresh
	// manager.onRefresh = function() {
	// 	console.log("auto-refreshing...");
	// 	manager.request(true).then(function() {
	// 		console.log("auto refreshed");
	//
	// 		manager.autoRefresh();
	// 	});
	// }

	return manager;
}
