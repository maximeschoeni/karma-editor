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

      this.children = [];
      if (field.resource.controls !== false) {
        this.children.push({
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
                    // if (!galleryUploader.imageIds) {
                    //   galleryUploader.imageIds = [];
                    // }
                    var values = field.getValue();
                    values = Array.isArray(values) && values || [];
                    galleryUploader.imageIds = values.map(function(attachment) {
                      return attachment.id;
                    });
                    galleryUploader.open();
                  });
                },
                update: function() {
                  // var values = field.getValue();
                  // values = Array.isArray(values) && values || [];
                  // this.element.disabled = values.length > 0;
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
        });
      }
      this.children.push({
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
      });
    }
  };
}
