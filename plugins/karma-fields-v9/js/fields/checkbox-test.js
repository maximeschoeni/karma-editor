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
		update: function() {
			this.child = KarmaFields.includes.icon({
				file: KarmaFields.icons_url+"/"+(field.getValue() === "1" ? "yes.svg" : "no-alt.svg")
			});
		}
	};
}
