KarmaFields.fields.textarea = function(field) {
	return KarmaFields.build({
		tag: "textarea",
		init: function(input) {
			input.id = field.id;
			input.addEventListener("input", function() {
				field.set(input.value).then(function() {
					if (field.isModified != field.wasModified) {
						field.history.save();
					}
					field.save();
				});
			});
			// field.fetch().then(function(value) {
			// 	input.value = value || "";
			// });
			// field.fetchPlaceholder().then(function(value) {
			// 	input.placeholder = value || "";
			// });
			field.onUpdate = function(value) {
				input.value = value || "";
			}
			field.onInherit = function(value) {
				input.placeholder = value || "";
			}
			field.onFocus = function() {
				input.focus();
			}
			field.onBlur = function() {
				input.blur();
			}
			field.fetch().then(function(value) {
				input.value = value || "";
			});
			if (field.resource.width) {
				input.style.width = field.resource.width;
			}
			if (field.resource.height) {
				input.style.height = field.resource.height;
			}
		}
	});
}
