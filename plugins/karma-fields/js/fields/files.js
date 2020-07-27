KarmaFieldMedia.fields.files = function(field) {
  var galleryManager = {};
  var galleryUploader = KarmaFieldMedia.createGalleryUploader();
  if (field.resource.mimeTypes !== undefined) {
    galleryUploader.mimeTypes = field.resource.mimeTypes;
  }
  galleryUploader.onChange = function(attachments) {
    var value = attachments.map(function(attachment) {
      return {
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
        filename: attachment.filename
      }
    });
    field.history.save();
    field.set(value);
    galleryManager.renderThumbs && galleryManager.renderThumbs();
    galleryManager.renderControls && galleryManager.renderControls();
  };

  // return build({
	// 	class: "karma-field files-input",
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
          class: "karma-field-files",
          children: function() {
            return [
              build({
                class: "field-controls",
                init: function(element, update) {
                  galleryManager.renderControls = update;
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
                            element.disabled = (field.get() || []).length;
                            element.addEventListener("click", function(event) {
                              event.preventDefault();
                              galleryUploader.imageIds = [];
                              galleryUploader.open();
                            });
                          }
                        }),
                        KarmaFieldMedia.includes.icon({
                          tag: "button",
                          url: KarmaFields.icons_url+"/edit.svg",
                          init: function(element, update) {
                            element.disabled = !(field.get() || []).length;
                            element.addEventListener("click", function(event) {
                              event.preventDefault();
                              galleryUploader.imageIds = field.get().map(function(attachment) {
                                return attachment.id;
                              });
                              galleryUploader.open();
                            });
                          }
                        }),
                        KarmaFieldMedia.includes.icon({
                          tag: "button",
                          url: KarmaFields.icons_url+"/trash.svg",
                          init: function(element, update) {
                            element.disabled = !(field.get() || []).length;
                            element.addEventListener("click", function(event) {
                              event.preventDefault();
                              field.set([]).then(function() {
                                field.history.save();
                                field.save();
                                galleryManager.renderControls && galleryManager.renderControls();
                                galleryManager.renderThumbs && galleryManager.renderThumbs();
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
                  // field.fetch([]).then(function(value) {
                  //   update();
                  //   galleryManager.renderControls && galleryManager.renderControls();
                  // });
                  field.onUpdate = function(value) {
                    update();
                    galleryManager.renderControls && galleryManager.renderControls();
                  }
                  element.addEventListener("click", function(event) {
                    event.preventDefault();
                    galleryUploader.imageIds = field.get().map(function(attachment) {
                      return attachment.id;
                    });
                    galleryUploader.open();
                  });
                  galleryManager.renderThumbs = update;
                  field.fetch().then(field.onUpdate);
            		},
                children: function() {
                  var value = field.get();
                  if (!value || value.length === undefined) {
                    value = field.resource.default || [];
                  }
                  return value.map(function(attachment) {
                    return build({
                      tag: "img",
                      init: function(img) {
                        img.src = attachment.thumb;
                        img.width = attachment.thumb_width;
                        img.height = attachment.thumb_height;
                      }
                    })
                  });
                }
            	})
            ];
          }
        });
//       ];
//     }
//   });
}
