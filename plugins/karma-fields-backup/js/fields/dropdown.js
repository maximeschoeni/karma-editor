KarmaFields.fields.dropdown = function(field) {
	return {
		tag: "select",
		class: "dropdown",
		init: function() {
			this.element.id = field.getId();
			this.element.addEventListener("change", function() {
				field.setValue(this.value);
			});
		},
		update: function(dropdown) {
			field.fetchValue().then(function(value) { // -> maybe undefined
				dropdown.element.value = value || "";
			});
			Promise.resolve(field.resource.options || field.fetchOptions()).then(function(results) {
				// results.items.forEach(function(item) {
				// 	select[item.key] = new Option(item.name, item.key);
				// });
				var value = field.getValue();
				var valueExist = false;
				dropdown.children = results.items.map(function(item) {
					if (value === item.key) {
						valueExist = true;
					}
					return {
						tag: "option",
						update: function() {
							this.element.textContent = item.name;
							this.element.value = item.key;
							this.element.selected = value === item.key;
						}
					};
				});
				if (!valueExist && results.items.length) {
					field.setValue(results.items[0].key);
				}
				dropdown.render();
			});
		}
	};
}
