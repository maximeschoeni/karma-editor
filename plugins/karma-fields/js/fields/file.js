KarmaFieldMedia.fields.file = function(field) {
  var imageManager = KarmaFieldMedia.createImageUploader();
	imageManager.mimeType = field.resource.mimeType || null;

  return build({
		class: "karma-field file-input",
		init: function(element, update) {
			field.render = update;
			update();
		},
		children: function() {
			return [
				field.resource.label && build({
					tag: "label",
					init: function(label) {
						label.htmlFor = field.id;
						label.innerHTML = field.resource.label;
					}
				}),
        build({
      		class: "file-input",
          init: function(element, update) {
      			imageManager.onSelect = function(attachments) {
              var value;
      				if (attachments.length) {
      					var attachment = attachments[0];
                var sources = [];
                if (attachment.sizes) {
                  for (var key in attachment.sizes) {
                    if (key !== "thumbnail") {
                      sources.push({
                        size: key,
                        width: attachment.sizes[key].width,
                        height: attachment.sizes[key].height,
                        url: attachment.sizes[key].url
                      });
                    }
                  }
                }
                value = {
                  id: attachment.id,
                  width: attachment.width,
                  height: attachment.height,
                  description: attachment.description,
                  alt: attachment.alt,
                  title: attachment.title,
                  name: attachment.name,
                  url: attachment.url,
                  thumb: attachment.sizes && attachment.sizes.thumbnail.url || attachment.icon,
                  sources: sources,
                  filename: attachment.filename
                };
                console.log(value);
                field.history.save();
      				}
              field.set(value).then(function() {
                field.save();
                update();
              });
      			};
            field.fetch().then(function(value) {
              update();
            });
      		},
          child: function() {
            var value = field.get();

            if (value) {
              return build({
                class: "image-box",
                init: function(element, update) {
                  element.addEventListener("click", function() {
                    imageManager.open();
                  });
                  update();
                },
                children: function() {
                  return [
                    build({
                      tag: "img",
                      init: function(img) {
                        img.src = value.thumb;
                      }
                    }),
                    build({
                      class: "image-name",
                      text: function() {
                        return value.filename || "?";
                      }
                    })
                  ];
                }
              });
            } else {
              return build({
                tag: "button",
                class: "button",
                init: function(element) {
                  element.innerText = "Ajouter";
                  element.onclick = function(event) {
                    event.preventDefault();
                    imageManager.open();
                  };
                }
              });
            }
          }


      		// update: function(attachment) {
      		// 	if (attachment) {
      		// 		return {
      		// 			child: build({
      		// 				class: "image-box",
      		// 				children: [
      		// 					build({
      		// 						tag: "img",
      		// 						init: function(img) {
      		// 							img.src = attachment.url;
      		// 						}
      		// 					}),
      		// 					build({
      		// 						class: "image-name",
      		// 						text: attachment.filename || "?"
      		// 					})
      		// 				],
      		// 				init: function(imageBox) {
      		// 					imageBox.addEventListener("click", function() {
      		// 						imageManager.open();
      		// 					});
      		// 				}
      		// 			})
      		// 		};
      		// 	} else {
      		// 		return {
      		// 			child: build({
      		// 				tag: "button",
      		// 				class: "button",
      		// 				text: "Ajouter",
      		// 				init: function(button) {
      		// 					button.onclick = function(event) {
      		// 						event.preventDefault();
      		// 						imageManager.open();
      		// 					};
      		// 				}
      		// 			})
      		// 		};
      		// 	}
      		// },

      	})
      ];
    }
  });

}
