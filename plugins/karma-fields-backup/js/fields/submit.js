KarmaFields.fields.submit = function(field) {
	return KarmaFields.includes.icon({
		tag: "button",
		class: "button submit-button",
		url: function() {
			return KarmaFields.icons_url+"/update.svg";
		},
		init: function(input, update) {
			input.id = field.id;
			input.disabled = true;
			input.addEventListener("click", function(event) {
				if (field.parent) {
					field.parent.submit();
				}
			});
			if (field.parent) {
				field.parent.onBubble = function(key, value, inputfield) {
					
					input.disabled = !inputfield.modified;
				}
			}
			update();
		}
	});
}
