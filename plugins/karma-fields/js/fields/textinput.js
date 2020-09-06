KarmaFields.fields.textinput = function(field) {
	var isSaved;
	return {
		tag: "input",
		class: "text",
		init: function(input, render, args) {
			input.type = field.resource.type || "text";
			input.id = field.id;
			if (field.resource.readonly) {
				input.readOnly = true;
			} else {
				input.addEventListener("input", function(event) {
					field.setValue(input.value);
				});
			}
			// field.onInherit = function(value) {
			// 	input.placeholder = value || "";
			// }
			// field.onModified = function(isModified) {
			// 	input.classList.toggle("modified", isModified);
			// }
			// field.onUpdate = function(value) { // -> historic change
			// 	input.value = value || "";
			// }
			field.fetchValue().then(function(value) { // -> maybe undefined
				args.update = function() {
					input.value = field.getValue() || "";
					// input.placeholder = field.getInheritedValue(field.resource.key) || "";
					input.classList.toggle("modified", field.isModified());
				}
				args.update();
			});

			// field.onFocus = function() {
			// 	input.focus();
			// }
			// field.onBlur = function() {
			// 	input.blur();
			// }

			if (field.resource.width) {
				input.style.width = field.resource.width;
			}
		}
	};
}
