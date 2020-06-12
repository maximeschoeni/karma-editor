KarmaFieldMedia.filters.posttype = function(filterManager) {
	return build({
		tag: "h1",
		text: function() {
			return filterManager.resource.title;
		}
	});
}
