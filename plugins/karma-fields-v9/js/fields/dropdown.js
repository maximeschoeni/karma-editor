KarmaFields.fields.dropdown = function(field) {
	return {
		tag: "select",
		class: "dropdown",
		init: function(dropdown) {
			this.element.id = field.getId();
			this.element.addEventListener("change", function() {
				field.setValue(this.value, "change");
			});
			field.fetchValue().then(function(value) {
				dropdown.render();
			});
			if (field.resource.style) {
				this.element.style = field.resource.style;
			}
		},
		update: function(dropdown) {
			var value = field.getValue();
			Promise.resolve(field.resource.options || field.fetchOptions()).then(function(results) {

				var items = results.items || results; // compat !
				if (field.resource.novalue !== undefined) {
					items = [{
						key: "",
						name: typeof field.resource.novalue === "string" && field.resource.novalue || "-"
					}].concat(items);
				}
				// if (items.length && items.every(function(item) {
				// 	return item.key != value;
				// })) {
				// 	value = items[0].key;
				// 	field.write(value);
				// }
				if (items.length && items.some(function(item) {
					return item.group;
				})) {
					// optgroups ->
					var groups = items.reduce(function(obj, item) {
						if (!obj[item.group || "default"]) {
							obj[item.group || "default"] = [];
						}
						obj[item.group || "default"].push(item);
						return obj;
					}, {});
					dropdown.children = Object.entries(groups).map(function(entry) {
						return {
							tag: "optgroup",
							update: function() {
								this.element.label = entry[0];
								this.children = entry[1].map(function(item) {
									return {
										tag: "option",
										update: function() {
											this.element.textContent = item.name;
											this.element.value = item.key;
											this.element.selected = value == item.key;
										}
									};
								})
							}
						};
					});

				} else {
					dropdown.children = items.map(function(item) {
						return {
							tag: "option",
							update: function() {
								this.element.textContent = item.name;
								this.element.value = item.key;
								this.element.selected = value == item.key;
							}
						};
					});
				}
				dropdown.render();
				// console.log(dropdown.element, value);
				// dropdown.element.value = value;
			});

		}
	};
}
