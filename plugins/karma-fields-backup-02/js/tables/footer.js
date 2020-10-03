KarmaFields.tables.footer = function(manager) {
  return {
    class: "table-footer",
    init: function() {
      manager.renderFooter = this.render;
      manager.select.onSelect = this.render;
    },
    update: function() {
      // var editedFields = manager.fields.filter(function(field) {
      //   return field.modifiedValue !== undefined;
      // });
      // var modifiedURIs = Object.keys(manager.changes);

      // var items = manager.select.getSelectedItems();
      // var selectedRows = manager.select.getSelectedRows();

      this.children = [
        {
          class: "table-options-container",
          update: function(element) {
            var displayOptions = manager.history.read("static", ["displayOptions"]);

            this.child = displayOptions && {
              class: "table-options-body",
              init: function() {
                // manager.renderOptions = render; // trigerred when history changes

                if (manager.resource.options) {
                  var field = KarmaFields.managers.field();
                  field.resource = manager.resource.options;
                  // field.input = ["options"];
                  // field.output = ["options"];
                  field.buffer = "inner";
                  field.path = "options";
                  // field.id = "karma-table-options";
                  field.history = manager.history;
                  field.onSubmit = function() {
                    manager.history.setValue(["static", "displayOptions"], false);
                    manager.request();
                  }

                  // manager.resource.options, {
                  //   inputBuffer: "options",
                  //   outputBuffer: "options",
                  //   history: manager.history,
                  //   tableManager: manager
                  // });
                  this.children = field.build();
                }
                // var field = KarmaFields.managers.field(manager.resource.options, {
                //   inputBuffer: "options",
                //   outputBuffer: "options",
                //   history: manager.history,
                //   tableManager: manager
                // });
                // this.children = field.build();
              }
            };

            // [
            //
            //   // {
            //   //   class: "table-options-footer",
            //   //   children: [
            //   //     {
            //   //       tag: "button",
            //   //       class: "button footer-item",
            //   //       init: function(item) {
            //   //         KarmaFields.getAsset(KarmaFields.icons_url+"/no.svg").then(function(result) {
            //   //           requestAnimationFrame(function() {
            //   //             item.element.innerHTML = result;
            //   //           });
            //   //         });
            //   //         this.element.addEventListener("click", function() {
            //   //           manager.displayOptions = false;
            //   //           manager.renderFooter();
            //   //         });
            //   //       }
            //   //     }
            //   //   ]
            //   // }
            // ];
          }
          // children: [
          //   {
          //     class: "table-options-body",
          //     init: function(element, render, args) {
          //       // manager.renderOptions = render; // trigerred when history changes
          //       var field = KarmaFields.managers.field(manager.resource.options, {
          //         inputBuffer: "options",
          //         outputBuffer: "options",
          //         history: manager.history,
          //         tableManager: manager
          //       });
          //       args.children = field.build();
          //     }
          //   },
          //   {
          //     class: "table-options-footer",
          //     children: [
          //       KarmaFields.includes.icon({
          //         tag: "button",
          //         class: "button footer-item",
          //         url: KarmaFields.icons_url+"/no.svg",
          //         init: function(element, update) {
          //           element.addEventListener("click", function() {
          //             manager.displayOptions = false;
          //             manager.renderFooter();
          //           });
          //         }
          //       }),
          //     ]
          //   }
          // ]
        },
        {
          class: "footer-bar",
          children: [
            {
              class: "footer-group table-info",
              children: [
                // {
                //   class: "footer-item table-spinner karma-icon",
                //   init: function(item) {
                //     KarmaFields.getAsset(KarmaFields.icons_url+"/update.svg").then(function(result) {
                //       requestAnimationFrame(function() {
                //         item.element.innerHTML = result;
                //       });
                //     });
                //   },
                //   update: function() {
                //     var loading = manager.history.read(["table", "loading"]);
                //     console.log(loading);
                //     this.element.classList.toggle("loading", loading);
                //   }
                // },
                {
                  tag: "button",
                  class: "button footer-item",
                  init: function(item) {
                    this.element.title = "Reload";
                    this.child = {
                      class: "table-spinner",
                      update: function() {
                        var loading = manager.history.read("static", ["loading"]);
                        this.element.classList.toggle("loading", loading);
                      },
                      child: KarmaFields.includes.icon(KarmaFields.icons_url+"/update.svg")
                    };
                    this.element.addEventListener("click", function(event) {
                      manager.request().then(function() {
                        item.element.blur();
                      });
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function() {
                    var loading = manager.history.read("table", ["loading"]);
                    // this.element.classList.toggle("active", loading);
                  }
                },
                {
                  tag: "button",
                  class: "button footer-item primary",
                  init: function() {
                    this.element.title = "Save";
                    this.element.innerText = "Save";
                    this.element.addEventListener("click", function(event) {
                      manager.sync();
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function() {
                    this.element.disabled = !manager.history.diff(["output"], ["input"]);
                  }
                },
                {
                  tag: "button",
                  class: "button footer-item",
                  init: function(item) {
                    this.element.title = "Options";
                    // KarmaFields.getAsset(KarmaFields.icons_url+"/admin-generic.svg").then(function(result) {
                    //   requestAnimationFrame(function() {
                    //     item.element.innerHTML = result;
                    //   });
                    // });
                    this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/admin-generic.svg");
                    this.element.addEventListener("click", function(event) {
                      var displayOptions = manager.history.read("static", ["displayOptions"]);

                      manager.history.write("static", ["displayOptions"], !displayOptions);
                      manager.renderFooter();
                      if (displayOptions) {
                        item.element.blur();
                      }
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function() {
                    var displayOptions = manager.history.read("static", ["displayOptions"]);
                    this.element.classList.toggle("active", displayOptions || false);
                  }
                },
                {
                  tag: "button",
                  class: "button footer-item",
                  init: function(item) {
                    this.element.title = "Undo";
                    this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/undo.svg");
                    // KarmaFields.getAsset(KarmaFields.icons_url+"/undo.svg").then(function(result) {
                    //   requestAnimationFrame(function() {
                    //     item.innerHTML = result;
                    //   });
                    // });
                    this.element.addEventListener("click", function(event) {
                      manager.history.undo();
                      manager.render();
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function() {
                    this.element.disabled = !manager.history.hasUndo();
                  }
                },
                {
                  tag: "button",
                  class: "button footer-item",
                  init: function(item) {
                    this.element.title = "Redo";
                    this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/redo.svg");
                    // KarmaFields.getAsset(KarmaFields.icons_url+"/redo.svg").then(function(result) {
                    //   requestAnimationFrame(function() {
                    //     item.element.innerHTML = result;
                    //   });
                    // });
                    this.element.addEventListener("click", function(event) {
                      manager.history.redo();
                      manager.render();
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element) {
                    this.element.disabled = !manager.history.hasRedo();;
                  }
                },
                {
                  tag: "button",
                  class: "button footer-item",
                  init: function(item) {
                    this.element.title = "Add";
                    this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/plus-alt2.svg");
                    // KarmaFields.getAsset(KarmaFields.icons_url+"/plus-alt2.svg").then(function(result) {
                    //   requestAnimationFrame(function() {
                    //     item.element.innerHTML = result;
                    //   });
                    // });
                    this.element.addEventListener("click", function(event) {
                      // window.scrollTo(0, document.body.scrollHeight);
                      // window.scrollTo(0, 0);
                      manager.addItem();
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  }
                },
                {
                  tag: "button",
                  class: "button footer-item",
                  init: function(item) {
                    this.element.title = "Delete";
                    this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/trash.svg");
                    // KarmaFields.getAsset(KarmaFields.icons_url+"/trash.svg").then(function(result) {
                    //   requestAnimationFrame(function() {
                    //     item.element.innerHTML = result;
                    //   });
                    // });
                    this.element.addEventListener("click", function(event) {
                      var uris = manager.select.getSelectedRows().map(function(cell) {
                        return cell.field.path;
                      });
                      if (uris) {
                        manager.removeItems(uris);
                      }
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element) {
                    var selectedRows = manager.select.getSelectedRows();
                    this.element.disabled = selectedRows.length === 0;
                  }
                }
              ]
            },
            KarmaFields.tables.pagination(manager)
          ]
        }
      ];
    }
  };
}
