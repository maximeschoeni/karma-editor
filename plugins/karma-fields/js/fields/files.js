KarmaFields.fields.files = function(field) {


  return {
    class: "karma-field-files",
    init: function(gallery) {
      var galleryManager = {};
      var galleryUploader = KarmaFields.createGalleryUploader();
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
        field.setValue(value);
        gallery.render();
        // galleryManager.renderThumbs && galleryManager.renderThumbs();
        // galleryManager.renderControls && galleryManager.renderControls();
      };

      this.children = [
        {
          class: "field-controls",
          child: {
            class: "field-controls-group",
            children: [
              {
                tag: "button",
                child: KarmaFields.includes.icon(KarmaFields.icons_url+"/insert.svg"),
                init: function() {
                  this.element.disabled = (field.getValue() || []).length;
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    galleryUploader.imageIds = [];
                    galleryUploader.open();
                  });
                },
                update: function() {
                  var values = field.getValue();
                  values = Array.isArray(values) && values || [];
                  this.element.disabled = values.length > 0;
                }
              },
              {
                tag: "button",
                child: KarmaFields.includes.icon(KarmaFields.icons_url+"/edit.svg"),
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    var values = field.getValue();
                    values = Array.isArray(values) && values || [];
                    galleryUploader.imageIds = values.map(function(attachment) {
                      return attachment.id;
                    });
                    galleryUploader.open();
                  });
                },
                update: function() {
                  var values = field.getValue();

                  values = Array.isArray(values) && values || [];
                  this.element.disabled = values.length === 0;
                }
              },
              {
                tag: "button",
                child: KarmaFields.includes.icon(KarmaFields.icons_url+"/trash.svg"),
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    field.setValue([]);
                    gallery.render();
                  });
                },
                update: function() {
                  var values = field.getValue();
                  values = Array.isArray(values) && values || [];
                  this.element.disabled = values.length === 0;
                }
              }
            ]
          }
        },
        {
          class: "file-input-thumbs",
          init: function() {
            this.element.addEventListener("click", function(event) {
              event.preventDefault();
              var values = field.getValue();
              values = Array.isArray(values) && values || [];
              galleryUploader.imageIds = values.map(function(attachment) {
                return attachment.id;
              });
              galleryUploader.open();
            });
            field.fetchValue().then(function() {
              gallery.render();
            });
          },
          update: function(thumbsContainer) {
            var values = field.getValue();
            if (values && Array.isArray(values)) {
              thumbsContainer.children = values.map(function(attachment) {
                return {
                  tag: "img",
                  update: function() {
                    this.element.src = attachment.thumb;
                    this.element.width = attachment.thumb_width;
                    this.element.height = attachment.thumb_height;
                  }
                };
              });
            }
          }
        }
      ];
    }
  };


        // return KarmaFields.build({
        //   class: "karma-field-files",
        //   children: function() {
        //     return [
        //       KarmaFields.build({
        //         class: "field-controls",
        //         init: function(element, update) {
        //           galleryManager.renderControls = update;
        //         },
        //         child: function() {
        //           return KarmaFields.build({
        //             class: "field-controls-group",
        //             children: function() {
        //               return [
        //                 KarmaFields.includes.icon({
        //                   tag: "button",
        //                   url: KarmaFields.icons_url+"/insert.svg",
        //                   init: function(element, update) {
        //                     element.disabled = (field.get() || []).length;
        //                     element.addEventListener("click", function(event) {
        //                       event.preventDefault();
        //                       galleryUploader.imageIds = [];
        //                       galleryUploader.open();
        //                     });
        //                   }
        //                 }),
        //                 KarmaFields.includes.icon({
        //                   tag: "button",
        //                   url: KarmaFields.icons_url+"/edit.svg",
        //                   init: function(element, update) {
        //                     element.disabled = !(field.get() || []).length;
        //                     element.addEventListener("click", function(event) {
        //                       event.preventDefault();
        //                       galleryUploader.imageIds = field.get().map(function(attachment) {
        //                         return attachment.id;
        //                       });
        //                       galleryUploader.open();
        //                     });
        //                   }
        //                 }),
        //                 KarmaFields.includes.icon({
        //                   tag: "button",
        //                   url: KarmaFields.icons_url+"/trash.svg",
        //                   init: function(element, update) {
        //                     element.disabled = !(field.get() || []).length;
        //                     element.addEventListener("click", function(event) {
        //                       event.preventDefault();
        //                       field.set([]).then(function() {
        //                         field.history.save();
        //                         field.save();
        //                         galleryManager.renderControls && galleryManager.renderControls();
        //                         galleryManager.renderThumbs && galleryManager.renderThumbs();
        //                       });
        //                     });
        //                   }
        //                 })
        //               ];
        //             }
        //           });
        //         }
        //       }),
        //       KarmaFields.build({
        //     		class: "file-input-thumbs",
        //         init: function(element, update) {
        //           // field.fetch([]).then(function(value) {
        //           //   update();
        //           //   galleryManager.renderControls && galleryManager.renderControls();
        //           // });
        //           field.onUpdate = function(value) {
        //             update();
        //             galleryManager.renderControls && galleryManager.renderControls();
        //           }
        //           element.addEventListener("click", function(event) {
        //             event.preventDefault();
        //             galleryUploader.imageIds = field.get().map(function(attachment) {
        //               return attachment.id;
        //             });
        //             galleryUploader.open();
        //           });
        //           galleryManager.renderThumbs = update;
        //           field.fetch().then(field.onUpdate);
        //     		},
        //         children: function() {
        //           var value = field.get();
        //           if (!value || value.length === undefined) {
        //             value = field.resource.default || [];
        //           }
        //           return value.map(function(attachment) {
        //             return KarmaFields.build({
        //               tag: "img",
        //               init: function(img) {
        //                 img.src = attachment.thumb;
        //                 img.width = attachment.thumb_width;
        //                 img.height = attachment.thumb_height;
        //               }
        //             })
        //           });
        //         }
        //     	})
        //     ];
        //   }
        // });

}
