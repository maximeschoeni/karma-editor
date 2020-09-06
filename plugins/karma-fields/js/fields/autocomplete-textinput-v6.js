KarmaFields.fields.autocompletetextinput = function(field) {
	var manager = {};
	var isSaved;
	return KarmaFields.build({
		class: "autocomplete-input",
		children: function() {
			return [
				KarmaFields.build({
					tag: "input",
					class: "text",
					init: function(input) {
						input.type = field.resource.type || "text";
						input.id = field.id;
						if (field.resource.readonly) {
							input.readOnly = true;
						} else {
							input.addEventListener("input", function(event) {
								if (!isSaved && field.history) {
									field.history.save();
									isSaved = true;
								}
								field.fetchOptions({
									search: input.value
								}).then(function(results) {
									manager.options = results.items;
									manager.onUpdate();
								});
								field.set(input.value);
							});
							input.addEventListener("focus", function(event) {
								isSaved = false;
							});
							input.addEventListener("keyup", function(event) {
								if (event.key === "Enter") {
									field.submit();
								}
							});

						}
						field.onInherit = function(value) {
							input.placeholder = value || "";
						}
						field.onModified = function(isModified) {
							input.classList.toggle("modified", isModified);
						}
						field.onUpdate = function(value) { // -> historic change
							input.value = value || "";
						}
						field.fetch().then(function(value) { // -> maybe undefined
							input.value = value || "";
						});
						if (field.resource.width) {
							input.style.width = field.resource.width;
						}
					}
				}),
				KarmaFields.build({
					tag: "ul",
					init: function(element, update) {
						manager.onUpdate = update;
					},
					children: function() {
						return manager.options && manager.options.map(function(option) {
							return KarmaFields.build({
								tag: "li",
								init: function(element) {
									element.innerHTML = option.name;
									element.addEventListener("click", function() {
										field.history.save();
										input.value = option.name;
										field.set(option.name);
										manager.options = null;
										manager.onUpdate();
									});
								}
							});
						});
					}
				})
			];
		}
	});
}
