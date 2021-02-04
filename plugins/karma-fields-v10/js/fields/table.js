
KarmaFields.fields.table = function(field) {

  // var selectManager = KarmaFields.selectors.grid();


  // tableManager.request();



  return {
    class: "karma-field-table",
    init: function(container) {

      let selectManager = KarmaFields.selectors.grid();
      field.data.select = selectManager;


      KarmaFields.events.onSelectAll = function(event) {
        if (document.activeElement === document.body) {
          selectManager.onSelectAll(event);
          event.preventDefault();
        }
      };
      KarmaFields.events.onAdd = function(event) {
        if (document.activeElement === document.body) {
          tableManager.addItem();
          event.preventDefault();
        }
      };
      KarmaFields.events.onDelete = function(event) {
        var items = selectManager.getSelectedItems();
        if (items.length) {
          tableManager.removeItems(items);
          event.preventDefault();
        }
      };
      KarmaFields.events.onCopy = function(event) {
        selectManager.onCopy(event);
      }
      KarmaFields.events.onPast = function(event) {
        selectManager.onPast(event);
        container.render();
      }
      KarmaFields.events.onSave = function(event) {
        tableManager.sync();
        event.preventDefault();
      }
      KarmaFields.events.onUndo = function(event) {
        field.history.undo();
        container.render();
        event.preventDefault();
      }
      KarmaFields.events.onRedo = function(event) {
        field.history.redo();
        container.render();
        event.preventDefault();
      }
      KarmaFields.events.onUnload = function() {
        // manager.save();
        // manager.stopRefresh();
      }

    },
    update: function(container) {

      let tableManager = KarmaFields.managers.table(field, field.history, field.resource);
      let selectManager = field.data.select;

      field.events.render = function() {
        container.render();
      };

      // this.addEventListener("mouseup", function() {
      //   // handle outside mouseup
      //   selectManager.onClick();
      // });

      container.element.classList.add("loading");
      tableManager.request().then(function() {
        container.element.classList.remove("loading");
        container.render();
      });

      this.children = [
        {
          class: "table-header",
          clear: true,
          init: function(filter) {
            let filterResource = field.getAttribute("filter");
            if (filterResource) {
              var filterField = field.createChild();
              filterField.resource = filterResource;
              filterField.buffer = "filters";
              filterField.outputBuffer = false;
              filterField.events.submit = function() {

                tableManager.setPage(1);
                container.element.classList.add("loading");
                return tableManager.request().then(function() {
                  container.element.classList.remove("loading");
                  container.render();
                });
              }
              filterField.events.update = function() {
                field.trigger("updateFooter");
              };
              filterField.events.render = this.render;
              this.element._field = filterField;
            }
          },
          update: function(filter) {
            if (this.element._field) {
              this.children = this.element._field.build();
            }
          }
        },
        {
          class: "table-body",
          clear: true,
          children: [{
            class: "table grid",
            init: function() {
              if (field.resource.width) {
                this.style.width = field.resource.width;
              }
              if (field.resource.style) {
                this.style = field.resource.style;
              }
            },
            update: function(table) {

              selectManager.init();

              let templateColumns = [];
              if (field.resource.index) {
                templateColumns.push(field.resource.index.width || "40px")
              }
              field.resource.children.filter(function(column) {
                return true;
              }).forEach(function(column, colIndex) {
                templateColumns.push(column.width || "1fr");
              });
              this.element.style.gridTemplateColumns = templateColumns.join(" ");


              this.children = [];

              if (field.resource.index) {
                this.children.push({
                  class: "th table-header-index",
                  init: function() {
                    if (field.resource.index.title) {
                      this.element.textContent = field.resource.index.title;
                    }
                    this.element.addEventListener("mousedown", function(event) {
                      selectManager.onIndexHeaderMouseDown();
                    });
                    this.element.addEventListener("mousemove", function(event) {
                      selectManager.onIndexHeaderMouseMove();
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      selectManager.onIndexHeaderMouseUp();
                      event.stopPropagation();
                    });
                  }
                });
              }

              field.resource.children.filter(function(column) {
                return true;
              }).forEach(function(column, colIndex) {
                table.children.push({
                  class: "th",
                  init: function() {
                    if (column.main) {
                      this.element.classList.add("main");
                    }
                    if (column.width) {
                      this.element.style.width = column.width;
                    }
                    this.element.addEventListener("mousedown", function(event) {
                      selectManager.onHeaderMouseDown(colIndex);
                    });
                    this.element.addEventListener("mousemove", function(event) {
                      selectManager.onHeaderMouseMove(colIndex);
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      selectManager.onHeaderMouseUp(colIndex);
                      event.stopPropagation();
                    });
                  },
                  update: function(th) {
                    this.children = [
                      {
                        tag: "a",
                        class: "header-cell-title",
                        init: function() {
                          this.element.textContent = column.title;
                        }
                      }
                    ];
                    if (column.sortable) {
                      this.children.push({
                        tag: "a",
                        class: "header-cell-order",
                        children: [{
                          class: "order-icon change-order",
                        }],
                        init: function() {
                          this.element.addEventListener("click", function() {
                            container.element.classList.add("loading");
                            tableManager.reorder(column).then(function() { // ! should use field.resource.children[colIndex]
                              container.element.classList.remove("loading");
                              container.render();
                            });
                          });
                        },
                        update: function() {
                          var orderby = field.history.request(["order", "orderby"]);
                          var order = field.history.request(["order", "order"]);
                          this.element.classList.toggle("asc", orderby === column.key && order === "asc");
                          this.element.classList.toggle("desc", orderby === column.key && order === "desc");
                        }
                      });
                    }
                  }
                });
              });

              let uris = tableManager.getItems();

              uris && uris.forEach(function(uri, rowIndex) {

                if (field.resource.index) {
                  table.children.push({
                    class: "th table-row-index",
                    init: function() {
                      this.element.addEventListener("mousedown", function(event) {
                        selectManager.onIndexCellMouseDown(rowIndex);
                      });
                      this.element.addEventListener("mousemove", function() {
                        selectManager.onIndexCellMouseMove(rowIndex);
                      });
                      this.element.addEventListener("mouseup", function(event) {
                        selectManager.onIndexCellMouseUp(rowIndex);
                        event.stopPropagation();
                      });
                    },
                    update: function() {
                      var page = tableManager.getPage();
                      var ppp = tableManager.getPpp();
                      this.element.textContent = ((page-1)*ppp)+rowIndex+1;
                    }
                  });
                }

                field.resource.children.forEach(function(column, colIndex) {
                  table.children.push({
                    class: "td",
                    reflow: function(element) {
                      return !element._field
                        || element._field.uri !== uri
                        || (element._field.resource.name || element._field.resource.field) !== (column.name || column.field);
                    },
                    init: function(cell) {
                      this.element.addEventListener("mousedown", function(event) {
                        selectManager.onCellMouseDown(colIndex, rowIndex);
                      });
                      this.element.addEventListener("mousemove", function() {
                        selectManager.onCellMouseMove(colIndex, rowIndex);
                      });
                      this.element.addEventListener("mouseup", function(event) {
                        selectManager.onCellMouseUp(colIndex, rowIndex);
                        event.stopPropagation();
                      });
                      if (column.container_style) {
                        this.element.style = column.container_style;
                      }

                      let child = field.createChild();
                      child.uri = uri;
                      child.resource = column;
                      child.element = this.element;
                      child.events.update = function() {
                        field.trigger("updateFooter");
                      };
                      child.events.modify = function() {
                        cell.element.classList.toggle("modified", child.isModified());
                      }
                      child.events.render = function() {
                        cell.render();
                      }
                      this.element._field = child;
                    },
                    update: function(cell) {
                      this.child = KarmaFields.fields[column.name || column.field || "group"](this.element._field);
                      selectManager.addField(colIndex, rowIndex, this.element, this.element._field);
                      // this.element.classList.toggle("modified", this.element._field.isModified());
                    }
                  });
                });
              });
            }
          }]
        },
        {
          class: "table-footer",
          update: function(footer) {
            field.events.updateFooter = function() {
              footer.render();
            };
            selectManager.onSelect = function() {
              footer.render();
            }
            this.children = [
              {
                class: "table-options-container",
                update: function(element) {
                  var displayOptions = tableManager.history.read("static", ["displayOptions"]);
                  this.child = displayOptions && {
                    class: "table-options-body",
                    init: function() {
                      var optionField = field.createChild(field.resource.options);
                      optionField.buffer = "options";
                      optionField.outputBuffer = false;
                      optionField.driver = false;
                      optionField.events.submit = function() {
                        field.history.setValue(["static", "displayOptions"], false);
                        container.element.classList.add("loading");
                        tableManager.request().then(function() {
                          container.element.classList.remove("loading");
                          container.render();
                        });
                      };
                      this.element._field = optionField;
                    },
                    update: function() {
                      if (field.resource.options) {
                        this.children = this.element._field.build();
                      }
                    }
                  };
                }
              },
              {
                class: "footer-bar",
                children: [
                  {
                    class: "footer-group table-info",
                    children: [
                      {
                        tag: "button",
                        class: "button footer-item",
                        children: [{
                          class: "table-spinner",
                          update: function(icon) {
                            var loading = field.history.read("static", ["loading"]);
                            this.element.classList.toggle("loading", loading);
                          },
                          child: KarmaFields.includes.icon({
                            file: KarmaFields.icons_url+"/update.svg"
                          })
                        }],
                        init: function(item) {
                          this.element.title = "Reload";

                          // field.events["load"] = function() {
                          //   field.history.setValue(["static", "loading"], true);
                          //   item.render();
                          // }

                          this.element.addEventListener("click", function(event) {
                            container.element.classList.add("loading");
                            tableManager.request().then(function() {
                              container.element.classList.remove("loading");
                              container.render();
                              item.element.blur();
                            });
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item primary",
                        init: function() {
                          this.element.title = "Save";
                          this.element.textContent = "Save";
                          this.element.addEventListener("click", function(event) {
                            container.element.classList.add("loading");
                            tableManager.sync().then(function() {
                              return tableManager.request();
                            }).then(function() {
                              container.element.classList.remove("loading");
                              container.render();
                            });
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function() {
                          this.element.disabled = field.history.contain(["input"], ["output"]);
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item",
                        child: KarmaFields.includes.icon({
                          file: KarmaFields.icons_url+"/admin-generic.svg"
                        }),
                        init: function(button) {
                          this.element.title = "Options";
                          this.element.addEventListener("click", function(event) {
                            var displayOptions = field.history.read("static", ["displayOptions"]);
                            field.history.write("static", ["displayOptions"], !displayOptions);
                            footer.render();
                            if (displayOptions) {
                              button.element.blur();
                            }
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function() {
                          var displayOptions = field.history.read("static", ["displayOptions"]);
                          this.element.classList.toggle("active", displayOptions || false);
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item",
                        child: KarmaFields.includes.icon({
                          file: KarmaFields.icons_url+"/undo.svg"
                        }),
                        init: function(item) {
                          this.element.title = "Undo";
                          // this.
                          this.element.addEventListener("click", function(event) {
                            field.history.undo();
                            container.render();
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function() {
                          this.element.disabled = !field.history.hasUndo();
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item",
                        child: KarmaFields.includes.icon({
                          file: KarmaFields.icons_url+"/redo.svg"
                        }),
                        init: function(button) {
                          this.element.title = "Redo";
                          this.element.addEventListener("click", function(event) {
                            field.history.redo();
                            container.render();
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function(button) {
                          this.element.disabled = !field.history.hasRedo();
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item",
                        child: KarmaFields.includes.icon({
                          file: KarmaFields.icons_url+"/plus-alt2.svg"
                        }),
                        init: function(item) {
                          this.element.title = "Add";
                          // this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/plus-alt2.svg");
                          this.element.addEventListener("click", function(event) {
                            container.element.classList.add("loading");
                            tableManager.addItem().then(function() {
                              container.element.classList.remove("loading");
                              container.render();
                            });
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function(element) {
                          this.element.disabled = field.getAttribute("disable_create");
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item",
                        child: KarmaFields.includes.icon({
                          file: KarmaFields.icons_url+"/trash.svg"
                        }),
                        init: function(item) {
                          this.element.title = "Delete";
                          this.element.addEventListener("click", function(event) {
                            var uris = selectManager.getSelectedRows().map(function(cell) {
                              return cell.field.uri;
                            });
                            if (uris) {
                              tableManager.removeItems(uris);
                              container.render();
                            }
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function(element) {
                          var selectedRows = selectManager.getSelectedRows();
                          this.element.disabled = selectedRows.length === 0 || field.getAttribute("disable_delete");
                        }
                      }
                    ]
                  },
                  {
                    class: "footer-group table-pagination",
                    update: function() {
                      this.children = [
                        {
                          tag: "p",
                          class: "footer-item",
                          update: function() {
                            var num = tableManager.getCount();
                            this.element.textContent = num ? num+" items" : "";
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          init: function() {
                            this.element.innerText = "«";
                            this.element.addEventListener("click", function() {
                              tableManager.setPage(1);
                              container.element.classList.add("loading");
                              tableManager.request().then(function() {
                                container.element.classList.remove("loading");
                                container.render();
                              });
                            });
                          },
                          update: function() {
                            var num = tableManager.getCount();
                            var ppp = tableManager.getPpp();
                            var page = tableManager.getPage();
                            this.element.style.display = num > ppp ? "block" : "none";
                            this.element.disabled = (page === 1);
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          init: function() {
                            var page = tableManager.getPage();
                            this.element.innerText = "‹";
                            this.element.addEventListener("click", function() {
                              tableManager.setPage(tableManager.getPage()-1);
                              container.element.classList.add("loading");
                              tableManager.request().then(function() {
                                container.element.classList.remove("loading");
                                container.render();
                              });
                            });
                          },
                          update: function() {
                            var num = tableManager.getCount();
                            var ppp = tableManager.getPpp();
                            var page = tableManager.getPage();
                            this.element.style.display = num > ppp ? "block" : "none";
                            this.element.disabled = (page === 1);
                          }
                        },
                        {
                          class: "current-page footer-item",
                          update: function() {
                            var num = tableManager.getCount();
                            var ppp = tableManager.getPpp();
                            var page = tableManager.getPage();
                            this.element.style.display = num > ppp ? "block" : "none";
                            this.element.textContent = num && page+" / "+Math.ceil(num/ppp) || "";
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          init: function() {
                            this.element.innerText = "›";
                            this.element.addEventListener("click", function() {
                              tableManager.setPage(tableManager.getPage()+1);
                              container.element.classList.add("loading");
                              tableManager.request().then(function() {
                                container.element.classList.remove("loading");
                                container.render();
                              });
                            });
                          },
                          update: function() {
                            var num = tableManager.getCount();
                            var ppp = tableManager.getPpp();
                            var page = tableManager.getPage();
                            this.element.style.display = num > ppp ? "block" : "none";
                            this.element.disabled = page >= Math.ceil(num/ppp);
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          init: function(element) {
                            this.element.innerText = "»";
                            this.element.addEventListener("click", function() {
                              var num = tableManager.getCount();
                              var ppp = tableManager.getPpp();
                              tableManager.setPage(Math.ceil(num/ppp));
                              container.element.classList.add("loading");
                              tableManager.request().then(function() {
                                container.element.classList.remove("loading");
                                container.render();
                              });
                            });
                          },
                          update: function() {
                            var num = tableManager.getCount();
                            var ppp = tableManager.getPpp();
                            var page = tableManager.getPage();
                            this.element.style.display = num > ppp ? "block" : "none";
                            this.element.disabled = page >= Math.ceil(num/ppp);
                          }
                        }
                      ];
                    }
                  }
                ]
              }
            ];
          }
        }
      ];
    }
  };
}
