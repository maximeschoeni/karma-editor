KarmaFields.fields.table = function(field) {
  return {
    class: "karma-field-table karma-fields",
    init: function(container) {
      var tableManager = KarmaFields.managers.table(field, field.history);
      var selectManager = KarmaFields.selectors.grid();
      field.events.render = this.render;



      // manager.render = this.render;
      this.element.addEventListener("mouseup", function() {
        // handle outside mouseup
        selectManager.onClick();
      });
      this.children = [
        {
          class: "table-header",
          init: function(filter) {
            var filterResources = field.getAttribute("filter");
            if (filterResources) {
              var filterField = field.createChild(filterResources);
              filterField.buffer = "filters";
              filterField.events.submit = function() {
                tableManager.setPage(1);
                tableManager.request();
              }
              filterField.events.render = this.render;
              this.children = filterField.createChild(filters).build();
            }
          }
        },
        {
          class: "table-body",
          child: {
            tag: "table",
            class: "grid",
            init: function() {
              tableManager.request();
              if (field.resource.width) {
                this.element.style.width = field.resource.width;
              }
              if (field.resource.style) {
                this.element.style = field.resource.style;
              }
            },
            update: function() {
              selectManager.init(); // = KarmaFields.selectors.grid(manager);
            },
            children: [
              {
                tag: "thead",
                child: {
                  tag: "tr",
                  update: function() {
                    this.children = field.resource.children.filter(function(column) {
                      return true;
                    }).map(function(column, colIndex) {
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
                        child: {
                          class: "header-cell",
                          update: function() {
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
                                child: {
                                  class: "order-icon change-order",
                                },
                                init: function() {
                                  this.element.addEventListener("click", function() {
                                    tableManager.reorder(column);
                                    tableManager.request();
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
                        }
                      };
                    });
                    if (field.resource.index) {
                      this.children.unshift({
                        tag: "th",
                        class: "table-header-index",
                        init: function() {
                          if (field.resource.index.title) {
                            this.element.textContent = field.resource.index.title;
                          }
                          if (tableManager.resource.index.width) {
                            this.element.style.width = field.resource.index.width;
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
                  }
                }
              },
              {
                tag: "tbody",
                update: function() {
                  var uris = tableManager.getItems();

                  // var tableField = field.history.createFieldManager({
                  //   buffer: "input",
                  //   outputBuffer: "output"
                  // });
                  // tableField.events.updateFooter = function() {
                  //   manager.renderFooter();
                  // }
                  tableField.events.render = this.render;
                  this.children = uris && uris.filter(function(uri) {
                    return uri;
                  }).map(function(uri, rowIndex) {
                    return {
                      tag: "tr",
                      update: function(row) {
                        this.children = field.resource.children.filter(function(column) {
                          return true;
                        }).map(function(column, colIndex) {
                          return {
                            tag: "td",
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
                            },
                            update: function(cell) {
                              var cellField = field.createChild(column);
                              cellField.uri = uri;
                              // field.events.update = function() {
                              //   manager.renderFooter();
                              // }
                              cellField.events.update = container.render;
                              cellField.events.modify = function() {
                                cell.element.classList.toggle("modified", cellField.isModified());
                              }
                              cellField.events.render = cell.render;
                              selectManager.addField(colIndex, rowIndex, this.element, field);
                              cellField.trigger("modify");
                              this.child = cellField.buildSingle(); // should only do this if there is actual change
                            }
                          };
                        });

                        if (field.resource.index) {
                          this.children.unshift({
                            tag: "th",
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
                              selectManager.addRowIndex(this.element, rowIndex);
                            },
                            child: {
                              class: "row-index",
                              update: function() {
                                var page = tableManager.getPage();
                                var ppp = tableManager.getPpp();
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
        {
          class: "table-footer",
          init: function() {
            // manager.renderFooter = this.render;
            filed.selectManager.onSelect = this.render;
          },
          update: function() {
            this.children = [
              {
                class: "table-options-container",
                update: function(element) {
                  var displayOptions = tableManager.history.read("static", ["displayOptions"]);
                  this.child = displayOptions && {
                    class: "table-options-body",
                    init: function() {
                      if (field.resource.options) {
                        var optionField = field.createChild(field.resource.options);
                        optionField.buffer = "options";
                        optionField.events.submit = function() {
                          field.history.setValue(["static", "displayOptions"], false);
                          tableManager.request();
                        };
                        this.children = optionField.build();
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
                        init: function(item) {
                          this.element.title = "Reload";
                          this.child = {
                            class: "table-spinner",
                            update: function() {
                              var loading = field.history.read("static", ["loading"]);
                              this.element.classList.toggle("loading", loading);
                            },
                            child: KarmaFields.includes.icon(KarmaFields.icons_url+"/update.svg")
                          };
                          this.element.addEventListener("click", function(event) {
                            tableManager.request().then(function() {
                              item.element.blur();
                            });
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function() {
                          var loading = field.history.read("table", ["loading"]);
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item primary",
                        init: function() {
                          this.element.title = "Save";
                          this.element.innerText = "Save";
                          this.element.addEventListener("click", function(event) {
                            tableManager.sync();
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function() {
                          this.element.disabled = !field.history.diff(["output"], ["input"]);
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item",
                        init: function(item) {
                          this.element.title = "Options";
                          this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/admin-generic.svg");
                          this.element.addEventListener("click", function(event) {
                            var displayOptions = field.history.read("static", ["displayOptions"]);

                            field.history.write("static", ["displayOptions"], !displayOptions);
                            tableManager.renderFooter();
                            if (displayOptions) {
                              item.element.blur();
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
                        init: function(item) {
                          this.element.title = "Undo";
                          this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/undo.svg");
                          this.element.addEventListener("click", function(event) {
                            field.history.undo();
                            tableManager.render();
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
                        init: function(item) {
                          this.element.title = "Redo";
                          this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/redo.svg");
                          this.element.addEventListener("click", function(event) {
                            field.history.redo();
                            tableManager.render();
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function(element) {
                          this.element.disabled = !field.history.hasRedo();
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item",
                        init: function(item) {
                          this.element.title = "Add";
                          this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/plus-alt2.svg");
                          this.element.addEventListener("click", function(event) {
                            tableManager.addItem();
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
                          this.element.addEventListener("click", function(event) {
                            var uris = selectManager.getSelectedRows().map(function(cell) {
                              return cell.field.path;
                            });
                            if (uris) {
                              tableManager.removeItems(uris);
                            }
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function(element) {
                          var selectedRows = selectManager.getSelectedRows();
                          this.element.disabled = selectedRows.length === 0;
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
                              tableManager.request();
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
                            if (page === 1) {
                              this.element.disabled = true;
                            }
                            this.element.addEventListener("click", function() {
                              tableManager.setPage(tableManager.getPage()-1);
                              tableManager.request();
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
                              tableManager.request();
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
                              tableManager.request();
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
    		tableManager.render();
    	}
    	KarmaFields.events.onSave = function(event) {
    		tableManager.sync();
    		event.preventDefault();
    	}
    	KarmaFields.events.onUndo = function(event) {
    		field.history.undo();
    		tableManager.render();
    		event.preventDefault();
    	}
    	KarmaFields.events.onRedo = function(event) {
    		field.history.redo();
    		tableManager.render();
    		event.preventDefault();
    	}
    	KarmaFields.events.onUnload = function() {
    		// manager.save();
    		// manager.stopRefresh();
    	}
    }
  };
}
