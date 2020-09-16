KarmaFields.fields.dropdown = function(field) {
	return {
		tag: "select",
		class: "dropdown",
		init: function(select, render, args) {
			select.addEventListener("change", function() {
				field.setValue(select.value);
			});
		},
		update: function(select, render, args) {
			field.fetchValue().then(function(value) { // -> maybe undefined
				select.value = value;
			});
			Promise.resolve(field.resource.options || field.fetchOptions()).then(function(results) {
				// results.items.forEach(function(item) {
				// 	select[item.key] = new Option(item.name, item.key);
				// });
				var value = field.getValue();
				args.children = results.items.map(function(item) {
					return {
						tag: "option",
						update: function(option) {
							option.textContent = item.name;
							option.value = item.key;
							option.selected = value === item.key;
						}
					};
				});
				// if (field.resource.key === "spectacle") {
				// 	console.log(field.input, args.children.length);
				// }
				render();
			});
		}
	};
}
