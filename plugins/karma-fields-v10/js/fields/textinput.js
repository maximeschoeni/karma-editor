KarmaFields.fields.textinput = function(field) {
	return {
		tag: "input",
		class: "text",
		init: function(input) {
			this.element.type = field.resource.type || "text";
			this.element.id = field.getId();
			if (field.resource.readonly) {
				this.element.readOnly = true;
			} else {
				this.element.addEventListener("input", function(event) {
					field.setValue(this.value, "input");
				});
				this.element.addEventListener("keyup", function(event) {
					if (event.key === "Enter") {
						field.setValue(this.value, "enter");
					}
				});
			}
			if (field.resource.width) {
				this.element.style.width = field.resource.width;
			}
			if (field.resource.style) {
				this.element.style = field.resource.style;
			}
			field.fetchValue().then(function(value) { // -> maybe undefined
				input.element.value = value;
				input.element.classList.toggle("modified", field.isModified());
			});
		},
		update: function() {
			this.element.value = field.getValue() || "";
			this.element.classList.toggle("modified", field.isModified());
		}
	};
}
