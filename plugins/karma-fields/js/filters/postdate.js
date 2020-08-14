// KarmaFields.filters.postdate = function(filterManager) {
// 	return KarmaFields.build({
// 		tag: "select",
// 		class: "karma-filter",
// 		children: function(options) {
// 			return [
// 				KarmaFields.build({
// 					tag: "option",
// 					init: function(element) {
// 						element.value = "";
// 						element.innerText = "–";
// 					}
// 				})
// 			].concat(options.map(function(option) {
// 				return KarmaFields.build({
// 					tag: "option",
// 					init: function(element) {
// 						element.value = option.value;
// 						element.innerText = option.title;
// 						element.checked = option.value === filterManager.value;
// 						// if (option.count != option.total) {
// 						// 	element.innerText += " ("+(option.count || 0)+"/"+(option.total || 0)+")"
// 						// } else {
// 						// 	element.innerText += " ("+(option.total || 0)+")"
// 						// }
// 					}
// 				})
// 			}))
// 		},
// 		init: function(element, update) {
// 			element.addEventListener("change", function() {
// 				filterManager.set(this.value);
// 			});
// 			// manager.requestFilterOptions("postdate").then(function(results) {
// 			// 	update(results.map(function(result) {
// 			// 		return {
// 			// 			value: result.year+"-"+result.month,
// 			// 			title: result.month_name+"-"+result.year
// 			// 		};
// 			// 	}));
// 			// });
// 			filterManager.render = update;
// 			filterManager.update();
// 			update([]);
// 		}
// 	})
// }


KarmaFields.filters.postdate = function(filterManager) {

	return KarmaFields.build({
		class: "filter-item filter-select",
		children: function() {
			return [
				KarmaFields.build({
					tag: "h4",
					text: function() {
						return filterManager.resource.title || filterManager.resource.name;
					}
					// child: function() {
					// 	return KarmaFields.build({
					// 		class: "table-spinner"
					// 	});
					// }
				}),

				KarmaFields.build({
					tag: "select",
					init: function(element, update) {
						element.addEventListener("change", function() {
							filterManager.set(this.value);
						});
						filterManager.options = [];
						filterManager.render = update;
						filterManager.update();
						update();
					},
					children: function() {
						return [
							KarmaFields.build({
								tag: "option",
								init: function(element) {
									element.value = "";
									element.innerText = "–";
								}
							})
						].concat(filterManager.options.map(function(option) {
							return KarmaFields.build({
								tag: "option",
								init: function(element) {
									element.value = option.value;
									element.innerText = option.title;
									element.checked = option.value === filterManager.value;
									// if (option.count != option.total) {
									// 	element.innerText += " ("+(option.count || 0)+"/"+(option.total || 0)+")"
									// } else {
									// 	element.innerText += " ("+(option.total || 0)+")"
									// }
								}
							})
						}))
					}

				})
			];
		}

		// init: function(element, update) {
		// 	element.addEventListener("change", function() {
		// 		element.classList.add("loading");
		// 		update();
		// 		filterManager.set(this.value).then(function() {
		// 			element.classList.remove("loading");
		// 			update();
		// 		});
		// 	});
		// 	filterManager.render = update;
		// 	filterManager.update();
		// 	update([]);
		// }
	})
}
