KarmaFields.fields.group = function(field) {
	return {
		className: "karma-field-group display-"+(field.resource.display || "block"),
		init: function(group) {
			if (field.resource.style) {
				this.style = field.resource.style;
			}
			this.kids = (field.resource.children || []).map(function(resource) {
				return {
					className: "karma-field-item",
					init: function() {
						if (resource.container_style) {
							this.style = resource.container_style;
						}
					},
					kids: field.createChild(resource).build()
				};
			});
		}
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
