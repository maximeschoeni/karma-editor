KarmaFields.filters.posttype = function(filterManager) {
	return {
		class: "filter-item filter-posttype",
		child: {
			tag: "h1",
			init: function(element) {
				return filterManager.resource.title;
			}
		}
	};
}
