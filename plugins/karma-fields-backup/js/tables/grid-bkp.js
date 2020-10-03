KarmaFields.tables.grid = function(manager) {
  return {
    class: "karma-field-table karma-fields",
    init: function(element, render) {
      manager.render = render;
      element.addEventListener("mouseup", function() {
        // handle outside mouseup
        if (manager.select && manager.select.onClick) {
          manager.select.onClick();
        }
      });
    },
    children: [
      {
        class: "table-header",
        init: function(element, render) {
          manager.renderHeader = render;
        },
        // update: function(element, render, args) {
        //   args.child = manager.buildFilter()
        // }
        child: manager.buildFilter()
      },
      {
        class: "table-body",
        child: {
          tag: "table",
          class: "grid",
          init: function(table, render) {
            manager.renderBody = render;
            manager.request();

            if (manager.resource.width) {
              table.style.width = manager.resource.width;
            }
          },
          update: function() {
            manager.select.init(); // = KarmaFields.selectors.grid(manager);
            // manager.fields = [];

          },
          children: [
            {
              tag: "thead",
              child: {
                tag: "tr",
                update: function(element, renderRow, args) {
                  var orderby = manager.history.read("options", [], "orderby");
                  var order = manager.history.read("options", [], "order");
                  args.children = manager.resource.children.filter(function(column) {
                    return true;
                    // return manager.options.gridoptions.columns[column.key];
                  }).map(function(column, colIndex) {
                    // var headerCell = KarmaFields.tables.headerCell(manager, column);
                    // // if (column.field === "index") {
                    // //   manager.select.addIndexHeader(headerCell, colIndex);
                    // // } else {
                    // manager.select.addCol(headerCell, colIndex);
                    // // }
                    // if (column.width) {
                    //   headerCell.style.width = column.width;
                    // }
                    // return headerCell;

                    return {
                      tag: "th",
                      init: function(element, update) {
                        if (column.main) {
                          element.classList.add("main");
                        }
                        if (column.width) {
                          element.style.width = column.width;
                        }
                      },
                      update: function(element) {
                        manager.select.addCol(element, colIndex);
                      },
                      child: {
                        class: "header-cell",
                        children: [
                          {
                            tag: "a",
                            class: "header-cell-title",
                            text: column.title
                          },
                          column.sortable && {
                            tag: "a",
                            class: "header-cell-order",
                            child: {
                              class: "order-icon change-order",
                            },
                            init: function(a, render) {
                              a.addEventListener("click", function() {
                                manager.reorder(column.key, column.default_order);
                                manager.request();
                              });
                            },
                            update: function(a) {
                              a.classList.toggle("asc", orderby === column.key && order === "asc");
                              a.classList.toggle("desc", orderby === column.key && order === "desc");
                            }
                          }
                        ]
                      }
                    };
                  });
                  if (manager.resource.index) {
                    this.children.unshift({
                      tag: "th",
                      init: function(element) {
                        if (manager.resource.index.title) {
                          element.textContent = manager.resource.index.title;
                        }
                        if (manager.resource.index.width) {
                          element.style.width = manager.resource.index.width;
                        }
                      },
                      update: function(element) {
                        manager.select.addIndexHeader(element);
                      }
                    });
                  }
                }
              }
            },
            {
              tag: "tbody",
              update: function(element, render, args) {
                var uris = manager.history.read("input", [], "items");
                args.children = uris && uris.filter(function(uri) {
                  return !manager.history.read("output", [uri], "trash");
                }).map(function(uri, rowIndex) {
                  return {
                    tag: "tr",
                    update: function(element, render, args) {
                      manager.select.addRow(uri, rowIndex); // really needed?

                      args.children = manager.resource.children.filter(function(column) {
                        return true;
                      }).map(function(column, colIndex) {
                        var fieldManager;
                        return {
                          tag: "td",
                          id: column.key || column.name,
                          init: function(cell, render, args) {
                            // var fieldManager = KarmaFields.managers.field(column, "output", [uri], [column.key], manager.history, manager.selection, null);
                            fieldManager = KarmaFields.managers.field(column, {
                              path: uri,
                              inputBuffer: "input",
                              outputBuffer: "output",
                              history: manager.history,
                              selection: manager.selection,
                              tableManager: manager
                            });

                            args.child = KarmaFields.fields[column.field](fieldManager);
                          },
                          update: function(cell, render, args) {
                            manager.select.addField(cell, fieldManager, render, colIndex, rowIndex);
                            cell.classList.toggle("modified", manager.history.isModified([uri], [column.key]));
                          }
                        };
                      });
                      if (manager.resource.index) {
                        this.children.unshift({
                          tag: "td",
                          update: function(td) {
                            manager.select.addRowIndex(td, rowIndex);
                            var page = parseInt(manager.history.read("options", [], "page") || 1);
                            var ppp = parseInt(manager.history.read("options", [], "ppp") || Number.MAX_SAFE_INTEGER);
                            td.textContent = ((page-1)*ppp)+rowIndex;
                          }
                        });
                      }
                    }
                  };
                });
              }
            }
          ]
        }
      },
      KarmaFields.tables.footer(manager)
    ]
  };
}
