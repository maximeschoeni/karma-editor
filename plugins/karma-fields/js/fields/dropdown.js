KarmaFields.fields.dropdown = function(field) {
	return {
		tag: "select",
		class: "dropdown",
		init: function() {
			this.element.addEventListener("change", function() {
				field.setValue(this.value);
			});
		},
		update: function(dropdown) {
			field.fetchValue().then(function(value) { // -> maybe undefined
				dropdown.element.value = value;
			});
			Promise.resolve(field.resource.options || field.fetchOptions()).then(function(results) {
				// results.items.forEach(function(item) {
				// 	select[item.key] = new Option(item.name, item.key);
				// });
				var value = field.getValue();
				dropdown.children = results.items.map(function(item) {
					return {
						tag: "option",
						update: function() {
							this.element.textContent = item.name;
							this.element.value = item.key;
							this.element.selected = value === item.key;
						}
					};
				});
				dropdown.render();
			});
		}
	};
}
