KarmaFields.tables.footer = function(manager) {
  return {
    class: "table-footer",
    init: function(element, render) {
      manager.renderFooter = render;
      manager.select.onSelect = render;
    },
    update: function(element, render, args) {
      // var editedFields = manager.fields.filter(function(field) {
      //   return field.modifiedValue !== undefined;
      // });
      // var modifiedURIs = Object.keys(manager.changes);

      var items = manager.select.getSelectedItems();
      var selectedRows = manager.select.getSelectedRows();

      args.children = [
        manager.displayOptions && {
          class: "table-options-container",
          children: [
            {
              class: "table-options-body",
              init: function(element, render, args) {
                manager.renderOptions = render; // trigerred when history changes
                var field = KarmaFields.managers.field(this.resource.options, ["options"], history);
                args.child = field.build();
              }
            },
            {
              class: "table-options-footer",
              children: [
                KarmaFields.includes.icon({
                  tag: "button",
                  class: "button footer-item",
                  url: KarmaFields.icons_url+"/no.svg",
                  init: function(element, update) {
                    element.addEventListener("click", function() {
                      manager.displayOptions = false;
                      manager.renderFooter();
                    });
                  }
                }),
              ]
            }
          ]
        },
        {
          class: "footer-bar",
          children: [
            {
              class: "footer-group table-info",
              children: [
                KarmaFields.includes.icon({
                  class: "footer-item table-spinner",
                  update: function(element) {
                    element.classList.toggle("disabled", manager.loading);
                  },
                  url: KarmaFields.icons_url+"/update.svg"
                }),
                {
                  tag: "button",
                  class: "button footer-item primary",
                  init: function(element, render) {
                    element.title = "Save";
                    element.innerText = "Save";
                    element.addEventListener("click", function(event) {
                      manager.sync();
                    });
                    element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element, render) {
                    // element.disabled = modifiedURIs.length === 0;
                    element.disabled = manager.history.isEmpty("output");

                  }
                },
                KarmaFields.includes.icon({
                  tag: "button",
                  class: "button footer-item",
                  url: KarmaFields.icons_url+"/admin-generic.svg",
                  init: function(element, render) {
                    element.title = "Options";
                    element.addEventListener("click", function(event) {
                      manager.displayOptions = !manager.displayOptions;
                      manager.renderFooter();
                    });
                    element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element) {
                    element.classList.toggle("active", manager.displayOptions);
                  }
                }),
                KarmaFields.includes.icon({
                  tag: "button",
                  class: "button footer-item",
                  url: KarmaFields.icons_url+"/undo.svg",
                  init: function(element, render) {
                    element.title = "Undo";
                    element.addEventListener("click", function(event) {
                      manager.history.undo();
                    });
                    element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element) {
                    element.disabled = manager.history.index < 1;
                  }
                }),
                KarmaFields.includes.icon({
                  tag: "button",
                  class: "button footer-item",
                  url: KarmaFields.icons_url+"/redo.svg",
                  init: function(element, render) {
                    element.title = "Redo";
                    element.addEventListener("click", function(event) {
                      manager.history.redo();
                    });
                    element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element) {
                    element.disabled = manager.history.index >= manager.history.total;
                  }
                }),
                KarmaFields.includes.icon({
                  tag: "button",
                  class: "button footer-item",
                  url: KarmaFields.icons_url+"/plus-alt2.svg",
                  init: function(element, render) {
                    element.title = "Add";
                    element.addEventListener("click", function(event) {
                      window.scrollTo(0, document.body.scrollHeight);
                      manager.addItem();
                    });
                    element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  }
                }),
                KarmaFields.includes.icon({
                  tag: "button",
                  class: "button footer-item",
                  url: KarmaFields.icons_url+"/trash.svg",
                  init: function(element, update) {
                    element.innerText = "Delete";
                    element.addEventListener("click", function(event) {
                      manager.removeItems(selectedRows);
                    });
                    element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element) {
                    element.disabled = selectedRows.length === 0;
                  }
                })
              ]
            },
            KarmaFields.tables.pagination(manager)
          ]
        }
      ];
    }
  };
}
