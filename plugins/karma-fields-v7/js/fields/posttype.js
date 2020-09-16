KarmaFields.fields.posttype = function(manager) {
	return {
		class: "posttype",
		child: {
			tag: "h1",
			init: function(element) {
				element.textContent = manager.resource.title;
			}
		}
	};
}
