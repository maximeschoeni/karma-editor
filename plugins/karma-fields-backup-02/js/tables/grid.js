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
          if (manager.resource.filter) {
            var filter = KarmaFields.managers.field();
            filter.resource = manager.resource.filter;
            // filter.input = "filters";
            // filter.output = "filters";
            filter.buffer = manager.resource.filter.buffer || "inner";

            filter.path = "filters";
            filter.history = manager.history;
            // filter.id = "karma-table-filters";
            filter.onSetValue = function() {
              manager.setPage(1);
              manager.request();
            };
            filter.onSubmit = function() {
              manager.render();
            };
            filter.onRequestFooterUpdate = function() {
              manager.renderFooter();
            };
            this.children = filter.build();
          }
          // this.children = manager.resource.filter && KarmaFields.managers.field(manager.resource.filter, {
          //   inputBuffer: "filters",
          //   outputBuffer: "filters",
          //   history: manager.history,
          //   tableManager: manager,
          //   onSetValue: function() {
          //     manager.request();
          //   }
          // }).build()
        }
      },
      {
        class: "table-body",
        child: {
          tag: "table",
          class: "grid",
          init: function() {
            manager.renderBody = this.render;

            // manager.history.write("inner", ["table", "items"], []);

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
            manager.fields = {};

            // console.log("update table");
          },
          children: [
            {
              tag: "thead",
              child: {
                tag: "tr",
                update: function() {
                  var orderby = manager.history.read("inner", ["options", "orderby"]);
                  var order = manager.history.read("inner", ["options", "order"]);
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
                        if (column.style) {
                          this.element.style = column.style;
                        }
                        if (column.width) {
                          this.element.style.width = column.width;
                        }
                        this.element.addEventListener("mousedown", function(event) {
                    			manager.select.onHeaderMouseDown(colIndex);
                    		});
                    		this.element.addEventListener("mousemove", function(event) {
                    			manager.select.onHeaderMouseMove(colIndex);
                    		});
                    		this.element.addEventListener("mouseup", function(event) {
                    			manager.select.onHeaderMouseUp(colIndex);
                    			event.stopPropagation();
                    		});
                      },
                      update: function() {
                        // manager.select.addCol(this.element, colIndex);
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
                        this.element.addEventListener("mousedown", function(event) {
                    			manager.select.onIndexHeaderMouseDown();
                    		});
                    		this.element.addEventListener("mousemove", function(event) {
                    			manager.select.onIndexHeaderMouseMove();
                    		});
                    		this.element.addEventListener("mouseup", function(event) {
                    			manager.select.onIndexHeaderMouseUp();
                    			event.stopPropagation();
                    		});
                      },
                      update: function() {
                        // manager.select.addIndexHeader(this.element);
                      }
                    });
                  }
                }
              }
            },
            {
              tag: "tbody",
              update: function() {
                // var uris = manager.history.read("inner", ["table", "items"]);

                // console.log("update tbody");
                // console.trace();

                var uris = manager.getItems();

                this.children = uris && uris.filter(function(uri) {
                  // var trash = manager.history.read(["output", uri, "trash"]);
                  // console.log(trash, !trash);
                  // return !trash;
                  return uri;
                }).map(function(uri, rowIndex) {
                  return {
                    tag: "tr",
                    init: function() {
                      // this.data.trashManager = KarmaFields.managers.field();
                      // // this.data.trashManager.path = uri;
                      // this.data.trashManager.resource = {
                      //   key: "trash"
                      // };
                      // this.data.trashManager.incrementHistory = true;
                      // this.data.trashManager.input = "input";
                      // this.data.trashManager.output = "output";
                      // this.data.trashManager.history = manager.history;
                      // this.data.trashManager.onSetValue = function() {
                      //   manager.renderFooter();
                      // }
                    },

                    update: function(row) {
                      // row.data.trashManager.path = uri;

                      // manager.select.addField("trash", rowIndex, null, row.data.trashManager);

                      this.children = manager.resource.children.filter(function(column) {
                        return true;
                      }).map(function(column, colIndex) {
                        // var fieldManager;
                        return {
                          tag: "td",
                          // id: column.key || column.name,
                          init: function(cell) {
                            // var fieldManager = KarmaFields.managers.field(column, "output", [uri], [column.key], manager.history, manager.selection, null);

                            this.data.fieldManager = KarmaFields.managers.field();
                            // column, {
                            //   // ...column,
                            //   path: uri,
                            //   inputBuffer: "input",
                            //   outputBuffer: "output",
                            //   history: manager.history,
                            //   selection: manager.selection,
                            //   tableManager: manager,
                            //   onSetValue: function() {
                            //     // requestAnimationFrame(function() {
                            //     //   manager.renderFooter();
                            //     // });
                            //
                            //     // console.log(manager.history.input, manager.history.output);
                            //
                            //     cell.element.classList.toggle("modified", cell.data.fieldManager.isModified());
                            //     manager.renderFooter();
                            //   }
                            // });
                            this.data.fieldManager.history = manager.history;
                            this.data.fieldManager.selection = manager.select;
                            this.data.fieldManager.buffer = column.buffer || "output";
                            // this.data.fieldManager.inputBuffer = "input";
                            this.data.fieldManager.onSetValue = function() {
                              cell.element.classList.toggle("modified", this.isModified());
                              manager.renderFooter();
                            }

                            this.child = KarmaFields.fields[column.field](cell.data.fieldManager);

                            this.element.addEventListener("mousedown", function(event) {
                              manager.select.onCellMouseDown(colIndex, rowIndex);
                            });
                            this.element.addEventListener("mousemove", function() {
                              manager.select.onCellMouseMove(colIndex, rowIndex);
                            });
                            this.element.addEventListener("mouseup", function(event) {
                              manager.select.onCellMouseUp(colIndex, rowIndex);
                              event.stopPropagation();
                            });
                            if (column.container_style) {
                              this.element.style = column.container_style;
                            }
                          },
                          update: function(cell) {
                            this.data.fieldManager.resource = column;
                      			this.data.fieldManager.path = uri;
                            this.data.fieldManager.selection = manager.select;
                            this.data.fieldManager.render = this.render;
                            this.data.fieldManager.colIndex = colIndex;
                            this.data.fieldManager.element = cell.element;

                            manager.select.addField(colIndex, rowIndex, this.element, this.data.fieldManager);

                            KarmaFields.Object.setValue(manager.fields, [column.driver, uri, column.key], this);

                            cell.element.classList.toggle("modified", this.data.fieldManager.isModified());
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
