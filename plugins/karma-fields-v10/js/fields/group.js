KarmaFields.fields.group = function(field) {
	return {
		class: "karma-field-group display-"+(field.resource.display || "block"),
		init: function(group) {
			if (field.resource.style) {
				this.element.style = field.resource.style;
			}

			(field.resource.children || []).map(function(resource) {
				if (resource.key) {
					child = field.get(value.id) || field.createChild(resource);
				}


			});


		},
		update: function(group) {




			if (field.resource.label) {
				this.children = [
					{
						tag: "label",
						init: function(label) {
							this.element.htmlFor = manager.getId();
							this.element.innerText = manager.resource.label;
						}
					},
					KarmaFields.fields[manager.resource.name || manager.resource.field || "group"](manager)
				];
			} else {
				return [
					KarmaFields.fields[manager.resource.name || manager.resource.field || "group"](manager)
				];
			}
		},
		children: (field.resource.children || []).map(function(resource) {
			return {
				class: "karma-field-item",
				init: function() {
					if (resource.container_style) {
						this.element.style = resource.container_style;
					}
					this.element._field = field.createChild(resource);
				},
				update: function() {
					this.children = this.element._field.build()
				}
				// children: field.createChild(resource).build()
			};
		})
		// children: function() {
		// 	var children = (field.resource.children || []).map(function(resource) {
		// 		return field.createChild(resource);
		// 	});
		// 	field.onUpdate = function() {
		// 		children.forEach(function(child) {
		// 			child.update();
		// 		});
		// 	}
		// 	field.onRemove = function(value) {
		// 		children.forEach(function(child) {
		// 			child.remove();
		// 		});
		// 	}
		// 	return children.map(function(child) {
		// 		return child.build();
		// 	});
		// }
	};
}
