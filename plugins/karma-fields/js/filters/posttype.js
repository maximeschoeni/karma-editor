KarmaFieldMedia.filters.posttype = function(filterManager) {
	return build({
		class: "filter-item filter-posttype",
		child: function() {
			return build({
				tag: "h1",
				text: function() {
					return filterManager.resource.title;
				}
			});
		}
	});
}
