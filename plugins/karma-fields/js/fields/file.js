KarmaFieldMedia.fields.file = function(field) {
  var imageUploader = KarmaFieldMedia.createImageUploader();
	imageUploader.mimeType = field.resource.mimeType || null;
  var imageManager = {};
  imageUploader.onSelect = function(attachments) {
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
        thumb_width: attachment.sizes && attachment.sizes.thumbnail.width || attachment.thumb && attachment.thumb.width,
        thumb_height: attachment.sizes && attachment.sizes.thumbnail.height || attachment.thumb && attachment.thumb.height,
        sources: sources,
        filename: attachment.filename
      };
      field.history.save();
    }
    field.set(value || {});
    imageManager.renderThumbs && imageManager.renderThumbs();
    imageManager.renderControls && imageManager.renderControls();
  };

  // return build({
	// 	class: "karma-field file-input",
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
        return build({
          class: "karma-field-file",
          children: function() {
            return [
              build({
                class: "field-controls",
                init: function(element, update) {
                  imageManager.renderControls = update;
                },
                child: function() {
                  return build({
                    class: "field-controls-group",
                    children: function() {
                      return [
                        KarmaFieldMedia.includes.icon({
                          tag: "button",
                          url: KarmaFields.icons_url+"/insert.svg",
                          init: function(element, update) {
                            element.disabled = (field.get() || {}).id;
                            element.addEventListener("click", function(event) {
                              event.preventDefault();
                              imageUploader.imageId = null;
                              imageUploader.open();
                            });
                          }
                        }),
                        KarmaFieldMedia.includes.icon({
                          tag: "button",
                          url: KarmaFields.icons_url+"/edit.svg",
                          init: function(element, update) {
                            element.disabled = !(field.get() || {}).id;
                            element.addEventListener("click", function(event) {
                              event.preventDefault();
                              imageUploader.imageId = field.get().id;
                              imageUploader.open();
                            });
                          }
                        }),
                        KarmaFieldMedia.includes.icon({
                          tag: "button",
                          url: KarmaFields.icons_url+"/trash.svg",
                          init: function(element, update) {
                            element.disabled = !(field.get() || {}).id;
                            element.addEventListener("click", function(event) {
                              event.preventDefault();
                              field.set({}).then(function() {
                                field.history.save();
                                field.save();
                                imageManager.renderControls && imageManager.renderControls();
                                imageManager.renderThumbs && imageManager.renderThumbs();
                              });
                            });
                          }
                        })
                      ];
                    }
                  });
                }
              }),
              build({
            		class: "file-input-thumbs",
                init: function(element, update) {
                  // field.fetch().then(function(value) {
                  //   update();
                  //   imageManager.renderControls && imageManager.renderControls();
                  // });
                  field.onUpdate = function(value) {
                    
                    update();
                    imageManager.renderControls && imageManager.renderControls();
                  }
                  field.fetch().then(function(value) {
                    update();
                    imageManager.renderControls && imageManager.renderControls();
                  });
                  imageManager.renderThumbs = update;
            		},
                child: function() {
                  var value = field.get();
                  if (value && value.id) {
                    return build({
                      tag: "img",
                      init: function(element) {
                        element.src = value.thumb;
                        element.addEventListener("click", function(event) {
                          event.preventDefault();
                          imageUploader.imageId = value.id;
                          imageUploader.open();
                        });
                      }
                    })
                  }
                  //   return build({
                  //     class: "image-box",
                  //     init: function(element, update) {
                  //       element.addEventListener("click", function() {
                  //         if (imageManager.selected === field) {
                  //           imageManager.selected = null;
                  //         } else {
                  //           imageManager.selected = field;
                  //         }
                  //         imageManager.renderThumbs && imageManager.renderThumbs();
                  //       });
                  //       if (imageManager.selected === field) {
                  //         element.classList.add("active");
                  //       } else {
                  //         element.classList.remove("active");
                  //       }
                  //
                  //       update();
                  //     },
                  //     children: function() {
                  //       return [
                  //         build({
                  //           tag: "img",
                  //           init: function(img) {
                  //             img.src = value.thumb;
                  //           }
                  //         }),
                  //         build({
                  //           class: "image-name",
                  //           text: function() {
                  //             return value.filename || "?";
                  //           }
                  //         })
                  //       ];
                  //     }
                  //   });
                  // } else {
                  //   // return build({
                  //   //   tag: "button",
                  //   //   class: "button",
                  //   //   init: function(element) {
                  //   //     element.innerText = "Ajouter";
                  //   //     element.onclick = function(event) {
                  //   //       event.preventDefault();
                  //   //       imageUploader.open();
                  //   //     };
                  //   //   }
                  //   // });
                  // }
                }
            	})
            ];
          }
        });
//       ];
//     }
//   });
//
}
