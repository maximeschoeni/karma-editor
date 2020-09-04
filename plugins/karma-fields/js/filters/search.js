KarmaFields.filters.search = function(filterManager) {
	// var filterManager = KarmaFields.managers.filter(manager, filter);
	// var searching;
	var manager = {
		value: ""
	};
	return {
		class: "filter-search",
		children: [
			{
				tag: "h4",
				text: "Search"
			},
			{
				tag: "input",
				init: function(element) {
					element.type = "search";
					element.placeholder = filterManager.resource.title || "Search";
					element.addEventListener("search", function() {
						filterManager.set(this.value);
					});
					// function search() {
					// 	if (element.value.length > 1 && element.value !== value) {
					// 		value = element.value;
					// 		filterManager.set(value).then(function() {
					// 			search();
					// 		});
					// 	}
					// }
					// element.addEventListener("input", function() {
					// 	search();
					// });
				}
			}
		]
	};
}
