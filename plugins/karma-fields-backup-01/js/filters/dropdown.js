
KarmaFields.filters.dropdown = function(filterManager) {

	return {
		class: "filter-dropdown",
		children: [
			{
				tag: "h4",
				text: filterManager.resource.title || filterManager.resource.name
			},
			{
				tag: "select",
				init: function(element, update) {
					element.addEventListener("change", function() {
						filterManager.setValue(this.value);
					});
				},
				update: function(element, render, args) {
					filterManager.fetch().then(function(options) {
						args.children = [{
							key: "",
							name: "-"
						}].concat(options.items).map(function(option) {
							return {
								tag: "option",
								update: function(element) {
									element.value = option.key;
									element.textContent = option.name;
									element.selected = option.key === filterManager.getValue();
								}
							};
						})
						render();
					});
				}
			}
		]

	};
}
