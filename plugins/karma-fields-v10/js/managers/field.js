KarmaFields.Field = function(resource, parent, events) {
	let field = {
		parent: parent,
		directory: {},
		children: [],
		resource: resource || {},
		data: {},
		events: events || {},
		requests: {},

		getId: function() {
			let id = this.resource.key || this.resource.type || "group";
			if (this.parent) {
				id = this.parent.getId()+"-"+id
			}
			return id;
		},
		// add: function(child) {
		// 	// let child = KarmaFields.Field();
		// 	if (child.resource.key) {
		// 		this.children.push(child);
		// 		this.directory[child.resource.key] = child;
		// 		child.parent = this;
		// 	} else {
		// 		console.log(child.resource);
		// 		console.error("No key!");
		// 	}
		// },
		createChild: function(resource) {
			return KarmaFields.Field(resource, this);
		},
		get: function(key) {
			if (this.directory[key]) {
				return this.directory[key];
			} else if (this.children.length) {
				// return this.children.find(function(child) {
				// 	return child.get(key);
				// });
				for (let i = 0; i < this.children.length; i++) {
					const child = this.children[i].get(key);
					if (child) {
						return child;
					}
				}
			}
		},
		getByKeyPath: function(keys) {
			if (keys.length === 1) {
				return this.get(keys[0]);
			} else if (keys.length > 1) {
				keys.shift();
				return this.getByKeyPath(keys);
			}
		},
		getByPath: function(path) {
			return this.getByKeyPath(path.split("/"));
		},


		trigger: function(eventName, ...param) {
			if (this.events[eventName]) {
				return this.events[eventName].call(this, ...param);
			} else if (this.parent) {
				return this.parent.trigger.call(this.parent, eventName, ...param);
			}
		},
		// triggerUp: function(eventName, ...param) {
		// 	if (this.children.length) {
		// 		this.children.forEach(function(child) {
		// 			child.triggerUp(eventName, ...param)
		// 		});
		// 	} else {
		// 		this.events[eventName](...param);
		// 	}
		// },

		getModifiedValue: function() {
			let value;
			if (this.children.length) {
				this.children.forEach(function(child) {
					let childValue = child.getModifiedValue();
					// if (childValue !== undefined && child.resource.key) {
					// 	if (!value) {
					// 		value = {};
					// 	}
					// 	value[child.resource.key] = childValue;
					// }
					if (childValue !== undefined) {
						if (!value) {
							value = {};
						}
						if (child.resource.key) {
							value[child.resource.key] = childValue;
						} else {
							Object.assign(value, childValue);
						}
						value[child.resource.key] = childValue;
					}
				});
			} else {
				if (this.value !== this.originalValue) {
					return this.value;
				}
			}
			return value;
		},

		getValue: function() {
			let value;
			if (this.children.length) {
				value = {};
				this.children.forEach(function(child) {
					if (child.resource.key) {
						value[child.resource.key] = child.getValue();
					} else {
						Object.assign(value, child.getValue());
					}
				});
			} else {
				value = this.parse(this.value);

				// if (this.resource.datatype) {
				// 	if (this.resource.datatype === "array") {
				// 		value = value.split(",");
				// 	} else if (this.resource.datatype === "object") {
				// 		value = JSON.parse(value);
				// 	}
				// }
			}
			return value;
		},
		setValue: function(value, context) { // context = {'change' | 'set' | 'undo'}


			if (!context) {
				context = "change";
			}
			if (this.children.length) {
				if (value && typeof value === "object") {
					for (let key in value) {
						const child = this.get(key);
						if (child) {
							child.setValue(value[key], context);
						}
					}
				}
				// this.children.forEach(function(child) {
				// 	if (value && child.key && value[child.key] !== undefined) {
				// 		child.setValue(value[child.key], context);
				// 	}
				// });
			} else {

				value = this.sanitize(value);

				// if (value !== this.lastValue) {


					// if (this.resource.datatype) {
					// 	if (this.resource.datatype === "array") {
					// 		if (!Array.isArray(value)) {
					// 			console.error("Field setValue() expects an array");
					// 		}
					// 		value = value.join(",");
					// 	} else if (this.resource.datatype === "object") {
					// 		value = JSON.stringify(value);
					// 	}
					// }



					this.value = value;

// console.log("setValue", this.resource.key, value);


					// this.trigger(context);
					// if (context && this.resource.submit_mode === context) {
					// 	this.trigger("submit");
					// }
					if (context === "set") {
						this.originalValue = value;
						this.history.save();
						this.trigger("render");
					}
					if (context === "undo") {
						// this.trigger("render");
					}
					if (context === "change" && value !== this.lastValue) {
						this.trigger("save", this);
					}

					this.isModified = value !== this.originalValue;
					this.lastValue = value;
					this.trigger("update");

				// }
			}
		},
		getPath: function(fromField) {
			let keys = [];
			if (this.resource.key) {
				keys.push(this.resource.key);
			}
			if (this.parent && this.parent !== fromField) {
				keys.push(this.parent.getPath(fromField));
			}
			return keys.join("/");

			// let path = this.resource.key || "";
			// if (this.parent && this.parent !== fromField) {
			// 	path = this.parent.getPath()+"/"+path
			// }
			// return path;
		},
		getRoot: function() {
			if (this.parent) {
				return this.parent.getRoot();
			} else {
				return this;
			}
		},
		sanitize: function(value) {
			if (typeof value !== "string") {
				value = JSON.stringify(value);
			}
			return value;
		},
		parse: function(value) {
			if (this.resource.datatype === "object") {
				value = value && JSON.parse(value) || {};
			} else if (this.resource.datatype === "array") {
				value = value && JSON.parse(value) || [];
			} else if (this.resource.datatype === "number") {
				value = value && JSON.parse(value) || 0;
			} else if (this.resource.datatype === "boolean") {
				value = value && JSON.parse(value) || false;
			}
			return value;
		},

		fetch: function() {
			return this.trigger("get", this);
		},



		history: {
			undos: {},
			save: function() {
				let index = KarmaFields.History.getIndex(field);
				this.undos[index] = field.value;
			},
			go: function(index) {
				if (this.undos[index]) {
					field.setValue(this.undos[index], "undo");
				}
				field.children.forEach(function(child) {
					child.history.go(index);
				});
			},
			delete: function(index) {
				this.undos[index] = undefined;
				field.children.forEach(function(child) {
					child.history.delete(index);
				});
			}
		}
	}

	field.value = resource.value || resource.default;
	field.originalValue = field.value;

	if (parent) {
		parent.children.push(field);
		if (resource.key) {
			parent.directory[resource. key] = field;
		}
	}

	if (resource.children) {
		resource.children.forEach(function(child) {
			KarmaFields.Field(child, field);
		});
	}

	return field;
};
