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
					class: "karma-field-group-content",
					init: function(content, update) {
						update();
					},
					children: function() {
						return field.getChildren().map(function(child) {
							return child.build();
						});
					}
				});
// 			];
// 		}
// 	});
}
