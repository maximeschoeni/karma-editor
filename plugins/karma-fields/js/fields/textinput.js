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
						input.id = field.resource.key;
						field.default().then(function(result) {
							input.placeholder = result;
						});
						field.loadValue().then(function(result) {
							input.value = result;
						});
						input.addEventListener("blur", function() {
							field.save(input.value);
						});
					}
				})
			];
		}
	});
}
