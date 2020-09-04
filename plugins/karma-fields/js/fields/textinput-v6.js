KarmaFields.fields.textinput = function(field) {
	var isSaved;
	return KarmaFields.build({
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

			field.onFocus = function() {
				input.focus();
			}
			field.onBlur = function() {
				input.blur();
			}

			if (field.resource.width) {
				input.style.width = field.resource.width;
			}
		}
	});
}
