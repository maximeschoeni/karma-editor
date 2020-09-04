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
          render();
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
                                // render();
                              });
                            },
                            update: function(a) {
                              a.classList.toggle("asc", manager.options.orderby === column.key && manager.options.order === "asc");
                              a.classList.toggle("desc", manager.options.orderby === column.key && manager.options.order === "desc");
                            }
                          }
                        ]
                      }
                    };
                  });
                  if (manager.resource.index_column) {
                    this.children.unshift({
                      tag: "th",
                      init: function(element) {
                        element.textContent = manager.resource.index_column;
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
                args.children = manager.getItems().filter(function(uri) {
                  return history.read(["field", uri, "status"], "all");
                }).map(function(post, rowIndex) {
                  return {
                    tag: "tr",
                    update: function(element, render, args) {
                      manager.select.addRow(post, rowIndex);
                      manager.history.setValue(["field", post.uri], post, true);

                      args.children = manager.resource.children.filter(function(column) {
                        return true;
                        // return manager.options.gridoptions.columns[column.key];
                      }).map(function(column, colIndex) {
                        return {
                          tag: "td",
                          id: column.key || column.name,
                          init: function(cell, render, args) {
                            var fieldManager = KarmaFields.managers.field(column, ["field", post.uri, column.key], manager.history, null);
                            args.manager = fieldManager;
                          },
                          update: function(cell, render, args) {
                            // var fieldManager = KarmaFields.managers.field(column, post, manager.resource.middleware, manager.history, null);
                            // args.manager.rowIndex = (((manager.options.page || 1)-1)*manager.options.ppp || 0)+rowIndex;
                            // fieldManager.onChangeValue = function(value) {
                            //   manager.addChange(post, column.method, column.key, value);
                            // }
                            // fieldManager.onFilter = function(filters) {
                            //   manager.filters = filters;
                            //   manager.request();
                            //   manager.renderHeader();
                            // }
                            // fieldManager.table = manager; // -> for access filters
                            // fieldManager.onSave = manager.renderFooter;
                            // manager.fields.push(fieldManager);

                            // if (column.field === "index") {
                            //   manager.select.addRowIndex(cell, args.manager, colIndex, rowIndex);
                            // } else {
                            manager.select.addField(cell, args.manager, ["field", post.uri, column.key], render, colIndex, rowIndex);
                            // }
                            // args.manager.onModify = function(isModified) {
                            //   cell.classList.toggle("modified", fieldManager.modified || false);
                            // };

                            cell.classList.toggle("modified", manager.history.isModified(["field", post.uri, column.key]));

                            args.child = KarmaFields.fields[column.field](fieldManager);
                          }
                        };
                      });
                      if (manager.resource.has_index) {
                        this.children.unshift({
                          tag: "td",
                          update: function(td) {
                            manager.select.addRowIndex(td, colIndex, rowIndex);
                            td.textContent = (((manager.options.page || 1)-1)*(manager.options.ppp || 0))+rowIndex;
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
