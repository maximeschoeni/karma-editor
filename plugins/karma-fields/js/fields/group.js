KarmaFields.fields.group = function(field) {
	return {
		class: "karma-field-children",
		init: function(element, render, args) {
			args.children = (field.resource.children || []).map(function(resource) {
				return field.createChild(resource).build();
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
