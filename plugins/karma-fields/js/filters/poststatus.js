KarmaFieldMedia.filters.poststatus = function(filterManager) {
	// var filterManager = KarmaFieldMedia.managers.filter(manager, filter);
	return build({
		tag: "ul",
		class: "karma-filter post-status",
		children: function(options) {
			// return [{
			// 	title: filter.title || "All",
			// 	value: ""
			// }].concat(options)
			return options.map(function(option) {
				return build({
					tag: "li",
					children: function() {
						return [
							build({
								tag: "a",
								init: function(element, update) {
									if (filterManager.value == option.value) {
										element.classList.add("active");
									}
									element.addEventListener("click", function() {
										// filterManager.toggle(option.value);
										filterManager.set(option.value);
										filterManager.render(options);
									});
									update();
								},
								children: function() {
									return [
										build({
											tag: "span",
											class: "filter-label",
											text: function() {
												return option.title;
											}
										}),
										option.total && build({
											tag: "span",
											class: "filter-count",
											text: function() {
												// if (option.total && option.count && option.count !== option.total) {
												// 	return " ("+option.count+"/"+option.total+")";
												// } else if (option.total) {
													return option.total;
												// }
											}
										})
									];
								}
							})
						];
					}
				});
			});
		},
		init: function(element, update) {
			filterManager.render = update;
			filterManager.update();

			// filterManager.requestOptions().then(function(results) {
			// 	update(results);
			// 	// .map(function(result) {
			// 	// 	return {
			// 	// 		value: result.year+"-"+result.month,
			// 	// 		title: result.month_name+"-"+result.year
			// 	// 	};
			// 	// });
			// });
			update([]);
		}
	})
}
