
KarmaFields.fields.checkboxtest = function(field) {
	let icon = {
		file: KarmaFields.icons_url+"/no-alt.svg"
	};
	return {
		tag: "button",
		className: "on-off",
		init: function(button) {
			this.addEventListener("click", function() {
				var value = field.getValue();
				// button.kid.file = value === "1" ? "yes.svg" : "no-alt.svg";
				field.setValue(value === "1" ? "0" : "1");
				button.render();
			});
			field.fetchValue().then(function(value) {
				// button.kid.file = value === "1" ? "yes.svg" : "no-alt.svg";
				button.render();
			});
			this.kid = KarmaFields.includes.icon(icon);
			this.kid.update = function () {
				if (field.getValue() === "1") {
					icon.file = KarmaFields.icons_url+"/yes.svg"
				} else {
					icon.file = KarmaFields.icons_url+"/no-alt.svg"
				}
			}
		}
	};
}
