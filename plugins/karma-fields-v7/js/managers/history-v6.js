KarmaFields.managers.history = function(middleware) {
	var history = {
		middleware: "posts",
		index: 0,
		initialIndex: 0,
		total: 0,
		pool: KarmaFields.managers.pool(),
		posts: [],
		archives: [],
		save: function() {

			this.archives[this.index] = JSON.stringify(this.posts);
			this.index++;
			this.pool.deleteUp(this.index);
			if (this.archives.length > this.index) {
				this.archives.splice(this.index, this.archives.length - this.index);
			}
			this.total = this.index;
		},
		undo: function() {
			// console.log("undo", this.pool);
			if (this.index > 0) {
				this.archives[this.index] = JSON.stringify(this.posts);
				this.index--;
				this.posts = JSON.parse(this.archives[this.index]);
				if (this.onUpdate) {
					this.onUpdate();
					// if (manager.render) {
					// 	manager.render();
					// }
					// if (manager.renderFooter) {
					// 	manager.renderFooter();
					// }
				}
			}
		},
		redo: function() {
			if (this.index < this.total) {

				this.index++;
				this.posts = JSON.parse(this.archives[this.index]);

				if (this.onUpdate) {
					this.onUpdate();
					// if (manager.render) {
					// 	manager.render();
					// }
					// if (manager.renderFooter) {
					// 	manager.renderFooter();
					// }
				}
			}
		},
		get: function(uri, key) {
			return this.pool.get(uri, key, this.index);
		},
		set: function(uri, key, value) {
			this.pool.set(uri, key, this.index, value);
		},
		getCurrentValue: function(uri, key) {
			return this.pool.get(uri, key, this.index);
		},
		getInitialValue: function(uri, key) {
			return this.pool.get(uri, key, this.initialIndex);
		},
		setCurrentValue: function(uri, key, value) {
			return this.pool.set(uri, key, this.index, value);
		},
		setInitialValue: function(uri, key, value) {
			return this.pool.set(uri, key, 0, value);
		},

		isModified: function(uri, key, value) {
			var currentValue = this.pool.get(uri, key, this.index);
			var initialValue = this.pool.get(uri, key, this.initialIndex);
			if (currentValue && initialValue) {
				if (typeof currentValue === "object") {
					return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
				} else {
					return currentValue !== initialValue;
				}
			}
			return false;
		}

		// field.history.isModified("options", key, value);


		//
		// getFieldValue: function(field, index) {
		// 	var path = field.post.uri || field.post.pseudo_uri;
		// 	if (field.resource.key) {
		// 		path += "/"+field.resource.key;
		// 	}
		// 	if (field.resource.child_key) {
		// 		path += "/"+field.getParentKey()+"/"+field.resource.child_key;
		// 	}
		// 	return this.getValue(path, index);
		// },
		// setFieldValue: function(field, value) {
		// 	var path = field.post.uri || field.post.pseudo_uri;
		// 	if (field.resource.key) {
		// 		path += "/"+field.resource.key;
		// 	}
		// 	if (field.resource.child_key) {
		// 		path += "/"+field.getParentKey()+"/"+field.resource.child_key;
		// 	}
		// }




		// updatePool: function(uri, key, value) {
		// 	this.pool.setAt(value, this.index, uri, key);
		// }

		// isModified: function(post, key, childKey) {
		// 	var value = this.pool.get(post.uri || post.pseudo_uri, key, this.index);
		// 	var original = this.pool.get(post.uri || post.pseudo_uri, key, this.initialIndex);
		// 	if (childKey) {
		// 		return value[childKey] === original[childKey];
		// 	}
		//
		// },
		//
		// fetch: function(post, key, cache, default) {
		// 	var value = this.pool.get(post.uri || post.pseudo_uri, key, this.index);
		// 	if (value !== undefined) {
		// 		if (typeof value === "object") {
		// 			Object.freeze(value);
		// 		}
		// 		return Promise.resolve(value);
		// 	} else if (key && post[key] !== undefined) {
		// 		if (typeof post[key] === "object") {
		// 			Object.freeze(post[key]);
		// 		}
		// 		this.pool.set(post.uri || post.pseudo_uri, key, 0, post[key]);
		// 		return Promise.resolve(post[key]);
		// 	} else if (post.uri && key && middleware) {
		// 		var path;
		// 		if (KarmaFields.cacheURL && cache) {
		// 			path = KarmaFields.cacheURL+"/"+middleware+"/"+post.uri+"/"+cache;
		// 		} else {
		// 			path = KarmaFields.getURL+"/"+middleware+"/"+post.uri+"/"+key;
		// 		}
		// 		return fetch(path, {
		// 			cache: "reload"
		// 		}).then(function(response) {
		// 			if (!cache || cache.slice(-5) === ".json") {
		// 				return response.json();
		// 			} else {
		// 				return response.text();
		// 			}
		// 		}).then(function(value) {
		// 			history.pool.set(post.uri, key, 0, value);
		// 			return value;
		// 		});
		// 	} else { // added item
		// 		return Promise.resolve(default);
		// 	}
		// },



	};
	return history;
}
