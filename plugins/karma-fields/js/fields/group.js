KarmaFieldMedia.fields.group = function(field) {
	// return build({
	// 	class: "karma-field-group",
	// 	init: function(group, update) {
	// 		if (field.resource.class) {
	// 			group.classList.add(field.resource.class);
	// 		}
	// 		update();
	// 	},
	// 	children: function() {
	// 		return [
	// 			field.resource.label && build({
	// 				tag: "label",
	// 				init: function(label) {
	// 					// label.htmlFor = field.id;
	// 					label.innerHTML = field.resource.label;
	// 				}
	// 			}),
				return build({
					class: "karma-field-children",
					// init: function(content, update) {
					// 	update();
					// },
					children: function() {
						var children = (field.resource.children || []).map(function(resource) {
							return field.createChild(resource);
						});
						field.onUpdate = function() {
							children.forEach(function(child) {
								child.update();
								// if (child.onUpdate) {
								// 	if (child.key) {
								// 		child.fetch().then(child.onUpdate);
								// 	} else if (value && child.child_key) {
								// 		child.onUpdate(value[child.child_key]);
								// 	} else {
								// 		child.onUpdate(value);
								// 	}
								// }
							});
						}
						field.onRemove = function(value) {
							children.forEach(function(child) {
								child.remove();
								// if (child.onRemove) {
								// 	child.onRemove();
								// }
							});
						}
						return children.map(function(child) {
							return child.build();
						});
					}
				});
// 			];
// 		}
// 	});
}
