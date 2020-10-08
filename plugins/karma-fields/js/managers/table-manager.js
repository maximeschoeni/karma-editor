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
			var items = history.read("table", ["items"]) || {};
			var drafts = history.read("table", ["drafts"]) || {};
			return Object.values(drafts).concat(Object.values(items)).filter(function(uri) {
				return history.read("output", [resource.driver, uri, "status"], 1) < 2;
			});
		},
		request: function() {

			if (resource.driver) {

				this.stopRefresh();

				var params = {};
				params.page = history.read("page", [], 1);
				// params.ppp = history.read("ppp", [], 50);
				params.options = history.read("options", [], {});
				params.filters = history.read("filters", [], {});



				// KarmaFields.Object.merge(params, filters);
				// KarmaFields.Object.merge(params, options);



				history.write("static", ["loading"], 1);

				if (this.renderFooter) {
					this.renderFooter();
				}



				return KarmaFields.Transfer.query(resource.driver, params).then(function(results) {

					// console.log(results.items);

					history.write("table", ["items"], null, "nav");

					results.items.filter(function(item) {
						return item.uri;
					}).forEach(function(item, index) {
						history.write("input", [resource.driver, item.uri], item);
						history.write("table", ["items", index], item.uri, "nav");
					});

					history.write("table", ["count"], parseInt(results.count), "nav");
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
		reorder: function(key, driver, default_order) {
			var order = history.read("order", [], {});
			if (order.orderby === key) {
				if (order.order === "asc") {
					order.order = "desc";
				} else {
					order.order = "asc";
				}
			} else {
				order.orderby = key;
				order.order = default_order || "asc";
			}
			order.driver = driver;
			// options.page = 1;
			history.write("page", [], "1", "nav");
			history.write("order", [], order, "nav");
			this.request();
		},

		getPpp: function() {
			var ppp = manager.history.read("options", ["ppp"]);
			return parseInt(ppp || Number.MAX_SAFE_INTEGER);
		},
		getPage: function() {
			var page = manager.history.read("page", []);
			return parseInt(page || 1);
		},
		setPage: function(page) {
			manager.history.write("page", [], page.toString(), "nav");
		},
		getCount: function() {
			var count = manager.history.read("table", ["count"]);
			var drafts = manager.history.read("table", ["drafts"]) || [];
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
				input: output,
				page: history.read("page", [], 1),
				options: history.read("options", [], {}),
				filters: history.read("filters", [], {})
			};

			// console.log(params);

			// var options = history.read("options", [], {});
			// var filters = history.read("filters", [], {});
			// KarmaFields.Object.merge(params, filters);
			// KarmaFields.Object.merge(params, options);
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
				var drafts = Object.values(history.read("table", ["drafts"]) || {});
				var uris = Object.values(history.read("table", ["items"]) || {});
				history.write("table", ["items"], drafts.concat(uris));
				history.write("table", ["drafts"], null);

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
			params.options = history.read("options", []);
			params.filter = history.read("filters", []);

			// var options = history.read("options", []);
			// var filters = history.read("filters", []);
			// KarmaFields.Object.merge(params, filters);
			// KarmaFields.Object.merge(params, options);

			history.write("static", ["loading"], 1);

			this.renderFooter();

			KarmaFields.Transfer.add(resource.driver, params).then(function(result) {

				history.merge("input", [resource.driver, result.uri], result);
				var drafts = Object.values(history.getValue(["table", "drafts"]) || {});
				console.log(drafts);
				history.write("table", ["drafts"], [...drafts, result.uri], result.uri);
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

			rows.forEach(function(uri) {
				history.write("output", [resource.driver, uri, "status"], "2", timestamp);
			});

			history.filter("table", ["items"], function(uri) {
				return rows.indexOf(uri) === -1;
			});

			this.render();
		},

		save: function() {
			// var data = KarmaFields.Object.clone({
			// 	store: history.store,
			// 	undos: history.undos,
			// 	redos: history.redos,
			// 	temp: history.temp
			// });
			if (history.store && history.store.undos) {
				var diff = KarmaFields.Object.unmerge(history.store.undos, this.lastData);
				this.lastData = KarmaFields.Object.clone(history.store.undos);
				//


				return KarmaFields.Transfer.autoSave2(resource.driver, {diff: diff}).then(function(results) {

					KarmaFields.Object.forEach(results, function(path, userId) {
						// console.log(path, userId);
						KarmaFields.Transfer.get(...path).then(function(value) {
							history.write("input", path, value);
							history.write("output", path, value, path.join("-"));
							var cell = KarmaFields.Object.getValue(manager.fields, path);
							cell.render();
							// cell.element.classList.add("test");
							// setTimeout(function() {
							// 	cell.element.classList.remove("test");
							// }, 2000);
						});
					});

				});
			}



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
			if (resource.driver && !params[resource.driver]) {
				params[resource.driver] = {};
			}
			if (resource.driver && resource.key && resource.default) {
				params[resource.driver][resource.key] = resource.default;
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
			this.stopRefresh();
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
		manager.render();
	}

	KarmaFields.events.onSave = function(event) {
		manager.sync();
		event.preventDefault();
	}
	KarmaFields.events.onUndo = function(event) {
		history.undo();
		manager.render();
		event.preventDefault();
	}
	KarmaFields.events.onRedo = function(event) {
		history.redo();
		manager.render();
		event.preventDefault();
	}

	KarmaFields.events.onUnload = function() {
		// manager.save();
		// manager.stopRefresh();
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

		history.merge("filters", [], filters, true);
	}

	if (resource.options) {
		var options = manager.getDefaultOptions(resource.options);
		history.merge("options", [], options, true);
	}

	history.merge("options", [], {
		page: 1,
		ppp: 50
	}, true);





	manager.onRefresh = function() {
		//manager.save();
	}

	return manager;
}
