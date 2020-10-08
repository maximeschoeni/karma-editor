KarmaFields.fields.dropdown = function(field) {
	return {
		tag: "select",
		class: "dropdown",
		init: function() {
			this.element.id = field.getId();
			this.element.addEventListener("change", function() {

				field.setValue(this.value);
			});
			if (field.resource.style) {
				this.element.style = field.resource.style;
			}
		},
		update: function(dropdown) {


				Promise.resolve(field.resource.options || field.fetchOptions()).then(function(results) {
					// results.items.forEach(function(item) {
					// 	select[item.key] = new Option(item.name, item.key);
					// });

					field.fetchValue().then(function(value) { // -> maybe undefined
						// dropdown.element.value = value || "";



						var items = results.items;

						if (field.resource.novalue !== undefined) {
							items = [{
								key: "",
								name: typeof field.resource.novalue === "string" && field.resource.novalue || "-"
							}].concat(items);
						}

						if (items.every(function(item) {
							return item.key !== value;
						}) && items.length && field.resource.key) {
							value = items[0].key;

							// console.log(field.buffer, field.getPath(), field.resource.key, value);
							// field.history.write(field.buffer, field.getPath(), value);
							field.write(value);
						}

						dropdown.children = items.map(function(item) {
							return {
								tag: "option",
								update: function() {
									this.element.textContent = item.name;
									this.element.value = item.key;
									this.element.selected = value === item.key;
								}
							};
						});
						// if (field.resource.novalue) {
						// 	dropdown.children.unshift({
						// 		tag: "option",
						// 		update: function() {
						// 			this.element.textContent = field.resource.novaluename || "-";
						// 			this.element.value = "";
						// 			this.element.selected = value === "";
						// 		}
						// 	});
						// }
						// if (!valueExist && results.items.length) {
						// 	field.setValue(results.items[0].key, "nav");
						// }

						dropdown.render();

					});



				});


		}
	};
}
