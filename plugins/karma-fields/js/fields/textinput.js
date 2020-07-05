KarmaFieldMedia.fields.textinput = function(field) {
	return build({
		class: "karma-field text-input",
		children: function() {
			return [
				field.resource.label && build({
					tag: "label",
					init: function(label) {
						label.htmlFor = field.resource.key;
						label.innerHTML = field.resource.label;
					}
				}),
				build({
					tag: "input",
					class: "karma-field-input",
					init: function(input) {
						field.input = input;
						input.type = field.resource.type || "text";
						// input.id = field.resource.key;
						// field.default().then(function(result) {
						// 	input.placeholder = result;
						// });
						// field.original().then(function(result) {
						// 	// input.value = result || "";
						// 	field.onUpdate();
						// });


						input.addEventListener("input", function() {
							field.set(input.value);
						});
						field.onDefault = function(value) {
							input.placeholder = value || "";
						}
						field.onUpdate = function(value) {
							input.value = value || "";
						}
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
