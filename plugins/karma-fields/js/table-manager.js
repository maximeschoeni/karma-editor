KarmaFieldMedia.managers.table = function(resource) {
	var manager = {
		resource: resource,
		posts: [],
		select: KarmaFieldMedia.selectors.grid(),
		filter: null,
		fields: [],
    // filters: {},
    search: "",
    order: null,
    orderby: null,
    page: 1,
    ppp: resource.ppp || 10,
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

    // buildFilter: function(filter) {
    //   var builder = KarmaFieldMedia.filters[filter.name];
    //   if (builder) {
    //     return builder(manager, filter);
    //   } else {
    //     console.error("Karma Fields build filter error: filter not found");
    //   }
    // },
    // requestFilterOptions: function(filterName) {
    //   if (resource.middleware) {
    //     var file = KarmaFields.filterURL+"/"+resource.middleware+"/"+filterName;
    //     var params = [];
    //     if (resource.type) {
    //       params.push("type="+resource.type);
    //     }
    //     if (params.length) {
    //       file += "?"+params.join("&");
    //     }
    //     return this.query(file);
    //   } else {
		// 		return Promise.reject(new Error("Karma Field request filters error: middleware not found"));
		// 	}
    // },
    encodeFilters: function() {
      // var keys = [];
      // for (var key in this.filters) {
      //   var value = this.filters[key].value;
      //   if (value) {
      //     keys.push(key);
      //     params.push("filter-"+key+"="+this.filters[key].value);
      //     params.push("type-filter-"+key+"="+this.filters[key].type);
      //   }
      // }
      // params.unshift("filters="+keys.join(","));
      // return params;
			var params = [];

			// for (var key in resource.filter) {
			// 	params.push("filter-"+key+"="+resource.filter[key]);
			// }
			for (var key in this.filters) {
				var filterManager = this.filters[key];
				if (filterManager.value) {
					params.push("filter-"+key+"="+filterManager.value);
				}
			}

			return params;
    },
		request: function() {
			if (resource.middleware) {
        var file = KarmaFields.queryURL+"/"+resource.middleware;
        var params = [];
        // if (resource.type) {
        //   params.push("type="+resource.type);
        // }
        if (this.page > 1) {
          params.push("page="+this.page);
        }
        if (this.ppp || resource.ppp) {
          params.push("ppp="+(this.ppp || resource.ppp));
        }
        if (this.order || resource.default_order) {
          params.push("order="+(this.order || resource.default_order));
        }
        if (this.orderby || resource.default_orderby) {
          params.push("orderby="+(this.orderby || resource.default_orderby));
        }
				if (this.filter) {
					var filters = this.filter.getDescendantParams();
					for (var key in filters) {
						params.push(key+"="+filters[key]);
					}
				}

        // if (this.search) {
        //   params.push("search="+this.search);
        // }
				// console.log(params);
        // if (params.length) {
        //   file += "?"+params.join("&");
        // }

				this.loading = true;
				if (this.renderFooter) {
					this.renderFooter();
				}

        return this.query(file, params).then(function(results) {
					// console.log(results);
          manager.posts = results.items;
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
		format: function(response) {
			if (response.ok) {
				return response.json();
			} else {
				return response;
			}
		},
		query: function(url, params, noCache) {
			if (params.length) {
				url += "?"+params.join("&");
			}

			var cache = !noCache && KarmaFieldMedia.cache.query(url);
			if (cache) {
				return Promise.resolve(cache);
			}

			// console.log(response, response && response.then);
			return fetch(url, {
				cache: "default" // force-cache
			}).then(function(response) {
				var results = manager.format(response);
				KarmaFieldMedia.cache.put(url, results);
				return results;
			});
		},
		// getChanges: function() {
		// 	Promise.all(this.fields.map(function(field) {
		// 		return field.getChange();
		// 	})).then(function(fields) {
		// 		return fields.filter(function(field) {
		// 			return field;
		// 		})
		// 	});
		// },
		// getFieldsModifiedValues: function() {
		// 	return Promise.all(this.fields.map(function(field) {
		// 		return field.original();
		// 	})).then(function() {
		// 		var values = {};
		// 		manager.fields.filter(function(field) {
		// 			return field.modifiedValue !== undefined && field.resource.key && field.post.uri;
		// 		}).forEach(function(field) {
		// 			if (!values[field.post.uri]) {
		// 				values[field.post.uri] = {};
		// 			}
		// 			values[field.post.uri][field.resource.key] = field.modifiedValue;
		// 		});
		// 		return values;
		// 	});
		// },
		// save: function() {
		// 	return this.getFieldsModifiedValues().then(function(values) {
		// 		return fetch(KarmaFields.saveURL+"/"+resource.middleware, {
		// 			method: "post",
		// 			headers: {"Content-Type": "application/json"},
		// 			body: JSON.stringify({
		// 				values: values
		// 			}),
		// 			mode: "same-origin"
		// 		}).then(function(response) {
		// 			return response.json();
		// 		});
		// 	});
		// },
		save: function(fields) {
			// var fields = this.fields.filter(function(field) {
			// 	return field.modifiedValue !== undefined;
			// });
			this.loading = true;
			this.renderFooter();
			return fetch(KarmaFields.saveURL+"/"+resource.middleware, {
				method: "post",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					values: fields.map(function(field) {
						return {
							uri: field.post.uri || "",
							key: field.resource.key || "",
							value: field.modifiedValue
						};
					})
				}),
				mode: "same-origin"
			}).then(function(response) {
				fields.forEach(function(field) {
					field.originalValue = Promise.resolve(field.modifiedValue);
					field.update(field.modifiedValue);
				});
				manager.loading = false;
				// manager.status = "Item saved";
				manager.renderFooter("Items saved");
				// setTimeout(function() {
				// 	manager.status = "";
				// 	manager.renderFooter();
				// }, 1000);
				return response.json();
			});
		},


		// addChange: function(uri, key, value) {
		// 	if (!this.pool[uri]) {
		// 		this.pool[uri] = {};
		// 	}
		// 	this.pool[uri][key] = value;
		// },
		// save: function() {
		// 	KarmaFieldMedia.cache.put(KarmaFields.getURL+"/"+file, value);
		// 	return fetch(KarmaFields.saveURL+"/"+file, {
		// 		method: "post",
		// 		headers: {"Content-Type": "application/json"},
		// 		body: JSON.stringify({
		// 			value: value
		// 		}),
		// 		mode: "same-origin"
		// 	}).then(function(response) {
		// 		return response.json();
		// 	});
		// },
		addItem: function() {

			manager.posts.push({});
      if (manager.render) {
        manager.render();
      }

			this.select.select(0, manager.posts.length-1, this.select.width, 1);
			var fields = this.select.getSelectedFields();
			fields.forEach(function(field) {
				field.update("");
			});
			var field = fields.shift();
			if (field && field.onFocus) {
				field.onFocus();
			}


			// manager.loading = true;
			// manager.renderFooter();
			// return fetch(KarmaFields.addURL+"/"+resource.middleware, {
			// 	method: "post",
			// 	headers: {"Content-Type": "application/json"},
			// 	body: JSON.stringify({
			// 		filters: this.filter && this.filter.getDescendantParams() || {}
			// 	}),
			// 	mode: "same-origin"
			// }).then(function(response) {
			// 	return response.json();
			// }).then(function(post) {
			// 	if (resource.columns) {
			// 		console.log(resource.columns);
			// 		resource.columns.forEach(function(column) {
			// 			post[column.key] = column.field && column.field.default || "";
			// 		});
			// 	}
			// 	manager.posts.push(post);
      //   if (manager.render) {
      //     manager.render();
      //   }
			// 	manager.loading = false;
			// 	manager.renderFooter("Items added");
      //   return post;
			// });
		},
		removeItems: function(items) {
			manager.posts = manager.posts.filter(function(post) {
				return items.indexOf(post) < 0;
			});
			this.loading = true;
			this.renderFooter();

			return fetch(KarmaFields.removeURL+"/"+resource.middleware, {
				method: "post",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					uris: items.map(function(item) {
						return item.uri;
					})
				}),
				mode: "same-origin"
			}).then(function(response) {
				return response.json();
			}).then(function(result) {
				if (manager.render) {
					manager.render();
				}
				manager.loading = false;
				// manager.status = "Items deleted";
				manager.renderFooter("Items deleted");
				// setTimeout(function() {
				// 	manager.status = "";
				// 	manager.renderFooter();
				// }, 1000);
        return result;
			});
		}
	};
	if (!resource.middleware) {
		console.error("Middleware is missing");
	}
	manager.select.onSave = function(event) {
		var fields = manager.fields.filter(function(field) {
			return field.modifiedValue !== undefined;
		});
		if (fields.length) {
			manager.save(fields);
			event.preventDefault();
		}
	}
	return manager;
}
