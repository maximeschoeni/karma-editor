KarmaFieldMedia.fields.textinput = function(field) {
	var textManager = {
		lastKey: "",
		lastTime: 0,
		timeThreshold: 1000*10,
		set: function(key) {
			var now = Date.now();
			if (key === "Backspace" && this.lastKey !== key || key === "Enter" || key === " " && this.lastKey !== key && now - this.lastTime > this.timeThreshold) {
				field.history.save();
				this.lastTime = now;
			}
			this.lastKey = key;
		}
	};
	// return build({
	// 	class: "karma-field-text-input",
	// 	init: function(element, update) {
	// 		field.render = update;
	// 		update();
	// 	},
	// 	children: function() {
	// 		return [
	// 			field.resource.label && build({
	// 				tag: "label",
	// 				init: function(label) {
	// 					label.htmlFor = field.id;
	// 					label.innerHTML = field.resource.label;
	// 				}
	// 			}),
				// return build({
				// 	class: "karma-field-text-input",
				// 	children: function() {
				// 		return [
							return build({
								tag: "input",
								class: "text",
								init: function(input) {
									input.type = field.resource.type || "text";
									input.id = field.id;

									input.addEventListener("keydown", function(event) {
										// event.preventDefault();
										// console.log(event.key, this.value);

										textManager.set(event.key);
										field.set(input.value);

									});
									input.addEventListener("input", function(event) {
										// console.log(event);
										// textManager.set(event.key);
										// field.set(input.value);
										// field.set(input.value).then(function() {
										// 	if (field.isModified != field.wasModified) {
										// 		field.history.save();
										// 	}
										// 	field.save();
										// });

									});
									field.onUpdate = function(value) { // -> historic change
										input.value = value || "";
										// input.classList.toggle("modified", value === field.getOriginal());
									}
									field.onInherit = function(value) {
										input.placeholder = value || "";
									}
									field.onModified = function(isModified) {
										input.classList.toggle("modified", isModified);
									}
									// field.update();

									field.fetch().then(function(value) { // -> maybe undefined
										input.value = value || "";
									});


									// field.fetch().then(function(value) {
									// 	input.value = value || "";
									// });
									// field.fetchPlaceholder().then(function(value) {
									// 	input.placeholder = value || "";
									// });

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
				// 		];
				// 	}
				// });
// 			];
// 		}
// 	});
}
