KarmaFieldMedia.fields.dropdown = function(field) {
	return build({
		tag: "select",
		init: function(element, update) {
			element.id = field.id;
			element.addEventListener("change", function() {
				field.history.save();
				field.set(element.value);
			});

			field.onUpdate = update;
			field.fetch().then(update);

			field.onFocus = function() {
				element.focus();
			}
			field.onBlur = function() {
				element.blur();
			}
		},
		children: function() {
			var value = field.get();
			return field.resource.options.map(function(option) {
				return build({
					tag: "option",
					init: function(element) {
						element.innerText = option.name;
						element.value = option.key;
						element.selected = value === option.key;
					}
				})
			})
		}
	});
	// return build({
	// 	class: "karma-field-dropdown",
	// 	children: function() {
	// 		return [
	// 			build({
	// 				tag: "select",
	// 				init: function(element, update) {
	// 					element.id = field.id;
	// 					element.addEventListener("change", function() {
	// 						field.set(element.value).then(function() {
	// 							field.history.save();
	// 							field.save();
	// 						});
	// 					});
	// 					field.fetch().then(function(value) {
	// 						update();
	// 					});
	// 					field.onFocus = function() {
	// 						element.focus();
	// 					}
	// 					field.onBlur = function() {
	// 						element.blur();
	// 					}
	// 				},
	// 				children: function() {
	// 					var value = field.get();
	// 					return field.resource.options.map(function(option) {
	// 						return build({
	// 							tag: "option",
	// 							init: function(element) {
	// 								element.innerText = option.name
	// 								element.selected = value === option.key;
	// 							}
	// 						})
	// 					})
	// 				}
	// 			})
	// 		];
	// 	}
	// });
}
