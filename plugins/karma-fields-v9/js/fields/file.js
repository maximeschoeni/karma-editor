KarmaFields.fields.file = function(field) {
  return {
    class: "karma-field-file",
    init: function(container) {
      var imageUploader = KarmaFields.createImageUploader();
    	imageUploader.mimeType = field.resource.mimeType || null;
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

          field.setValue(value);
          container.render();
        }
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
                    imageUploader.imageId = null;
                    imageUploader.open();
                  });
                },
                update: function() {
                  var value = field.getValue();
                  this.element.disabled = value && value.id;
                }
              },
              {
                tag: "button",
                child: KarmaFields.includes.icon(KarmaFields.icons_url+"/edit.svg"),
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    var value = field.getValue();
                    imageUploader.imageId = value && value.id;
                    imageUploader.open();
                  });
                },
                update: function() {
                  var value = field.getValue();
                  // this.element.disabled = !value || !value.id;
                }
              },
              {
                tag: "button",
                child: KarmaFields.includes.icon(KarmaFields.icons_url+"/trash.svg"),
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    field.setValue(null);
                    imageUploader.imageId = null;
                    container.render();
                  });
                },
                update: function() {
                  var value = field.getValue();
                  this.element.disabled = !value || !value.id;
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
            var value = field.getValue();
            imageUploader.imageId = value.id;
            imageUploader.open();
          });
          field.fetchValue().then(function() {
            container.render();
          });
        },
        update: function() {
          var value = field.getValue();

          this.child = value && value.id && {
            tag: "img",
            update: function() {
              this.element.src = value.thumb;
              this.element.width = value.thumb_width;
              this.element.height = value.thumb_height;
            }
          };
        }
      });
    }
  };
}
