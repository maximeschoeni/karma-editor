
KarmaFields.fields.checkboxtest = function(field) {
	return {
		tag: "button",
		class: "on-off",
		init: function(button) {
			this.element.addEventListener("click", function() {
				var value = field.getValue();
				field.setValue(value === "1" ? "0" : "1");
				button.render();
			});
			field.fetchValue().then(function(value) {
				button.render();
			});
		},
		child: {
			update: function () {
				var value = field.getValue() || 0;
				var file = value === "1" ? "yes.svg" : "no-alt.svg";
				this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/"+file);
			}
		}
	};
}
