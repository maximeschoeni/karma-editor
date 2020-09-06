KarmaFields.fields.dropdown = function(field) {
	var options = field.resource.options;
	return {
		tag: "select",
		init: function(select, update, args) {
			select.id = field.id;
			select.addEventListener("change", function() {
				field.setValue(select.value);
			});
			field.fetchValue().then(function(value) { // -> maybe undefined
				args.update = function(input) {
					select.value = field.getValue();
					field.fetchOptions().then(function(results) {
						args.children = results.items.map(function(item) {
							return {
								tag: "option",
								update: function(option) {
									option.innerText = item.name;
									option.value = item.key;
									option.selected = select.value === item.key;
								}
							};
						});
					});
				};
			});
		}
	};
}
