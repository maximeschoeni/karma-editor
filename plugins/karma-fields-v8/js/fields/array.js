KarmaFields.fields.array = function(field) {
  return {
    class: "karma-field-array",
    init: function(array) {

      this.children = [
        {
          tag: "table",
          class: "grid",
          children: [
            {
              tag: "thead",
              init: function(thead) {
                if (field.resource.columns.some(function(column) {
                  return column.label;
                })) {
                  thead.child = {
                    tag: "tr",
                    children: field.resource.columns.map(function(column) {
                      return {
                        tag: "th",
                        init: function() {
                          if (column.style) {
                            this.element.style = column.style;
                          }
                        },
                        child: {
                          class: "header-cell",
                          child: {
                            tag: "a",
                            init: function() {
                              this.element.textContent = column.label || "";
                            }
                          }
                        }
                      };
                    }).concat([{
                      tag: "th",
                      init: function() {
                        this.element.style = "width:40px";
                      }
                    }])
                  };
                }
              }
            },
            {
              tag: "tbody",
              init: function() {
                field.fetchValue().then(function(value) {
                  if (!value && field.resource.default) {
                    field.setValue(field.resource.default);
  								}
                  array.render();
                });
              },
              update: function() {
                var value = field.getValue() || [];
                this.children = value.map(function(item, rowIndex) {
                  return {
                    tag: "tr",
                    update: function() {
                      this.children = field.resource.columns.map(function(column) {
                        return {
                          tag: "td",
                          init: function() {

                          },
                          update: function() {
                            var childField = field.createChild(column);
                            childField.child_keys = [rowIndex, column.subkey];
                            this.child = childField.buildSingle();
                          }
                        }
                      }).concat([
                        {
                          tag: "td",
                          init: function() {
                            this.element.style = "width:40px";
                          },
                          child: {
                            tag: "button",
                            child: KarmaFields.includes.icon(KarmaFields.icons_url+"/trash.svg"),
                            init: function() {
                              this.element.addEventListener("click", function(event) {
                                event.preventDefault();
                                var items = value.filter(function(currentItem) {
                                  return currentItem !== item;
                                });
                                field.setValue(items);
                                array.render();
                              });
                            }
                          }
                        }
                      ]);
                    }
                  }
                });
              }
            }
          ]
        },
        {
          class:"field-controls",
          children: [
            {
              tag: "button",
              child: KarmaFields.includes.icon(KarmaFields.icons_url+"/insert.svg"),
              init: function() {
                this.element.addEventListener("click", function(event) {
                  event.preventDefault();
                  var values = field.getValue() || [];
                  values.push({});
                  field.setValue(values);
                  array.render();
                });
              }
            }
          ]
        }
      ];
    },
  };
}
