KarmaFields.fields.optionButtons = function(field) {
	return KarmaFields.build({
		class: "option-buttons",
		init: function(element, render) {
			field.render = render;
			field.onUpdate = function() {
				render();
			}
			field.fetch().then(field.onUpdate);
		},
		children: function() {
			return (field.resource.options || []).map(function(option) {
				return build({
					class: "option-button",
					init: function(element) {
						element.innerText = option.name;
						element.classList.toggle("active", field.get() === option.key);
						element.addEventListener("click", function() {
							if (field.get() === option.key) {
								field.set("");
							} else {
								field.set(option.key);
							}
							field.render();
							if (field.resource.auto_submit) {
								field.submit()
							}
						});
					}
				});
			});
		}
	});
}
