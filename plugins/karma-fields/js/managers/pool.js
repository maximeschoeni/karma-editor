KarmaFieldMedia.managers.pool = function() {
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
		getAt: function(index, uri, key) {
			if (key) {
				if (this.storage && this.storage[index] && this.storage[index][uri]) {
					return this.storage[index][uri][key];
				}
			} else if (uri) {
				if (this.storage && this.storage[index]) {
					return this.storage[index][uri];
				}
			} else {
				if (this.storage) {
					return this.storage[index];
				}
			}
		},

		// deprecated
		get: function(index, uri, key) {
			var value = this.getAt(index, uri, key);
			while ((value === null || value === undefined) && index > 0) {
				index--;
				value = this.getAt(index, uri, key);
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
		deleteAt: function(index, uri, key) {
			if (key) {
				if (this.storage[index] && this.storage[index][uri] && this.storage[index][uri][key] !== undefined) {
					this.storage[index][uri][key] = undefined;
				}
			} else if (uri) {
				if (this.storage[index] && this.storage[index][uri]) {
					this.storage[index][uri] = undefined;
				}
			} else if (index !== undefined) {
				if (this.storage[index]) {
					this.storage[index] = undefined;
				}
			} else {
				this.storage = [];
			}
		},
		delete: function(index) {
			while (this.storage[index]) {
				this.deleteAt(index);
				index++;
			}
		},
		// deprecated
		setAt: function(value, index, uri, key, type) {
			if (!this.storage) {
				this.storage = {};
			}
			if (!this.storage[index]) {
				this.storage[index] = {};
			}
			if (!this.storage[index][uri]) {
				this.storage[index][uri] = {};
			}
			// if (value && type === "json") {
			// 	value = JSON.stringify(value);
			// }
			this.storage[index][uri][key] = value;

			KarmaFieldMedia.storage = this.storage;
		},
		set: function(index, uri, key, value) {
			if (!this.storage) {
				this.storage = {};
			}
			if (!this.storage[index]) {
				this.storage[index] = {};
			}
			if (!this.storage[index][uri]) {
				this.storage[index][uri] = {};
			}
			this.storage[index][uri][key] = value;

			KarmaFieldMedia.storage = this.storage;
		},
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
// KarmaFieldMedia.pool = {
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
// 					this.storage = KarmaFieldMedia.pool.storage.getItem(middleware) || {};
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
// 				KarmaFieldMedia.pool.storage.setItem(middleware, this.storage);
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
