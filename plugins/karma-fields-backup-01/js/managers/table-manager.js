KarmaFields.managers.table = function(resource, history) {
	// var history = KarmaFields.managers.history(resource.driver || resource.middleware);


	var manager = {
		resource: resource,
		select: null,

		build: function() {
			if (KarmaFields.tables[resource.name || "grid"]) {
				return KarmaFields.tables[resource.name || "grid"](this);
			}
		},
		getItems: function() {
			var items = history.read("inner", ["table", "items"]) || {};
			var drafts = history.read("inner", ["table", "drafts"]) || {};
			return Object.values(drafts).concat(Object.values(items)).filter(function(uri) {
				return history.read("output", [resource.driver, uri, "status"], 1) < 2;
			});
		},
		request: function() {

			if (resource.driver) {

				this.stopRefresh();

				var params = {};
				var options = history.read("inner", ["options"], {});
				var filters = history.read("inner", [resource.driver, "filters"], {});

				KarmaFields.Object.merge(params, filters);
				KarmaFields.Object.merge(params, options);



				history.write("static", ["loading"], 1);

				if (this.renderFooter) {
					this.renderFooter();
				}

				history.write("inner", ["table", "items"], []);

				return KarmaFields.Transfer.query(resource.driver, params).then(function(results) {


					results.items.forEach(function(item) {
						if (item.uri) {
							history.write("input", [resource.driver, item.uri], item);
						}
					});

					history.write("inner", ["table", "items"], results.items.map(function(item) {
						return item.uri;
					}), "nav");
					history.write("inner", ["table", "count"], parseInt(results.count), "nav");
					history.write("static", ["loading"], 0);



					// console.time('render');
          if (manager.render) {
            manager.render();
          }
					// console.timeEnd('render');

					manager.autoRefresh();

          return results;
        });
			} else {
				return Promise.reject(new Error("Table Manager error: no resource driver"));
			}
		},

		reorder: function(key, default_order) {
			var options = history.read("inner", ["options"], {});
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
			history.write("inner", ["options"], options, "nav");
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
			manager.history.write("inner", ["options", "page"], page.toString(), "nav");
		},
		getCount: function() {
			var count = manager.history.read("inner", ["table", "count"]);
			var drafts = manager.history.read("inner", ["table", "drafts"]) || [];
			return parseInt(count || 0) + drafts.length;
		},

		sync: function() {

			this.stopRefresh();

			var output = history.read("output", [], {});

			if (KarmaFields.Object.isEmpty(output)) {
				console.log(output);

				console.warn("Output is empty");
				return;
			}
			var params = {
				drivers: output
			};

			// console.log(params);

			var options = history.read("inner", ["options"], {});
			var filters = history.read("inner", [resource.driver, "filters"], {});
			KarmaFields.Object.merge(params, filters);
			KarmaFields.Object.merge(params, options);
			// var options = history.read(["options"]);
			// var filters = history.read(["filters"]);
			// var params = Object.merge(options, filters);
			// params = Object.merge(params, {
			// 	fields: history.output
			// });

			history.write("static", ["loading"], 1);
			this.renderFooter();

			return KarmaFields.Transfer.update(resource.driver, params).then(function(results) {

				var timestamp = Date.now();

				// history.empty("output", []);
				history.setValue("output", [], null);
				var drafts = Object.values(history.read("inner", ["table", "drafts"], {}));
				var uris = Object.values(history.read("inner", ["table", "items"], {}));
				history.write("inner", ["table", "items"], drafts.concat(uris));
				history.write("inner", ["table", "drafts"], {});

				// history.write("output", [], null, timestamp);

				// console.log(output, {...results});

				history.merge("input", [], output);
				history.merge("input", [], {...results}); // results is maybe an empty array. Should be {driverName1: {uri1: {key1: value}}}


				manager.save().then(function() {
					manager.autoRefresh();
				});


				history.write("static", ["loading"], 0);


				if (manager.render) {
					manager.render();
				}




			});
		},
		addItem: function() {
			manager.stopRefresh();
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

				history.merge("input", [resource.driver, result.uri], result);

				history.write("inner", ["table", "drafts"], [result.uri], result.uri);

				history.write("static", ["loading"], 0);

				history.write("output", [resource.driver, result.uri, "status"], "1", result.uri);

				if (manager.render) {
					manager.render();
				}

				manager.autoRefresh();
			});
		},
		removeItems: function(rows) {

			var timestamp = Date.now();



			var uris = Object.values(history.read("inner", ["table", "items"], {}));
			var filteredUris = uris.filter(function(uri) {
				return rows.indexOf(uri) === -1;
			});
			history.write("inner", ["table", "items"], filteredUris, timestamp);

			console.log("filteredUris", filteredUris);

			rows.forEach(function(uri) {
				history.write("output", [resource.driver, uri, "status"], "2", timestamp);
			});

			// history.write("inner", ["table", "trashitems"], rows, timestamp);

			this.render();
		},

		save: function() {
			// var data = KarmaFields.Object.clone({
			// 	store: history.store,
			// 	undos: history.undos,
			// 	redos: history.redos,
			// 	temp: history.temp
			// });
			var diff = KarmaFields.Object.unmerge(history.store, this.lastData);
			this.lastData = KarmaFields.Object.clone(history.store);
			//
			// console.log(diff);


			return KarmaFields.Transfer.autoSave2(resource.driver, {diff: diff}).then(function(results) {

				KarmaFields.Object.forEach(results, function(path, userId) {
					// console.log(path, userId);
					KarmaFields.Transfer.get(...path).then(function(value) {
						history.write("input", path, value);
						// console.log(path, value);
						var cell = KarmaFields.Object.getValue(manager.fields, path);
						cell.render();
						// cell.element.classList.add("test");
						// setTimeout(function() {
						// 	cell.element.classList.remove("test");
						// }, 2000);
					});
				});

			});


			// return KarmaFields.Transfer.autoSave(resource.driver, data).then(function(results) {
			//
			// 	KarmaFields.Object.forEach(results, function(path, userId) {
			// 		// console.log(path, userId);
			// 		KarmaFields.Transfer.get(...path).then(function(value) {
			// 			history.write("input", path, value);
			// 			// console.log(path, value);
			// 			var cell = KarmaFields.Object.getValue(manager.fields, path);
			// 			cell.render();
			// 			// cell.element.classList.add("test");
			// 			// setTimeout(function() {
			// 			// 	cell.element.classList.remove("test");
			// 			// }, 2000);
			// 		});
			// 	});
			// });

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

		autoRefresh: function() {
			this.refreshTimer = setTimeout(function() {
				if (manager.onRefresh) {
					manager.onRefresh();
				}
				manager.autoRefresh();
			}, this.autorefreshInterval || 5000);
		},
		stopRefresh: function() {
			if (this.refreshTimer) {
				clearTimeout(this.refreshTimer);
			}
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


	// manager.history.store.input = localStorage.getItem("input");

	manager.select = KarmaFields.selectors.grid(manager);

	// manager.optionsField = KarmaFields.managers.field(manager.resource.options, manager.options);


	if (resource.filter) {
		var filters = manager.getDefaultFilters(resource.filter);
		history.merge("inner", ["filters"], filters, true);
	}

	if (resource.options) {
		var options = manager.getDefaultOptions(resource.options);
		history.merge("inner", ["options"], options, true);
	}

	history.merge("inner", ["options"], {
		page: 1,
		ppp: 50
	}, true);





	manager.onRefresh = function() {

		// if (!KarmaFields.Object.isEmpty(history.store.output)) {
		//
		// }

		manager.save();

	}
	// manager.autoRefresh();

	return manager;
}
