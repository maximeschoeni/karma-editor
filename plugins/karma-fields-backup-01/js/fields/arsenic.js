KarmaFields.fields.arsenic = function(field) {
	return {
		class: "spectacle-details",
		init: function() {
			field.onSetValue = null;
		},
		update: function(container) {
			var spectacle_x = field.history.read("inner", ["reservations", "filters", "spectacle"]);
			if (spectacle_x) {
				field.path = spectacle_x;
				field.fetchValue(true).then(function(result) {
					container.data.spectacle = result;
					container.render();
				});
				this.element.classList.toggle("disable", false);
			} else {
				container.data.spectacle = null;
				this.element.classList.toggle("disable", true);
				container.render();
			}

			this.children = [
				{
					class: "spectacle-details-row",
					children: [
						{
							tag: "label",
							init: function() {
								this.element.textContent = "Nombre de place";
							}
						},
						{
							tag: "input",
							init: function() {
								this.element.addEventListener("input", function() {
									field.setValue({
										num_place: this.value
									});
									if (field.onRequestFooterUpdate) {
										field.onRequestFooterUpdate();
									}
								});
							},
							update: function() {
								if (container.data.spectacle) {
									// this.element.value = container.data.spectacle.num_place || "0";
									var value = field.getValue();
									this.element.value = value && value.num_place || 0;
									this.element.disabled = false;
								} else {
									this.element.value = "";
									this.element.disabled = true;
								}
							}
						}
					]
				},
				{
					class: "spectacle-details-row",
					init: function() {
					},
					children: [
						{
							tag: "label",
							init: function() {
								this.element.textContent = "Places libres (non réservées)";
							}
						},
						{
							tag: "input",
							init: function() {
								this.element.readOnly = true;
							},
							update: function() {
								if (container.data.spectacle) {
									this.element.value = parseInt(container.data.spectacle.num_place) - parseInt(container.data.spectacle.num_res);
									this.element.disabled = false;
								} else {
									this.element.value = "";
									this.element.disabled = true;
								}
							}
						}
					]
				},
				{
					class: "spectacle-details-row",
					init: function() {
					},
					children: [
						{
							tag: "label",
							init: function() {
								this.element.textContent = "Présences réelles";
							}
						},
						{
							tag: "input",
							init: function() {
								this.element.readOnly = true;
							},
							update: function() {
								if (container.data.spectacle) {
									this.element.value = container.data.spectacle.presence;
									this.element.disabled = false;
								} else {
									this.element.value = "";
									this.element.disabled = true;
								}
							}
						}
					]
				}
			];
		}
		// update: function(item) {
		// 	var spectacle = field.history.read("inner", ["filters", "spectacle"]);
		// 	var spectacle_id = spectacle.split("x")[0];
		//
		// 	if (spectacle_id) {
		// 		field.uri = spectacle_id;
		// 		field.fetchValue(true).then(function(result) {
		// 			item.children = result && ;
		// 			item.render();
		// 		});
		// 	} else {
		// 		item.children = [];
		// 		item.render();
		// 	}
		// }
	};


}
