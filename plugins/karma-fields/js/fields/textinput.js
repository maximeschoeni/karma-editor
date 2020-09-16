KarmaFields.fields.textinput = function(field) {
	return {
		tag: "input",
		class: "text",
		init: function() {
			this.element.type = field.resource.type || "text";
			this.element.id = field.id;
			if (field.resource.readonly) {
				this.element.readOnly = true;
			} else {
				this.element.addEventListener("input", function(event) {
					var value = this.value;
					requestAnimationFrame(function() {
						field.setValue(value);
					});
				});
			}
			if (field.resource.width) {
				this.element.style.width = field.resource.width;
			}
			if (field.resource.style) {
				this.element.style = field.resource.style;
			}
		},
		update: function(input) {
			field.fetchValue().then(function(value) { // -> maybe undefined

				// console.log(field.resource.key, field.args.path, value, field.getValue());

				input.element.value = value || "";
				input.element.classList.toggle("modified", field.isModified());
			});
		}
	};
}
