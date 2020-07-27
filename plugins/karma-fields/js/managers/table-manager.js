KarmaFieldMedia.managers.table = function(resource) {
	var history = KarmaFieldMedia.managers.history();
	var manager = {
		resource: resource,
		posts: [],
		// extraItems: [],
		select: KarmaFieldMedia.selectors.grid(),
		filter: null,
		fields: [],
    // filters: {},
    search: "",
    order: null,
    orderby: null,
    page: 1,
    ppp: resource.ppp || 10,
		// dbIndex: -1,

		build: function() {
			if (KarmaFieldMedia.tables[resource.name || "grid"]) {
				return KarmaFieldMedia.tables[resource.name || "grid"](this);
			}
		},
		buildFilter: function() {
			if (resource.filter) {
				this.filter = KarmaFieldMedia.managers.filter(resource.filter);
				this.filter.table = this;
				return KarmaFieldMedia.filters.node(this.filter);
			}
		},

		buildFooter: function() {
			return KarmaFieldMedia.tables.footer(this);
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
			var params = this.filter && this.filter.getDescendantParams() || {};
			if (this.page > 1) {
				params.page = this.page;
			}
			if (this.ppp || resource.ppp) {
				params.ppp = (this.ppp || resource.ppp);
			}
			if (this.order || resource.default_order) {
				params.order = (this.order || resource.default_order);
			}
			if (this.orderby || resource.default_orderby) {
				params.orderby = (this.orderby || resource.default_orderby);
			}
			return params;
		},
		request: function() {
			if (resource.middleware) {
				var file = KarmaFields.queryURL+"/"+resource.middleware;
				var params = this.getParams();
				var paramList = [];
				for (var key in params) {
					paramList.push(key+"="+params[key]);
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
					manager.num = parseInt(results.num);
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
			if (this.orderby === key) {
				if (this.order === "asc") {
					this.order = "desc";
				} else {
					this.order = "asc";
				}
			} else {
				this.orderby = key;
				this.order = default_order || "asc";
			}
			this.request();
		},

		getChanges: function() {
			// return history.pool.get(history.index);

			return this.fields.reduce(function(obj, field) {
				var uri = field.post.uri || field.post.pseudo_uri;
				if (uri && field.resource.key && field.isModified) {
					if (!obj[uri]) {
						obj[uri] = {};
					}
					obj[uri][field.resource.key] = field.get();
				}
				return obj;
			}, history.posts.reduce(function(obj, item) {
				var uri = item.uri || item.pseudo_uri;
				if (!obj[uri]) {
					obj[uri] = {};
				}
				obj[uri].action = history.get(uri, "action") || "update";
				return obj;
			}, {}));
		},
		// add, delete, save fields
		sync: function() {
			var params = this.getParams();
			params.fields = this.getChanges();
			this.loading = true;
			this.renderFooter();
			return fetch(KarmaFields.saveURL+"/"+resource.middleware, {
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
					for (var key in params.fields[key]) {
						history.pool.deleteKey(uri, key);
					}
				}



				manager.render();
				// manager.fields.forEach(function(field) {
				// 	field.fetch();
				// });

				manager.loading = false;
				manager.renderFooter("Items saved");
			});
		},
		addItem: function() {
			history.save();
			var post = {};
			post.pseudo_uri = "-draft-"+(Math.random()*1000000000000).toFixed();
			history.set(post.pseudo_uri, "action", "add");
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
		removeItems: function(items) {
			history.save();
			items.forEach(function(item) {
				if (item.uri) {
					// manager.pool.setAt("remove", manager.history.index, item.uri, "action");
					history.set(item.uri, "action", "remove");
				} else if (item.pseudo_uri) {
					// manager.pool.setAt("cancel", manager.history.index, item.pseudo_uri, "action");
					history.set(item.pseudo_uri, "action", "cancel");
				}
			});
			this.render();
			this.renderFooter();
		}

	};
	if (!resource.middleware) {
		console.error("Middleware is missing");
	}
	KarmaFieldMedia.events.onSelectAll = function(event) {
		if (document.activeElement === document.body) {
			manager.select.onSelectAll(event);
			event.preventDefault();
		}
	};
	KarmaFieldMedia.events.onAdd = function(event) {
		if (document.activeElement === document.body) {
			manager.addItem();
			event.preventDefault();
		}
	};
	KarmaFieldMedia.events.onDelete = function(event) {
		var items = manager.select.getSelectedItems();
		if (items) {
			manager.removeItems(items);
			event.preventDefault();
		}
	};

	KarmaFieldMedia.events.onCopy = function(event) {
		manager.select.onCopy(event);
	}
	KarmaFieldMedia.events.onPast = function(event) {
		manager.select.onPast(event);
	}

	KarmaFieldMedia.events.onSave = function(event) {
		manager.sync();
		event.preventDefault();
	}
	KarmaFieldMedia.events.onUndo = function(event) {
		history.undo();
		event.preventDefault();
	}
	KarmaFieldMedia.events.onRedo = function(event) {
		history.redo();
		event.preventDefault();
	}
	history.onUpdate = function() {
		// manager.render();
		// manager.fields.forEach(function(field) {
		// 	field.fetch();
		// });

		manager.fields.forEach(function(field) {
			field.update();
		});
		manager.renderFooter();
	}
	manager.history = history;

	return manager;
}
