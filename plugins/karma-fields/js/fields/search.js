KarmaFields.fields.search = function(fieldManager) {
	return {
		class: "search-form",
		init: function(container) {
			var suggestions = [];
			var value;
			this.element.addEventListener("focusout", function() {
				suggestions = [];
				container.render();
			});
			this.element.addEventListener("focusin", function() {
				container.render();
			});
			this.children = [
				{
					class: "search",
					tag: "input",
					init: function(input) {
						this.element.type = "search";
						this.element.placeholder = fieldManager.resource.title || "Search";
						this.element.addEventListener("search", function() {
							fieldManager.setValue(this.value);
							suggestions = [];
							// fieldManager.tableManager.request();
						});
						this.element.addEventListener("input", function(event) {
							if (this.value.length > 1) {
								fieldManager.fetchOptions({
									search: this.value
								}).then(function(results) {
									suggestions = results.items || [];
									container.render();
								});
							}
						});
						if (fieldManager.resource.style) {
							this.element.style = fieldManager.resource.style;
						}
					},
					update: function() {
						if (value) {
							this.element.value = value;
							value = null;
						}
					}
				},
				{
					tag: "ul",
					init: function() {

					},
					update: function() {
						this.children = suggestions.map(function(word) {
							return {
								tag: "li",
								init: function() {
									this.element.addEventListener("mousedown", function(event) {
										event.preventDefault();
									});
									this.element.addEventListener("click", function(event) {
										fieldManager.setValue(word);
										value = word;
										suggestions = [];
										container.render();
									});
								},
								update: function() {
									this.element.innerHTML = word;
								}
							}
						});
						this.element.style.display = suggestions.length ? "block" : "none";
					}
				}
			];
		}
	};



}
