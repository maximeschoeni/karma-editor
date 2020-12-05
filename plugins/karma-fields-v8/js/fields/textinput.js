KarmaFields.fields.textinput = function(field) {
	return {
		tag: "input",
		className: "text",
		init: function(input) {
			this.type = field.resource.type || "text";
			this.id = field.getId();
			if (field.resource.readonly) {
				this.readOnly = true;
			} else {
				this.addEventListener("input", function(event) {
					// var value = this.value;
					// requestAnimationFrame(function() {
					// 	field.setValue(value);
					// });
					field.setValue(this.value, "input");
				});

				this.addEventListener("keyup", function(event) {
					if (event.key === "Enter") {
						field.setValue(this.value, "enter");
					}
				});
			}
			if (field.resource.width) {
				this.style.width = field.resource.width;
			}
			if (field.resource.style) {
				this.style = field.resource.style;
			}
			// field.fetchValue().then(function(value) { // -> maybe undefined
			// 	var isModified = field.isModified();
			// 	input.value = value || "";
			// 	input.classList.toggle("modified", isModified);
			// });
		},
		update: function(input) {

			// var timerId = field.args.path +"/" +field.resource.key;
			// console.time(timerId);

			// var value = field.getValue();
			// var isModified = field.isModified();
			//
			// input.value = value || "";
			// input.classList.toggle("modified", isModified);

			// console.timeEnd(timerId);



			field.fetchValue().then(function(value) { // -> maybe undefined

				// console.log(field.resource.key, field.args.path, value, field.getValue());



				// requestAnimationFrame(function() {
					var isModified = field.isModified();



					input.value = value || "";
					input.classList.toggle("modified", isModified);
				// });





			});


		}
	};
}
