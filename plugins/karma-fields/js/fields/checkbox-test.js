// KarmaFields.fields.checkboxtest = function(field) {
// 	var manager = {};
// 	return KarmaFields.build({
// 		class: "on-off-container",
// 		init: function(element, update) {
// 			manager.update = update;
// 			field.onUpdate = function(value) {
// 				manager.isOn = parseInt(value) || false;
// 				manager.update();
// 			};
// 			field.fetch().then(field.onUpdate);
// 		},
// 		child: function() {
// 			return KarmaFields.includes.icon({
// 				tag: "button",
// 				url: function() {
// 					return KarmaFields.icons_url+"/"+(manager.isOn ? "yes.svg" : "no-alt.svg");
// 				},
// 				// url: KarmaFields.icons_url+"/"+(manager.isOn ? "yes.svg" : "no-alt.svg"),
// 				init: function(element) {
// 					element.classList.add(manager.isOn ? "on" : "off");
// 					element.addEventListener("click", function() {
// 						if (field.history) {
// 							field.history.save();
// 						}
//
// 						manager.isOn = !manager.isOn;
// 						field.set(manager.isOn ? 1 : 0);
// 						manager.update();
// 						field.changeOthers(manager.isOn ? 1 : 0);
// 					});
// 				}
// 			});
// 		}
// 	});
// }


KarmaFields.fields.checkboxtest = function(field) {
	var isOn;
	return KarmaFields.includes.icon({
		tag: "button",
		class: "on-off",
		url: function() {
			return KarmaFields.icons_url+"/"+(isOn ? "yes.svg" : "no-alt.svg");
		},
		// url: KarmaFields.icons_url+"/"+(manager.isOn ? "yes.svg" : "no-alt.svg"),
		init: function(element, update) {
			element.addEventListener("click", function() {
				if (field.history) {
					field.history.save();
				}
				isOn = !isOn;
				field.set(isOn ? "1" : "0");
				field.changeOthers(isOn ? "1" : "0");
				element.classList.toggle("on", isOn);
				update();
			});
			field.onUpdate = function(value) {
				isOn = parseInt(value) || false;
				element.classList.toggle("on", isOn);
				update();
			};

			field.fetch().then(field.onUpdate);
		}
	});
}
