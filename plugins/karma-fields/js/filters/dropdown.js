
KarmaFields.filters.dropdown = function(filterManager) {

	return KarmaFields.build({
		class: "filter-dropdown",
		children: function() {
			return [
				KarmaFields.build({
					tag: "h4",
					text: function() {
						return filterManager.resource.title || filterManager.resource.name;
					}
				}),
				KarmaFields.build({
					tag: "select",
					init: function(element, update) {


						element.addEventListener("change", function() {
							filterManager.set(this.value);
						});

						filterManager.fetch().then(function(options) {
							filterManager.options = options.items;
							update();
						});
						// filterManager.onUpdate = function(value) {
						// 	element.value = value;
						// }
						update();

					},
					children: function() {
						var options = [{
							key: "",
							name: "-"
						}].concat(filterManager.options || []);
						return options.map(function(option) {
							return KarmaFields.build({
								tag: "option",
								init: function(element) {
									element.value = option.key;
									element.innerHTML = option.name;
									// if (option.key === filterManager.value) {
									if (option.key === filterManager.getValue()) {
										element.selected = true;
									}
								}
							})
						})
					}
				})
			];
		}

	})
}
