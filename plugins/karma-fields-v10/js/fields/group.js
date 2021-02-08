KarmaFields.fields.group = function(field) {
	return {
		class: "karma-field-group display-"+(field.resource.display || "block"),
		init: function(group) {
			if (field.resource.style) {
				this.element.style = field.resource.style;
			}
		},
		update: function(group) {
			(field.resource.children || []).map(function(resource) {
				child = (resource.key && field.get(resource.key) || field.createChild(resource)) || field;
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
			});
		}
	};
}
