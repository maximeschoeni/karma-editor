KarmaFields.fields.dropdown = function(field) {
	var options = field.resource.options;
	var select;
	return KarmaFields.build({
		tag: "select",
		init: function(element, update) {
			select = element;
			element.id = field.id;
			element.addEventListener("change", function() {
				field.history.save();
				field.set(element.value);
				field.changeOthers(element.value);
			});
			field.onUpdate = function(value) {
				if (!options) {
					field.fetchOptions().then(function(results) {
						options = results.items;
						update();
					});
				} else {
					update();
				}
			};
			field.fetch().then(field.onUpdate);

			field.onFocus = function() {
				element.focus();
			}
			field.onBlur = function() {
				element.blur();
			}
		},
		children: function() {
			var value = field.get();

			// return [{
			// 	key: "",
			// 	name: "-"
			// }].concat(options || []).map(function(option) {
			// 	return KarmaFields.build({
			// 		tag: "option",
			// 		init: function(element) {
			// 			element.innerText = option.name;
			// 			element.value = option.key;
			// 			element.selected = value === option.key;
			// 		}
			// 	})
			// });
			if (options) {
				if (value === undefined && options.length > 0) {
					field.set(options[0].key);
				}
				return options.map(function(option) {
					return KarmaFields.build({
						tag: "option",
						init: function(element) {
							element.innerText = option.name;
							element.value = option.key;
							element.selected = value === option.key;
						}
					})
				});
			}

		}
	});
}
