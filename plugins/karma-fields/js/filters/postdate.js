KarmaFieldMedia.filters.postdate = function(filterManager) {
	return build({
		tag: "select",
		class: "karma-filter",
		children: function(options) {
			return [
				build({
					tag: "option",
					init: function(element) {
						element.value = "";
						element.innerText = "–";
					}
				})
			].concat(options.map(function(option) {
				return build({
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
		},
		init: function(element, update) {
			element.addEventListener("change", function() {
				filterManager.set(this.value);
			});
			// manager.requestFilterOptions("postdate").then(function(results) {
			// 	update(results.map(function(result) {
			// 		return {
			// 			value: result.year+"-"+result.month,
			// 			title: result.month_name+"-"+result.year
			// 		};
			// 	}));
			// });
			filterManager.render = update;
			filterManager.update();
			update([]);
		}
	})
}
