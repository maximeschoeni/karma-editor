KarmaFields.fields.posttype = function(manager) {
	return {
		class: "posttype",
		child: {
			tag: "h1",
			init: function() {

				this.element.textContent = manager.resource.title;
			}
		}
	};
}
