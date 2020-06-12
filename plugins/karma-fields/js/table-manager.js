KarmaFieldMedia.managers.table = function(resource) {
	var manager = {
		resource: resource,
		posts: [],
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
        var params = this.filter && this.filter.getDescendantParams() || [];
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
        // if (this.search) {
        //   params.push("search="+this.search);
        // }
				// console.log(params);
        // if (params.length) {
        //   file += "?"+params.join("&");
        // }

        return this.query(file, params).then(function(results) {
					// console.log(results);
          manager.posts = results.items;
					manager.num = parseInt(results.num);
          if (manager.render) {
            manager.render();
          }
					if (manager.renderPagination) {
						manager.renderPagination();
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
		}
	};
	return manager;
}
