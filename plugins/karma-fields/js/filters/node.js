KarmaFieldMedia.filters.node = function(filterManager) {
	return build({
		class: "filter-node "+filterManager.resource.name,
		children: function() {
			return [
				build({
					tag: "h4",
					text: function() {
						return filterManager.resource.title || filterManager.resource.name;
					}
				}),
				build({
					class: "filter-node-content",
					child: function() {
						return filterManager.build();
					}
				}),
				build({
					class: "filter-node-children",
					children: function() {
						return filterManager.getChildren().map(function(child) {
							return KarmaFieldMedia.filters.node(child);
						});
					}
				})
			];
		},
		init: function(element, update) {
			filterManager.renderNode = update;
			update();
		}
	});
}
