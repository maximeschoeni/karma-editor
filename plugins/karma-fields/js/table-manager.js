KarmaFieldMedia.managers.table = function(resource) {
	var manager = {
		id: resource.id || KarmaFieldMedia.currentTables.length,
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
		history: {
			index: 0,

			steps: [],
			last: {},
			add: function(callback) {
				this.last.action = callback;
				this.steps.push(this.last);
				this.last = {};
			},
			rewind: function() {
				var step = this.steps.pop();

				manager.posts = step.items;
				manager.num = parseInt(results.num);
				if (manager.render) {
					manager.render();
				}

				step.action(step.posts, step.filters);
			}
		},
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
					params.push(key+"="+filterManager.value);
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
					manager.history.last.filters = filters;
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

					var extraItems = this.getExtraItems();


          manager.posts = results.items.concat(extraItems);
					manager.num = parseInt(results.num);
          if (manager.render) {
            manager.render();
          }
					manager.loading = false;
					if (manager.renderFooter) {
						manager.renderFooter();
					}

					manager.history.last.items = results.items;
          return results;
        });
			} else {
				return Promise.reject(new Error("Table Manager cannot request uri ("+uri+"): no resource middleware"));
			}
		},


		// format: function(response) {
		// 	if (response.ok) {
		// 		return response.json();
		// 	} else {
		// 		return response;
		// 	}
		// },
		query: function(url, params, noCache) {
			if (params.length) {
				url += "?"+params.join("&");
			}

			// var cache = !noCache && KarmaFieldMedia.cache.query(url);
			// if (cache) {
			// 	return Promise.resolve(cache);
			// }

			// console.log(response, response && response.then);
			return fetch(url, {
				cache: "default" // force-cache
			}).then(function(response) {
				return response.json();

				// var results = manager.format(response);
				// KarmaFieldMedia.cache.put(url, results);
				// return results;
			}).then(function(results) {

				// if (manager.resource.type === "json") {
				// 	var path = resource.middleware+"/"+this.post.uri+"/"+resource.key;
				// 	results = ;
				// 	KarmaFieldMedia.cache.set(url, JSON.stringify());
				// }



				return results;
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

			// var updatedValues = {};
			// var values = [];
			// for (var i = 0; i < this.posts.length; i++) {
			// 	var postFields = fields.filter(function(field) {
			// 		return field.post === posts[i];
			// 	});
			// 	if (postFields) {
			// 		var item = {};
			// 		item.uri = post.uri;
			// 		postFields.forEach(function(field) {
			// 			item[field.resource.key] = field.modifiedValue;
			// 		});
			// 		values.push(item);
			// 	}
			//
			//
			// 	var field = fields[i];
			// 	if (field.post.uri) {
			// 		if (!updatedValues[field.post.uri]) {
			// 			updatedValues[field.post.uri] = {};
			// 		}
			// 		if (field.resource.key) {
			// 			updatedValues[field.post.uri][field.resource.key] = field.modifiedValue;
			// 		}
			// 	} else {
			// 		var item = {};
			// 		item[field.resource.key] = field.modifiedValue;
			// 		addedValues.push(item)
			// 	}
			// }

			// var items = this.posts.map(function(post) {
			// 	return {
			// 		uri: post.uri,
			// 		values: fields.filter(function(field) {
			// 			return field.post === post;
			// 		}).map(function(field) {
			// 			return {
			// 				key: field.resource.key,
			// 				value: field.modifiedValue
			// 			};
			// 		}).reduce(function(obj, value) {
			// 			obj[value.key] = value.value;
			// 		}, {})
			// 	}
			// }).filter(function(item) {
			// 	return item.values.length;
			// });


			var items = fields.reduce(function(obj, field) {
				if (field.post.uri) {
					if (!obj[field.post.uri]) {
						obj[field.post.uri] = {};
					}
					obj[field.post.uri][field.resource.key] = field.modifiedValue;
				}
				return obj;
			}, {});

			// console.log(items);
			// return;

			this.loading = true;
			this.renderFooter();
			return fetch(KarmaFields.saveURL+"/"+resource.middleware, {
				method: "post",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					items: items
					// fields.map(function(field) {
					// 	return {
					// 		uri: field.post.uri || "",
					// 		key: field.resource.key || "",
					// 		value: field.modifiedValue
					// 	};
					// })
				}),
				mode: "same-origin"
			}).then(function(response) {

				// setTimeout(function() {
				// 	manager.status = "";
				// 	manager.renderFooter();
				// }, 1000);
				return response.json();
			}).then(function(results) {

				for (var uri in results) {
					for (var key in results[uri]) {
						var field = manager.fields.find(function(field) {
							return field.post.uri === uri && field.resource.key === key;
						});
						if (field) {
							field.setOriginal(results[uri][key]);
						}
					}
				}

				manager.loading = false;
				// manager.status = "Item saved";
				manager.renderFooter("Items saved");
			});
		},

		// getCache: function(uri, index, key) {
		// 	var value = KarmaFieldMedia.cache.getItem(resource.middleware+"/"+uri+"/"+index+"/"+key);
		// 	// while (value === null && index > 0) {
		// 	// 	index--;
		// 	// 	value = KarmaFieldMedia.cache.getItem(resource.middleware+"/"+uri+"/"+index+"/"+key);
		// 	// }
		// 	if (resource.type === "json") {
		// 		return JSON.parse(value || "");
		// 	}
		// 	return value;
		// },
		// updateCache: function(uri, value) {
		// 	if (resource.type === "json") {
		// 		value = JSON.stringify(value || "");
		// 	}
		// 	KarmaFieldMedia.cache.setItem(this.table.resource.middleware+"/"+uri+"/"+this.table.history.index+"/"+resource.key, value);
		// },

		// add, delete, save fields
		sync: function() {


			var itemsToUpdate = this.fields.filter(function(field) {
        return field.modifiedValue !== undefined && field.ressource.key;
      }).reduce(function(obj, field) {
				if (field.post.uri) {
					if (!obj[field.post.uri]) {
						obj[field.post.uri] = {};
					}
					obj[field.post.uri][field.resource.key] = field.modifiedValue;
				}
				return obj;
			}, {});

			// var itemsToAdd = this.posts.filter(function(post) {
			// 	return !post.uri;
			// }).map(function(post) {
			// 	return manager.fields.filter(function(field) {
			// 		return field.post === post;
			// 	}).reduce(function(obj, field) {
			// 		obj[field.resource.key] = field.modifiedValue;
			// 		return obj;
			// 	}, {});
			// });


			var extraItems = this.posts.filter(function(item) {
				return KarmaFieldMedia.cache.getItem(resource.middleware+"/"+item.uri+"/"+this.history.index+"/"+"action") === "add";
			});

			var trashItems = this.posts.filter(function(item) {
				return KarmaFieldMedia.cache.getItem(resource.middleware+"/"+item.uri+"/"+this.history.index+"/"+"action") === "remove";
			});



			// var itemsToDelete = this.posts.filter(function(post) {
			// 	return post.toDelete;
			// }).map(function(post) {
			// 	return post.uri;
			// })

			// console.log(items);
			// return;

			this.loading = true;
			this.renderFooter();
			return fetch(KarmaFields.saveURL+"/"+resource.middleware, {
				method: "post",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					items: itemsToUpdate,
					extra: this.getExtraItems(),
					delete: this.getTrashItems(),
					// fields.map(function(field) {
					// 	return {
					// 		uri: field.post.uri || "",
					// 		key: field.resource.key || "",
					// 		value: field.modifiedValue
					// 	};
					// })
				}),
				mode: "same-origin"
			}).then(function(response) {

				// setTimeout(function() {
				// 	manager.status = "";
				// 	manager.renderFooter();
				// }, 1000);
				return response.json();
			}).then(function(results) {

				for (var uri in results) {
					for (var key in results[uri]) {
						var field = manager.fields.find(function(field) {
							return field.post.uri === uri && field.resource.key === key;
						});
						if (field) {
							// field.setOriginal(results[uri][key]);
							field.set(results[uri][key]);
							field.update();
						}
					}
				}

				manager.loading = false;
				// manager.status = "Item saved";
				manager.renderFooter("Items saved");
			});
		},

		addExtraItem: function(item) {
			var extraItems = this.getExtraItems();
			extraItems.push(item);
			this.setExtraItems(extraItems);
		},
		// substractExtraItems: function(callback) {
		// 	var extraItems = this.getExtraItems();
		// 	var substractedItems = [];
		// 	var items = [];
		// 	while (extraItems.length) {
		// 		var item = extraItems.shift();
		// 		if (callback(item)) {
		// 			substractedItems.push(item);
		// 		} else {
		// 			items.push(item);
		// 		}
		// 	}
		// 	this.setExtraItems(items);
		// 	return substractedItems;
		// },
		getExtraItems: function() {
			var extraItems = KarmaFieldMedia.cache.getItem("extra-items/"+resource.middleware+"/"+this.id);
			if (extraItems) {
				return JSON.parse(extraItems);
			}
			return [];
		},
		setExtraItems: function(extraItems) {
			extraItems = JSON.stringify(extraItems);
			KarmaFieldMedia.cache.setItem("extra-items/"+resource.middleware+"/"+this.id, extraItems);
		},

		getTrashedItems: function() {
			var extraItems = KarmaFieldMedia.cache.getItem("trashed-items/"+resource.middleware+"/"+this.id);
			if (extraItems) {
				return JSON.parse(extraItems);
			}
			return [];
		},

		// changeURI: function(uri, newURI) {
		// 	var fields = this.fields.filter(function(field) {
		// 		return field.post.uri === uri;
		// 	})
		// 	var fields = this.fields.forEach(function(field) {
		// 		if (field.post.uri === uri) {
		// 			field.deleteCache(uri);
		// 		}
		// 	})
		// },

		addItem: function() {


			var post = {};
			post.uri = this.id+"-"+(Math.random()*1000000).toFixed();

			KarmaFieldMedia.cache.setItem(resource.middleware+"/"+post.uri+"/"+this.history.index+"/"+"action", "add");

			// var path = this.table.resource.middleware+"/"+uri+"/"+resource.key;
			// KarmaFieldMedia.cache.removeItem(path);
			//
			//
			// var filters = this.filter && this.filter.getDescendantParams() || {};
			//
			//
			// var uri = this.addExtraItem(filters);
			// this.itemsToAdd.push(filters);


			// var post = {};
			manager.posts.push(post);

			if (manager.render) {
				manager.render();
			}

			this.select.select(0, manager.posts.length-1, this.select.width, 1);
			var fields = this.select.getSelectedFields();
			if (fields[0] && fields[0].onFocus) {
				fields[0].onFocus();
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
			// }).then(function(results) {
			// 	manager.loading = false;
			// 	manager.renderFooter("Items added");
			// 	post.uri = results.uri;
			// 	for (var key in results.values) {
			// 		var field = manager.fields.find(function(field) {
			// 			return field.post === post && field.resource.key === key;
			// 		});
			// 		if (field) {
			// 			field.setOriginal(results.values[key]);
			// 		}
			// 	}
			// 	return results;
			// });
		},
		// addItem: function() {
		// 	var post = {};
		// 	manager.posts.push(post);
		//
    //   if (manager.render) {
    //     manager.render();
    //   }
		//
		// 	this.select.select(0, manager.posts.length-1, this.select.width, 1);
		// 	var fields = this.select.getSelectedFields();
		// 	// fields.forEach(function(field) {
		// 	// 	field.update("");
		// 	// });
		// 	// var field = fields.shift();
		// 	if (fields[0] && fields[0].onFocus) {
		// 		fields[0].onFocus();
		// 	}
		//
		//
		// 	manager.loading = true;
		// 	manager.renderFooter();
		//
		// 	return fetch(KarmaFields.addURL+"/"+resource.middleware, {
		// 		method: "post",
		// 		headers: {"Content-Type": "application/json"},
		// 		body: JSON.stringify({
		// 			filters: this.filter && this.filter.getDescendantParams() || {}
		// 		}),
		// 		mode: "same-origin"
		// 	}).then(function(response) {
		// 		return response.json();
		// 	}).then(function(results) {
		// 		manager.loading = false;
		// 		manager.renderFooter("Items added");
		// 		post.uri = results.uri;
		// 		for (var key in results.values) {
		// 			var field = manager.fields.find(function(field) {
		// 				return field.post === post && field.resource.key === key;
		// 			});
		// 			if (field) {
		// 				field.setOriginal(results.values[key]);
		// 			}
		// 		}
		// 		return results;
		// 	});
		// },
		removeItems: function(items) {
			items.forEach(function(item) {
				var path = resource.middleware+"/"+item.uri+"/"+this.history.index+"/action";
				var action = KarmaFieldMedia.cache.getItem(path);
				if (action === "add") {
					KarmaFieldMedia.cache.removeItem(path);
				} else {
					KarmaFieldMedia.cache.setItem(path, "remove");
				}
			});
			this.posts = this.posts.filter(function(post) {
				return items.indexOf(post) < 0;
			});


			this.render();
			this.renderFooter();


		}
		// removeItems: function(items) {
		// 	manager.posts = manager.posts.filter(function(post) {
		// 		return items.indexOf(post) < 0;
		// 	});
		// 	this.loading = true;
		// 	this.renderFooter();
		//
		// 	return fetch(KarmaFields.removeURL+"/"+resource.middleware, {
		// 		method: "post",
		// 		headers: {"Content-Type": "application/json"},
		// 		body: JSON.stringify({
		// 			uris: items.map(function(item) {
		// 				return item.uri;
		// 			})
		// 		}),
		// 		mode: "same-origin"
		// 	}).then(function(response) {
		// 		return response.json();
		// 	}).then(function(result) {
		// 		if (manager.render) {
		// 			manager.render();
		// 		}
		// 		manager.loading = false;
		// 		// manager.status = "Items deleted";
		// 		manager.renderFooter("Items deleted");
		// 		// setTimeout(function() {
		// 		// 	manager.status = "";
		// 		// 	manager.renderFooter();
		// 		// }, 1000);
    //     return result;
		// 	});
		// }
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
	KarmaFieldMedia.currentTables.push(manager);
	return manager;
}
