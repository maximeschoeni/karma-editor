KarmaFieldMedia.filters.search = function(filterManager) {
	// var filterManager = KarmaFieldMedia.managers.filter(manager, filter);
	return build({
		class: "filter-item filter-search",
		child: function(options) {
			return build({
				tag: "input",
				init: function(element) {
					element.type = "search";
					element.placeholder = filterManager.resource.title || "Search";
					element.addEventListener("search", function() {
						filterManager.set(encodeURIComponent(this.value))
					});
				}
			});



			// return [
			// 	build({
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
			// 	// build({
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
