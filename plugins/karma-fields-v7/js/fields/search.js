KarmaFields.fields.search = function(fieldManager) {
	// var filterManager = KarmaFields.managers.filter(manager, filter);
	// var searching;
	// var manager = {
	// 	value: ""
	// };
	return {
		class: "search",
		tag: "input",
		init: function(element) {
			element.type = "search";
			element.placeholder = fieldManager.resource.title || "Search";
			element.addEventListener("search", function() {
				fieldManager.setValue(this.value);
				fieldManager.tableManager.request();

			});
		}
	};
}
