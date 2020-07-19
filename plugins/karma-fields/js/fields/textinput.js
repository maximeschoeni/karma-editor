KarmaFieldMedia.fields.textinput = function(field) {
	return build({
		class: "karma-field text-input",
		init: function(element, update) {
			field.render = update;
			update();
		},
		children: function() {
			return [
				field.resource.label && build({
					tag: "label",
					init: function(label) {
						label.htmlFor = field.id;
						label.innerHTML = field.resource.label;
					}
				}),
				build({
					tag: "input",
					class: "karma-field-input",
					init: function(input) {
						input.type = field.resource.type || "text";
						input.id = field.id;

						input.addEventListener("input", function() {
							field.set(input.value).then(function() {
								if (field.isModified != field.wasModified) {
									field.history.save();
								}
								field.save();
							});
						});
						// input.addEventListener("blur", function() {
						// 	field.blur();
						// });
						// field.onInherit = function(value) {
						// 	input.placeholder = value || "";
						// }
						// field.onUpdate = function(value) {
						// 	input.value = value || "";
						// }
						field.fetch().then(function(value) {
							input.value = value || "";
						});
						field.fetchPlaceholder().then(function(value) {
							input.placeholder = value || "";
						});

						field.onFocus = function() {
							input.focus();
						}
						field.onBlur = function() {
							input.blur();
						}
					}
				}),
				build({
					class: "field-info",
				})
			];
		}
	});
}
