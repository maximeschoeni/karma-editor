KarmaFields.managers.pool = function() {
	var pool = {
		// getAt: function(index, uri, key, type) {
		// 	if (this.storage && this.storage[index] && this.storage[index][uri]) {
		// 		var value = this.storage[index][uri][key];
		// 		if (value && type === "json") {
		// 			return JSON.parse(value);
		// 		}
		// 		return value;
		// 	}
		// },
		getAt: function(uri, key, index) {

			 // -> compat
			if (typeof uri === "number") {
				console.error("Pool.getAt() -> wrong argument");
			}


			if (this.storage && this.storage[uri] && this.storage[uri][key]) {
				var value = this.storage[uri][key][index];
				if (typeof value === "object") {
					value = JSON.parse(JSON.stringify(value));
				}
				return value;
			}
			// if (index !== undefined) {
			// 	if (this.storage && this.storage[uri] && this.storage[uri][key]) {
			// 		return this.storage[uri][key][index];
			// 	}
			// }
			// else if (key) {
			// 	if (this.storage && this.storage[uri]) {
			// 		return this.storage[uri][key];
			// 	}
			// } else if (uri) {
			// 	if (this.storage) {
			// 		return this.storage[uri];
			// 	}
			// }
		},

		get: function(uri, key, index) {
			if (typeof uri === "number") {
				console.error("Pool.getAt() -> wrong argument")
			}
			var value = this.getAt(uri, key, index);
			while ((value === null || value === undefined) && index > 0) {
				index--;
				value = this.getAt(uri, key, index);
			}
			return value;
		},

		// find: function(index, uri, key) {
		// 	var value = this.getAt(index, uri, key);
		// 	while ((value === null || value === undefined) && index > 0) {
		// 		index--;
		// 		value = this.getAt(index, uri, key);
		// 	}
		// 	return value;
		// },
		deleteIndex: function(uri, key, index) {
			if (this.storage && this.storage[uri] && this.storage[uri][key] && this.storage[uri][key][index] !== undefined) {
				this.storage[uri][key][index] = undefined;
			}
			// if (key) {
			// 	if (this.storage[index] && this.storage[index][uri] && this.storage[index][uri][key] !== undefined) {
			// 		this.storage[index][uri][key] = undefined;
			// 	}
			// } else if (uri) {
			// 	if (this.storage[index] && this.storage[index][uri]) {
			// 		this.storage[index][uri] = undefined;
			// 	}
			// } else if (index !== undefined) {
			// 	if (this.storage[index]) {
			// 		this.storage[index] = undefined;
			// 	}
			// } else {
			// 	this.storage = [];
			// }
		},
		deleteUp: function(index) {
			if (this.storage) {
				for (var uri in this.storage) {
					for (var key in this.storage[uri]) {
						while (this.storage[uri][key] && this.storage[uri][key][index] !== undefined) {
							this.storage[uri][key][index] = undefined;
							// this.deleteIndex(uri, key, index);
							index++;
						}
					}
				}
			}
		},
		deleteKey: function(uri, key) {
			if (this.storage && this.storage[uri] && this.storage[uri][key]) {
				this.storage[uri][key] = undefined;
			}
		},
		// deprecated
		// setAt: function(value, index, uri, key, type) {
		// 	if (!this.storage) {
		// 		this.storage = {};
		// 	}
		// 	if (!this.storage[index]) {
		// 		this.storage[index] = {};
		// 	}
		// 	if (!this.storage[index][uri]) {
		// 		this.storage[index][uri] = {};
		// 	}
		// 	// if (value && type === "json") {
		// 	// 	value = JSON.stringify(value);
		// 	// }
		// 	this.storage[index][uri][key] = value;
		//
		// 	KarmaFields.storage = this.storage;
		// },
		set: function(uri, key, index, value) {
			if (!this.storage) {
				this.storage = {};
			}
			if (!this.storage[uri]) {
				this.storage[uri] = {};
			}
			if (!this.storage[uri][key]) {
				this.storage[uri][key] = {};
			}
			if (typeof value === "object") {
				value = JSON.parse(JSON.stringify(value));
			}
			this.storage[uri][key][index] = value;

			// KarmaFields.currentStorage = this.storage;
		},




		// set_2: function(path, index, value) {
		// 	if (!this.storage) {
		// 		this.storage = {};
		// 	}
		// 	if (!this.storage[path]) {
		// 		this.storage[path] = {};
		// 	}
		// 	this.storage[path][index] = value;
		// },
		// getAt_2: function(path, index) {
		// 	if (this.storage && this.storage[path]) {
		// 		return this.storage[path][index];
		// 	}
		// },
		// get_2: function(path, index) {
		// 	var value = this.getAt(path, index);
		// 	while (value === undefined && index > 0) {
		// 		index--;
		// 		value = this.getAt(path, index);
		// 	}
		// 	return value;
		// },
		// deleteUp_2: function(index) {
		// 	if (this.storage) {
		// 		for (var path in this.storage) {
		// 			while (this.storage[path] && this.storage[path][index] !== undefined) {
		// 				this.storage[path][index] = undefined;
		// 				index++;
		// 			}
		// 		}
		// 	}
		// },


		load: function(storage, middleware) {
			this.storage = storage.getItem(middleware);
		},
		save: function(storage, middleware) {
			storage.setItem(middleware, this.storage);
		}
	};
	return pool;
}







//
//
// KarmaFields.pool = {
// 	storage: { //Window.sessionStorage || {
// 		values: {},
// 		getItem: function(key) {
// 			return this.values[key];
// 		},
// 		setItem: function(key, value) {
// 			this.values[key] = value;
// 		},
// 		removeItem: function(key) {
// 			this.values[key] = undefined;
// 		},
// 	},
// 	createManager: function(middleware) {
// 		// var storage = this.storage.getItem(middleware) || []; //{};
// 		var manager = {
// 			getAt: function(index, uri, key, type) {
// 				if (this.storage && this.storage[index] && this.storage[index][uri]) {
// 					var value = this.storage[index][uri][key];
// 					if (value && type === "json") {
// 						return JSON.parse(value);
// 					}
// 					return value;
// 				}
// 			},
// 			get: function(index, uri, key, type) {
// 				var value = this.getAt(index, uri, key, type);
// 				while ((value === null || value === undefined) && index > 0) {
// 					index--;
// 					value = this.getAt(index, uri, key, type);
// 				}
// 				return value;
// 			},
// 			deleteAt: function(index, uri, key) {
// 				if (key) {
// 					if (this.storage[index] && this.storage[index][uri] && this.storage[index][uri][key] !== undefined) {
// 						this.storage[index][uri][key] = undefined;
// 					}
// 				} else if (uri) {
// 					if (this.storage[index] && this.storage[index][uri]) {
// 						this.storage[index][uri] = undefined;
// 					}
// 				} else if (index !== undefined) {
// 					if (this.storage[index]) {
// 						this.storage[index] = undefined;
// 					}
// 				} else {
// 					this.storage = [];
// 				}
// 			},
// 			delete: function(index) {
// 				while (this.storage[index]) {
// 					this.deleteAt(index);
// 					index++;
// 				}
// 			},
// 			setAt: function(value, index, uri, key, type) {
// 				if (!this.storage) {
// 					this.storage = KarmaFields.pool.storage.getItem(middleware) || {};
// 				}
// 				if (!this.storage[index]) {
// 					this.storage[index] = {};
// 				}
// 				if (!this.storage[index][uri]) {
// 					this.storage[index][uri] = {};
// 				}
// 				if (value && type === "json") {
// 					value = JSON.stringify(value);
// 				}
// 				this.storage[index][uri][key] = value;
// 			},
// 			save: function() {
// 				KarmaFields.pool.storage.setItem(middleware, this.storage);
// 			}
// 		};
// 		return manager;
// 	}
// 	// createManager: function(middleware) {
// 	// 	var storage = this.storage;
// 	// 	var manager = {
// 	// 		index: 0,
// 	// 		getAt: function(uri, index, key, type) {
// 	// 			var value = storage.getItem(middleware+"/"+uri+"/"+index+"/"+key);
// 	//
// 	// 			if (value && type === "json") {
// 	// 				return JSON.parse(value);
// 	// 			}
// 	// 			return value;
// 	// 		},
// 	// 		get: function(uri, index, key, type) {
// 	// 			var value = this.getAt(uri, index, key, type);
// 	// 			while ((value === null || value === undefined) && index > 0) {
// 	// 				index--;
// 	// 				value = this.getAt(uri, index, key, type);
// 	// 			}
// 	// 			return value;
// 	// 		},
// 	// 		setAt: function(value, uri, index, key, type) {
// 	// 			if (value === null || value === undefined) {
// 	// 				storage.removeItem(middleware+"/"+uri+"/"+index+"/"+key);
// 	// 			} else {
// 	// 				if (value && type === "json") {
// 	// 					value = JSON.stringify(value);
// 	// 				}
// 	// 				storage.setItem(middleware+"/"+uri+"/"+index+"/"+key, value);
// 	// 			}
// 	// 		}
// 	// 	};
// 	// 	return manager;
// 	// }
// }
