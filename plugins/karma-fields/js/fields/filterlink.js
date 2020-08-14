KarmaFields.fields.filterlink = function(field) {
	return KarmaFields.build({
		tag: "a",
		class: "filterlink",
		init: function(element) {

			// console.log(field.tableManager.filters);

			field.onUpdate = function(value) { // -> historic change
				if (value && field.resource.key) {
					var params = {};
					params[field.resource.key] = value;
					field.fetchOptions(params).then(function(results) {
						element.innerText = results.items[0].name;
					});
				}
			}
			element.addEventListener("click", function() {
				field.tableManager.filters = {};
				field.tableManager.filters[field.resource.key] = field.get();
				field.tableManager.request();
				field.tableManager.renderHeader();

			});


			field.fetch().then(field.onUpdate);



			// input.type = field.resource.type || "text";
			//
			// field.onInherit = function(value) {
			// 	input.placeholder = value || "";
			// }
			// field.onModified = function(isModified) {
			// 	input.classList.toggle("modified", isModified);
			// }
			// field.onUpdate = function(value) { // -> historic change
			// 	input.value = value || "";
			// }
			// field.fetch().then(function(value) { // -> maybe undefined
			// 	input.value = value || "";
			// });
			//
			// field.onFocus = function() {
			// 	input.focus();
			// }
			// field.onBlur = function() {
			// 	input.blur();
			// }
			//
			// if (field.resource.width) {
			// 	input.style.width = field.resource.width;
			// }
		}
	});
}
