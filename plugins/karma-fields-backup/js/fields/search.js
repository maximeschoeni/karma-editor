KarmaFields.fields.search = function(fieldManager) {
	return {
		class: "search-form",
		init: function(container) {
			container.data.suggestions = [];
			// var value;
			this.element.addEventListener("focusout", function() {
				// container.data.suggestions = [];
				fieldManager.history.write("static", ["searchsuggestions", fieldManager.resource.key], undefined);
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
							// fieldManager.history.write("static", ["searchsuggestions", fieldManager.resource.key], undefined);
							container.data.suggestions = [];
							// fieldManager.tableManager.request();
						});
						this.element.addEventListener("input", function(event) {
							if (this.value.length > 1) {
								fieldManager.fetchOptions({
									search: this.value
								}).then(function(results) {
									container.data.suggestions = results.items || [];
									// fieldManager.history.write("static", ["searchsuggestions", fieldManager.resource.key], results.items || undefined);
									container.render();
								});
							} else if (this.value === "") {
								container.data.suggestions = [];
								fieldManager.setValue("");
							}
						});
						if (fieldManager.resource.style) {
							this.element.style = fieldManager.resource.style;
						}
					},
					update: function() {
						// var value = fieldManager.getValue();
						if (container.data.value) {
							this.element.value = container.data.value;
							container.data.value = null;
						} else {
							this.element.value = fieldManager.getValue() || "";
						}
					}
				},
				{
					tag: "ul",
					init: function() {

					},
					update: function() {
						// container.data.suggestions = fieldManager.history.read("static", ["searchsuggestions", fieldManager.resource.key]) || [];
						this.children = container.data.suggestions.map(function(word, index) {
							return {
								tag: "li",
								init: function(item) {
									this.element.addEventListener("mousedown", function(event) {
										event.preventDefault();
									});
									this.element.addEventListener("click", function(event) {
										fieldManager.setValue(this.innerHTML);
										container.data.suggestions = [];
										container.data.value = this.innerHTML;
										container.render();
									});
								},
								update: function() {
									this.element.innerHTML = word;
								}
							}
						});
						this.element.style.display = container.data.suggestions.length ? "block" : "none";
					}
				}
			];
		}
	};



}
