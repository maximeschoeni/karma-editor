
KarmaFields.fields.checkboxtest = function(field) {
	return {
		tag: "button",
		class: "on-off",
		init: function(button) {
			this.element.addEventListener("click", function() {
				//
				// var output = KarmaFields.Object.getValue(field.args.history, ["output", field.args.path, "presence"]);
				//
				// console.log(output);
				// output = KarmaFields.Object.clone(output);
				var value = field.getValue();

				// value = parseInt(value || 0);
				field.setValue(value === "1" ? "0" : "1");

				// console.log(KarmaFields.Object.getValue(field.args.history, ["output", field.args.path, "presence"]));
				button.render();
			});
			field.fetchValue().then(function(value) {
				button.render();
			});
		},
		child: {
			update: function () {
				var value = field.getValue() || 0;
				// console.log(KarmaFields.Object.getValue(field.args.history, ["output", field.args.path, "presence"]));
				var file = value === "1" ? "yes.svg" : "no-alt.svg";
				this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/"+file);
			}
		}
		// update: function() {
		// 	var file = parseInt(field.getValue()) ? "yes.svg" : "no-alt.svg";
		//
		// }
		// child: {
		// 	class: "icon",
		// 	update: function() {
		// 		var value = parseInt(field.getValue());
		// 		this.element.classList.toggle("on", value);
		// 		this.element.classList.toggle("off", !value);
		// 	}
		// }
	};
}
