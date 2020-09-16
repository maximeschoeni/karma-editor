KarmaFields.fields.textarea = function(field) {
	return {
		tag: "textarea",
		init: function(input) {
			input.id = field.id;

			if (field.resource.readonly) {
				this.element.readOnly = true;
			} else {
				this.element.addEventListener("input", function(event) {
					field.setValue(input.element.value);
				});
			}
			field.fetchValue().then(function(value) { // -> maybe undefined
				input.update = function() {
					input.element.value = field.getValue() || "";
					input.element.classList.toggle("modified", field.isModified());
				}
			});

			if (field.resource.width) {
				this.element.style.width = field.resource.width;
			}
			if (field.resource.height) {
				this.element.style.height = field.resource.height;
			}
		}
	};
}
