KarmaFields.fields.textarea = function(field) {
	return {
		tag: "textarea",
		init: function(input, render, args) {
			input.id = field.id;

			// input.addEventListener("input", function(event) {
			// 	if (!isSaved && field.history) {
			// 		field.history.save();
			// 		isSaved = true;
			// 	}
			// 	field.set(input.value);
			// });
			// input.addEventListener("focus", function(event) {
			// 	isSaved = false;
			// });
			// field.onInherit = function(value) {
			// 	input.placeholder = value || "";
			// }
			// field.onModified = function(isModified) {
			// 	input.classList.toggle("modified", isModified);
			// }
			// field.onUpdate = function(value) { // -> historic change
			// 	input.value = value || "";
			// }
			// field.fetch().then(field.onUpdate);


			if (field.resource.readonly) {
				input.readOnly = true;
			} else {
				input.addEventListener("input", function(event) {
					field.setValue(input.value);
				});
			}
			field.fetchValue().then(function(value) { // -> maybe undefined
				args.update = function(input) {
					input.value = field.getValue() || "";
					input.classList.toggle("modified", field.isModified());
				}
			});

			if (field.resource.width) {
				input.style.width = field.resource.width;
			}
			if (field.resource.height) {
				input.style.height = field.resource.height;
			}
		}
	};
}
