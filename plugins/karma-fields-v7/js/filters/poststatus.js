KarmaFields.filters.poststatus = function(filterManager) {
	// var filterManager = KarmaFields.managers.filter(manager, filter);
	return KarmaFields.build({
		tag: "ul",
		class: "filter-item filter-post-status",
		init: function(element, update) {
			filterManager.render = update;
			filterManager.options = [{
				value: "",
				title: "All",
				total: "0"
			}];
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



			update();
		},
		children: function() {


			// return [{
			// 	title: filter.title || "All",
			// 	value: ""
			// }].concat(options)
			return filterManager.options.map(function(option) {
				return KarmaFields.build({
					tag: "li",
					children: function() {
						return [
							KarmaFields.build({
								tag: "a",
								init: function(element, update) {
									if (filterManager.value == option.value) {
										element.classList.add("active");
									}
									element.addEventListener("click", function() {
										// filterManager.toggle(option.value);
										// filterManager.table.loading = true;
										filterManager.set(option.value).then(function() {
											// filterManager.table.loading = false;
											filterManager.render(options);
										});
										filterManager.render(options);
									});
									update();
								},
								children: function() {
									return [
										KarmaFields.build({
											tag: "span",
											class: "filter-label",
											text: function() {
												return option.title;
											}
										}),
										option.total && KarmaFields.build({
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
			// .concat([
			// 	KarmaFields.build({
			// 		tag: "li",
			// 		class: "placeholder"+(filterManager.loading ? " loading" : ""),
			// 		child: function() {
			// 			return KarmaFields.build({
			// 				class: "table-spinner"
			// 			});
			// 		}
			// 	})
			// ]);
		}

	})
}
