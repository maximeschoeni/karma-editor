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
						field.original().then(function(result) {
							input.value = result || "";
							field.onUpdate();
						});
						// input.addEventListener("blur", function() {
						// 	field.save(input.value);
						// });
						field.onUpdate = function() {
							if (field.modifiedValue !== undefined) {
								input.classList.add("modified");
							} else {
								input.classList.remove("modified");
							}
						};
						input.addEventListener("input", function() {
							// field.currentValue = input.value;
							field.update(input.value);
							// .then(function(modifiedValue) {
							// 	field.onUpdate();
							// });
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
