KarmaFields.Field = function(resource) {
	let field = {
		directory: {},
		children: [],
		resource: resource || {},
		data: {},
		events: {},
		requests: {},

		getId: function() {
			let id = this.resource.key || "";
			if (this.parent) {
				id = this.parent.getId()+"-"+id;
			}
			return id;
		},
		add: function(child) {
			// let child = KarmaFields.Field();
			if (child.resource.key) {
				this.children.push(child);
				this.directory[child.resource.key] = child;
				child.parent = this;
			} else {
				console.log(child.resource);
				console.error("No key!");
			}
		},
		createChild: function(resource) {
			let child = KarmaFields.Field(resource);
			this.add(child);
			return child;
		},
		get: function(key) {
			return this.directory[key];
		},

		trigger: function(eventName, ...param) {
			if (this.events[eventName]) {
				return this.events[eventName].call(this, ...param);
			} else if (this.parent) {
				return this.parent.trigger.call(this.parent, eventName, ...param);
			}
		},

		getModifiedValue: function() {
			let value;
			if (this.children.length) {
				this.children.forEach(function(child) {
					let childValue = child.getModifiedValue();
					if (childValue !== undefined && child.resource.key) {
						if (!value) {
							value = {};
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
					value[child.resource.key] = child.getValue();
				});
			} else {
				value = this.value;
			}
			return value;
		},
		setValue: function(value, context) { // context = {'change' | 'set' | 'undo'}
			if (value !== this.lastValue) {
				this.lastValue = value;
				if (!context) {
					context = "change";
				}
				if (this.children.length) {
					this.children.forEach(function(child) {
						if (value && child.key && value[child.key] !== undefined) {
							child.setValue(value[child.key], context);
						}
					});
				} else {
					this.value = value;
					this.isModified = this.value !== this.originalValue;
					this.trigger("update");
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
					if (context === "change") {
						this.trigger("change", this);
					}
				}
			}
		},
		getPath: function(fromField) {
			let path = this.resource.key || "";
			if (this.parent && this.parent !== fromField) {
				path = this.parent.getPath()+"/"+path
			}
			return path;
		},
		getRoot: function() {
			if (this.parent) {
				return this.parent.getRoot();
			} else {
				return this;
			}
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
	field.value = field.resource.value || field.resource.default;
	field.originalValue = field.value;

	return field;
};
