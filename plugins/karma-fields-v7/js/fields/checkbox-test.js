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
	return {
		tag: "button",
		class: "on-off",
		init: function(element, render, args) {
			element.addEventListener("click", function() {
				var value = parseInt(field.getValue());
				field.setValue(value ? 0 : 1);
				render();
			});
			field.fetchValue().then(function(value) {
				render();
			});
		},
		child: {
			class: "icon",
			update: function(element) {
				var value = parseInt(field.getValue());
				element.classList.toggle("on", value);
				element.classList.toggle("off", !value);
			}
		}
	};
}
