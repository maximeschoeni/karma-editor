KarmaFields.fields.search = function(fieldManager) {
	return {
		className: "search",
		tag: "input",
		init: function(input) {
			this.type = "search";
			this.placeholder = fieldManager.resource.title || "Search";
			this.addEventListener("input", function(event) {
				if (this.value.length !== 1) {
					fieldManager.setValue(this.value, "input");
				}
			});
			this.addEventListener("search", function() {
				fieldManager.setValue(this.value, "search");
			});

			if (fieldManager.resource.style) {
				this.style = fieldManager.resource.style;
			}
		},
		update: function() {
			this.value = fieldManager.getValue() || "";
		}
	};
}
