KarmaFields.filters.posttype = function(filterManager) {
	return KarmaFields.build({
		class: "filter-item filter-posttype",
		child: function() {
			return KarmaFields.build({
				tag: "h1",
				text: function() {
					return filterManager.resource.title;
				}
			});
		}
	});
}
