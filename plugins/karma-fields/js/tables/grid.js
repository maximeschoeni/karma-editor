KarmaFields.tables.grid = function(manager) {
  return {
    class: "karma-field-table karma-fields",
    init: function(container) {
      manager.render = this.render;
      this.element.addEventListener("mouseup", function() {
        // handle outside mouseup
        if (manager.select && manager.select.onClick) {
          manager.select.onClick();
        }
      });
    },
    children: [
      {
        class: "table-header",
        init: function() {
          manager.renderHeader = this.render;
          this.children = manager.resource.filter && KarmaFields.managers.field(manager.resource.filter, {
            inputBuffer: "filters",
            outputBuffer: "filters",
            history: manager.history,
            tableManager: manager,
            onSetValue: function() {
              manager.request();
            }
          }).build()
        }
      },
      {
        class: "table-body",
        child: {
          tag: "table",
          class: "grid",
          init: function() {
            manager.renderBody = this.render;
            manager.request();

            if (manager.resource.width) {
              this.element.style.width = manager.resource.width;
            }
            if (manager.resource.style) {
              this.element.style = manager.resource.style;
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
                update: function() {
                  var orderby = manager.history.read(["options", "orderby"]);
                  var order = manager.history.read(["options", "order"]);
                  this.children = manager.resource.children.filter(function(column) {
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
                      init: function() {
                        if (column.main) {
                          this.element.classList.add("main");
                        }
                        if (column.width) {
                          this.element.style.width = column.width;
                        }
                      },
                      update: function() {
                        manager.select.addCol(this.element, colIndex);
                      },
                      child: {
                        class: "header-cell",
                        children: [
                          {
                            tag: "a",
                            class: "header-cell-title",
                            init: function() {
                              this.element.textContent = column.title;
                            }
                          },
                          column.sortable && {
                            tag: "a",
                            class: "header-cell-order",
                            child: {
                              class: "order-icon change-order",
                            },
                            init: function() {
                              this.element.addEventListener("click", function() {
                                manager.reorder(column.key, column.default_order);
                                manager.request();
                              });
                            },
                            update: function() {
                              this.element.classList.toggle("asc", orderby === column.key && order === "asc");
                              this.element.classList.toggle("desc", orderby === column.key && order === "desc");
                            }
                          }
                        ]
                      }
                    };
                  });
                  if (manager.resource.index) {
                    this.children.unshift({
                      tag: "th",
                      class: "table-header-index",
                      init: function(element) {
                        if (manager.resource.index.title) {
                          this.element.textContent = manager.resource.index.title;
                        }
                        if (manager.resource.index.width) {
                          this.element.style.width = manager.resource.index.width;
                        }
                      },
                      update: function() {
                        manager.select.addIndexHeader(this.element);
                      }
                    });
                  }
                }
              }
            },
            {
              tag: "tbody",
              update: function() {
                var uris = manager.history.read(["table", "items"]);

                this.children = uris && uris.filter(function(uri) {
                  return !manager.history.read(["output", uri, "trash"]);
                }).map(function(uri, rowIndex) {
                  return {
                    tag: "tr",


                    update: function() {
                      manager.select.addRow(uri, rowIndex); // really needed?

                      this.children = manager.resource.children.filter(function(column) {
                        return true;
                      }).map(function(column, colIndex) {
                        // var fieldManager;
                        return {
                          tag: "td",
                          // id: column.key || column.name,
                          init: function() {
                            // var fieldManager = KarmaFields.managers.field(column, "output", [uri], [column.key], manager.history, manager.selection, null);

                          },
                          update: function(cell) {
                            var fieldManager = KarmaFields.managers.field(column, {
                              path: uri,
                              inputBuffer: "input",
                              outputBuffer: "output",
                              history: manager.history,
                              selection: manager.selection,
                              tableManager: manager,
                              onSetValue: function() {
                                // requestAnimationFrame(function() {
                                //   manager.renderFooter();
                                // });

                                // console.log(manager.history.input, manager.history.output);

                                cell.element.classList.toggle("modified", fieldManager.isModified());
                                manager.renderFooter();
                              }
                            });

                            this.child = KarmaFields.fields[column.field](fieldManager);

                            manager.select.addField(this.element, uri, column.key, fieldManager, this.render, colIndex, rowIndex);

                            cell.element.classList.toggle("modified", fieldManager.isModified());



                          }
                        };
                      });


                      if (manager.resource.index) {
                        this.children.unshift({
                          tag: "td",
                          init: function() {
                            this.element.addEventListener("mousedown", function(event) {
                      				manager.select.onIndexCellMouseDown(rowIndex);
                      			});
                      			this.element.addEventListener("mousemove", function() {
                      				manager.select.onIndexCellMouseMove(rowIndex);
                      			});
                      			this.element.addEventListener("mouseup", function(event) {
                      				manager.select.onIndexCellMouseUp(rowIndex);
                      				event.stopPropagation();
                      			});
                          },
                          update: function() {
                            manager.select.addRowIndex(this.element, rowIndex);
                          },
                          child: {
                            class: "row-index",
                            update: function() {
                              var page = manager.getPage(); //parseInt(manager.history.read(["options", "page"]) || 1);
                              var ppp = manager.getPpp(); //parseInt(manager.history.read(["options", "ppp"]) || Number.MAX_SAFE_INTEGER);
                              this.element.textContent = ((page-1)*ppp)+rowIndex+1;
                            },
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
