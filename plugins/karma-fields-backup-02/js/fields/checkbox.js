KarmaFields.fields.checkbox = function(field) {
	return KarmaFields.build({
		class: "checkbox-container",
		children: function() {
			return [
				KarmaFields.build({
					tag: "input",
					init: function(element) {
						element.id = field.id;
						element.type = "checkbox";
						element.addEventListener("change", function() {
							if (field.history) {
								field.history.save();
							}
							field.set(element.checked);
						});
						field.onUpdate = function(value) {
							element.checked = value || false;
						};
						field.fetch().then(field.onUpdate);
						field.onFocus = function() {
							element.focus();
						}
						field.onBlur = function() {
							element.blur();
						}
					}
				}),
				field.resource.description && KarmaFields.build({
					tag: "label",
					class: "description",
					init: function(element) {
						element.htmlFor = field.id;
						element.innerText = field.resource.description;
					}
				})
			];
		}
	});
}
