// KarmaFields.fields.checkbox = function(field) {
// 	return KarmaFields.build({
// 		class: "checkbox-container",
// 		children: function() {
// 			return [
// 				KarmaFields.build({
// 					tag: "input",
// 					init: function(element) {
// 						element.id = field.id;
// 						element.type = "checkbox";
// 						element.addEventListener("change", function() {
// 							if (field.history) {
// 								field.history.save();
// 							}
// 							field.set(element.checked);
// 						});
// 						field.onUpdate = function(value) {
// 							element.checked = value || false;
// 						};
// 						field.fetch().then(field.onUpdate);
// 						field.onFocus = function() {
// 							element.focus();
// 						}
// 						field.onBlur = function() {
// 							element.blur();
// 						}
// 					}
// 				}),
// 				field.resource.description && KarmaFields.build({
// 					tag: "label",
// 					class: "description",
// 					init: function(element) {
// 						element.htmlFor = field.id;
// 						element.innerText = field.resource.description;
// 					}
// 				})
// 			];
// 		}
// 	});
// }


KarmaFields.fields.checkbox = function(field) {
	return {
		className: "checkbox",
		kids: [
			{
				tag: "input",
				init: function(input) {
					this.id = field.getId();
					this.addEventListener("change", function(event) {
						field.setValue(input.checked);
					});
					field.fetchValue().then(function(value) { // -> maybe undefined
						input.checked = Boolean(value);
					});
					if (field.resource.style) {
						this.style = field.resource.style;
					}
				},
				update: function() {
					this.checked = Boolean(field.getValue());
				}
			},
			{
				tag: "label",
				init: function() {
					if (field.resource.description) {
						this.textContent = field.resource.description;
					}
				}
			}
		]
	};
}
