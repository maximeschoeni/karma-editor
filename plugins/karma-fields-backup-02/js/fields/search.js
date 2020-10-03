KarmaFields.fields.search = function(fieldManager) {
	return {
		class: "search",
		tag: "input",
		init: function(input) {
			this.element.type = "search";
			this.element.placeholder = fieldManager.resource.title || "Search";
			this.element.addEventListener("input", function(event) {
				if (this.value.length !== 1) {
					fieldManager.setValue(this.value);
				}
			});
			this.element.addEventListener("search", function() {
				fieldManager.setValue(this.value);
			});

			if (fieldManager.resource.style) {
				this.element.style = fieldManager.resource.style;
			}
		},
		update: function() {
			this.element.value = fieldManager.getValue() || "";
		}
	};
}
