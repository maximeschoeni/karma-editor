KarmaFields.fields.group = function(field) {
	return {
		class: "karma-field-group display-"+(field.resource.display || "block"),
		init: function(group) {
			if (field.resource.style) {
				this.element.style = field.resource.style;
			}
			field.events.update = function() {
				group.element.classList.toggle("loading", field.loading);
				group.element.classList.toggle("modified", field.value === field.originalValue);
			};
			field.events.render = function() {
				group.render();
			};


		},
		update: function(group) {
			field.trigger("update");
			this.children = [];

			(field.resource.children || []).map(function(resource) {
				let child = (resource.key && field.get(resource.key) || field.createChild(resource)) || field;

				if (KarmaFields.fields[resource.type || "group"]) {

					group.children.push({
						class: "karma-field-group-content",
						update: function() {
							this.children = [
								KarmaFields.fields[resource.type || "group"](child),
								{
									class: "spinner"
								}
							];
							if (field.resource.label) {
								this.children.unshift({
									tag: "label",
									init: function(label) {
										this.element.htmlFor = child.getId();
										this.element.textContent = resource.label;
									}
								});
							}
						}
					});
				}
			});

		}
	};
}
