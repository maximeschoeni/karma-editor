KarmaFields.fields.group = function(field) {
	return {
		class: "karma-field-group display-"+(field.resource.display || "block"),
		init: function(element, render, args) {
			if (field.resource.style) {
				element.style = field.resource.style;
			}
			args.children = (field.resource.children || []).map(function(resource) {
				return {
					class: "karma-field-item",
					init: function(element) {
						if (resource.container_style) {
							element.style = resource.container_style;
						}
					},
					children: field.createChild(resource).build()
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
