KarmaFields.fields.dropdown = function(field) {
	// let value;
	let value;
	let items;

	return {
		tag: "select",
		className: "dropdown",
		init: function(dropdown) {
			this.id = field.getId();
			this.addEventListener("change", function() {
				field.setValue(this.value, "change");
			});
			if (field.resource.style) {
				this.style = field.resource.style;
			}
			// .then(function() {
			// 	// dropdown.value = field.getValue();
			// 	value = field.getValue();
			// 	return value;
			// });

			if (field.resource.script_init) {
				(new Function("element", "field", field.resource.script_init))(dropdown, field);
			}
		},
		update: function(dropdown) {


			if (field.resource.script_update) {
				let f = new Function("element", "field", field.resource.script_update);
				f(dropdown, field);
			}

			value = field.getValue();

			return field.fetchValue().then(function() {
				return Promise.resolve(field.getAttribute("options") || field.fetchOptions());
			}).then(function(results) {

				value = field.getValue();

				items = results.items || results; // compat !

				if (field.resource.novalue !== undefined) {
					items = [{
						key: "",
						name: typeof field.resource.novalue === "string" && field.resource.novalue || "-"
					}].concat(items);
				}
				if (items.length && items.every(function(item) {
					return item.key != value;
				})) {
					value = items[0].key;
					field.write(value);
				}


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
					dropdown.kids = Object.entries(groups).map(function(entry) {
						return {
							tag: "optgroup",
							update: function() {

								this.label = entry[0];
								this.kids = entry[1].map(function(item, index) {
									return {
										tag: "option",
										update: function() {
											let item = items[index];
											this.textContent = item.name;
											this.value = item.key;
											this.selected = value == item.key;
										}
									};
								})
							}
						};
					});

				} else {
					dropdown.kids = items.map(function(item, index) {
						return {
							tag: "option",
							update: function() {
								let item = items[index];
								this.textContent = item.name;
								this.value = item.key;
								this.selected = value == item.key;
							}
						};
					});
				}


				dropdown.render();

				// console.log(dropdown, value);
				// dropdown.value = value;
			});

		}
	};
}
