KarmaFields.fields.textarea = function(field) {
	return {
		tag: "textarea",
		init: function(input) {
			this.id = field.getId();

			if (field.resource.readonly) {
				this.readOnly = true;
			} else {
				this.addEventListener("input", function(event) {
					field.setValue(input.value);
				});
			}
			field.fetchValue().then(function(value) { // -> maybe undefined
				input.value = value;
			});

			if (field.resource.style) {
				this.style = field.resource.style;
			}
			if (field.resource.width) {
				this.style.width = field.resource.width;
			}
			if (field.resource.height) {
				this.style.height = field.resource.height;
			}

		},
		update: function() {
			this.value = field.getValue() || "";


		}
	};
}
