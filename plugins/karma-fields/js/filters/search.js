KarmaFields.filters.search = function(filterManager) {
	// var filterManager = KarmaFields.managers.filter(manager, filter);
	// var searching;
	var value = "";

	return KarmaFields.build({
		class: "filter-search",
		children: function(options) {
			return [
				KarmaFields.build({
					tag: "h4",
					text: function() {
						return "Search";
					}
				}),
				KarmaFields.build({
					tag: "input",
					init: function(element) {
						element.type = "search";
						element.placeholder = filterManager.resource.title || "Search";
						element.addEventListener("search", function() {
							filterManager.set(this.value);
						});
						function search() {
							if (element.value.length > 1 && element.value !== value) {
								value = element.value;
								filterManager.set(value).then(function() {
									search();
								});
							}
						}
						element.addEventListener("input", function() {
							search();
						});
					}
				})
			];



			// return [
			// 	KarmaFields.build({
			// 		tag: "input",
			// 		init: function(element) {
			// 			element.type = "search";
			// 			element.placeholder = filterManager.resource.title || "Search";
			// 			// element.addEventListener("input", function() {
			// 			// 	if (this.value && this.value.length > 1) {
			// 			// 		tableManager.search = this.value;
			// 			// 	} else {
			// 			// 		tableManager.search = "";
			// 			// 	}
			// 			// });
			//
			// 			element.addEventListener("search", function() {
			// 				filterManager.set(encodeURIComponent(this.value))
			// 			});
			//
			// 		}
			// 	})
			// 	// KarmaFields.build({
			// 	// 	tag: "button",
			// 	// 	class: "button",
			// 	// 	init: function(element) {
			// 	// 		element.innerText = "Search";
			// 	// 		element.addEventListener("click", function() {
			// 	// 			tableManager.request();
			// 	// 		});
			// 	// 	}
			// 	// })
			// ];
		}
	});
}
