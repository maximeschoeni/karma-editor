
KarmaFields.fields.table = function(field) {

  return {
    class: "karma-field-table",
    init: function(container) {

      field.events.render = function() {
        container.render();
      }

      let header = field.createChild({
        key: "header",
        children: [
          {
            key: "filter",
            children: field.resource.filter && [field.resource.filter]
          },
          {
            key: "orderby",
            type: "hidden",
            value: field.resource.orderby
          },
          {
            key: "order",
            type: "hidden"
          },
          {
            key: "page",
            type: "hidden",
            value: 1
          },
          {
            key: "ppp",
            type: "hidden",
            value: field.resource.ppp || 50
          },
          {
            key: "option",
            type: "hidden",
            children: field.resource.option && [field.resource.option]
          }
        ],
      });

      let body = field.createChild({
        key: "body"
      });

      let footer = field.createChild({
        key: "footer",
        children: [
          {
            key: "count",
            type: "hidden"
          },
          {
            key: "ids",
            type: "hidden"
          },
          {
            key: "drafts",
            type: "hidden"
          }
        ],
      });

      footer.events.change = function(currentField) {
        currentField.history.save();
      }

      body.events.change = function(currentField) {
        KarmaFields.History.update(currentField);
        currentField.history.save();
      }

      header.events.change = function(currentField) {
        currentField.data.loading = true;
        field.data.loading = true;
        currentField.history.save();
        // header.trigger("update"); //
        field.data.query().then(function() {
          currentField.data.loading = false;
          field.data.loading = false;
          container.render();
        });
      }

      field.data.createRow = function(value) {
        let row = body.get(value.id) || body.createChild({
          key: value.id
        });
        let trashField = rowField.get("trash") || rowField.createChild({
          key: "trash"
        });
        field.resource.columns.forEach(function(column) {
          let cell = row.get(column.field.key) || row.createChild(column.field);
          if (item[column.field.key] === undefined) {
            cell.queryValue();
          } else {
            cell.setValue(item[column.field.key], "set");
          }
        });
      }

      field.data.query = function() {
        return KarmaFields.Transfer.query(field.resource.driver, header.getValue()).then(function(results) {
          // footer.get("count").setValue(results.length, "set");
          footer.get("ids").setValue(results.map(function(id) {
            return item.id;
          }).join(","), "set");

          // body.setValue(results, "query");



          results.forEach(function(item) {
            field.data.createRow(item);
            // let row = body.get(item.id) || body.createChild({
            //   key: item.id
            // });
            // let trashField = rowField.get("trash") || rowField.createChild({
            //   key: "trash"
            // });
            // field.resource.columns.forEach(function(column) {
            //   let cell = row.get(column.field.key) || row.createChild(column.field);
            //   if (item[column.field.key] === undefined) {
            //     cell.queryValue();
            //   } else {
            //     cell.setValue(item[column.field.key], "set");
            //   }
            // });
  				});
          return results;
        });
      };

      field.data.sync = function() {
        let value = body.getModifiedValue();
        return KarmaFields.Transfer.update(field.driver, value).then(function(value) {
          body.setValue(value, "set");
          return field.data.query();
        });
      };

      field.data.add = function() {
        // let uid = "_draft_"+Date.now();
        // let row = field.data.createRow({
        //   key: uid;
        // });
        // let idsField = footer.get("ids");
        // let ids = idsField.value.split(",");
        //
        // idsField.value = [uid].concat(ids).join(",");

        KarmaFields.Transfer.add(field.driver, header.getValue()).then(function(value) {
          field.data.createRow(value);
          let ids = footer.get("ids");
          ids.setValue([value.id].concat(ids.value.split(",")).join(","), "set");

          // row.key = value.id;
          // row.setValue(value);
          // idsField.setValue(idsField.value.replace(uid, value.id), "set");

          return value;
        });
      }




      field.data.loading = true;
      field.data.query().then(function() {
        field.data.loading = false;
        container.render();
      });
    },
    update: function(container) {
      this.children = [
        KarmaFields.fields.tableHeader(field.get("header")),
        KarmaFields.fields.tableBody(field.get("body")),
        KarmaFields.fields.tableFooter(field.get("footer"))
      ];
    }
  };
}







KarmaFields.fields.tableHeader = function(field) {
  return {
    class: "table-header",
    clear: true,
    init: function(header) {
      field.events.update = function() {
        header.render();
      }
    },
    update: function() {
      this.child = KarmaFields.fields["group"](field)
    }
  }
}






KarmaFields.fields.tableBody = function(field) {
  return {
    class: "table-body",
    child: {
      class: "table grid",
      clear: true,
      init: function(table) {
        field.data.select = KarmaFields.selectors.grid();
        field.data.select.onSelect = function() {
          field.parent.get("footer").trigger("update");
        }
        field.events.render = function() {
          table.render();
        }
      },
      update: function(table) {

        let order = field.parent.get("header/order");
        let orderby = field.parent.get("header/orderby");
        let page = field.parent.get("header/page");
        let ppp = field.parent.get("header/ppp");

        field.data.select.init();

        this.element.style.gridTemplateColumns = field.parent.resource.columns.map(function(column, colIndex) {
          return column.width || "1fr";
        }).join(" ");

        this.children = [];

        field.parent.resource.columns.map(function(column, colIndex) {
          if (column.type === "index") {
            return {
              class: "th table-header-index",
              init: function() {
                this.element.textContent = column.title || "#";
                this.element.addEventListener("mousedown", function(event) {
                  field.data.select.onIndexHeaderMouseDown();
                });
                this.element.addEventListener("mousemove", function(event) {
                  field.data.select.onIndexHeaderMouseMove();
                });
                this.element.addEventListener("mouseup", function(event) {
                  field.data.select.onIndexHeaderMouseUp();
                  event.stopPropagation();
                });
              }
            }
          } else {
            return {
              class: "th",
              init: function() {
                if (column.main) {
                  this.element.classList.add("main");
                }
                // if (column.width) {
                //   this.element.style.width = column.width;
                // }
                this.element.addEventListener("mousedown", function(event) {
                  field.data.select.onHeaderMouseDown(colIndex);
                });
                this.element.addEventListener("mousemove", function(event) {
                  field.data.select.onHeaderMouseMove(colIndex);
                });
                this.element.addEventListener("mouseup", function(event) {
                  field.data.select.onHeaderMouseUp(colIndex);
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

                      if (!order.value && orderby.value === column.field.key) {
                        order.value = column.order || "asc";
                      }

                      this.element.addEventListener("click", function() {
                        container.element.classList.add("loading");

                  			if (orderby.value === column.field.key) {
                          order.setValue(order === "asc" ? "desc" : "asc", "change");
                  			} else {
                          order.setValue(column.order || "asc", "change");
                          orderby.setValue(column.field.key, "change");
                  			}

                        page.setValue(1, "change");

                  			return field.parent.data.query().then(function() { // ! should use field.resource.children[colIndex]
                          container.element.classList.remove("loading");
                          field.trigger("update");
                        });
                      });
                    },
                    update: function() {
                      let order = field.parent.get("header/order");
                      let orderby = field.parent.get("header/orderby");
                      this.element.classList.toggle("asc", orderby.value === column.key && order.value === "asc");
                      this.element.classList.toggle("desc", orderby.value === column.key && order.value === "desc");
                    }
                  });
                }
              }
            };
          }
        });

        // field.parent.get("footer/drafts").split(",").forEach(function(uid, rowIndex) {
        //   let rowField = field.get(uid) || field.createChild({
        //     key: uid
        //   });
        //   field.parent.resource.columns.forEach(function(column, colIndex) {
        //     if (column.type === "index") {
        //       table.children.push({
        //         class: "th table-row-index",
        //         init: function() {
        //           this.element.addEventListener("mousedown", function(event) {
        //             field.data.select.onIndexCellMouseDown(rowIndex);
        //           });
        //           this.element.addEventListener("mousemove", function() {
        //             field.data.select.onIndexCellMouseMove(rowIndex);
        //           });
        //           this.element.addEventListener("mouseup", function(event) {
        //             field.data.select.onIndexCellMouseUp(rowIndex);
        //             event.stopPropagation();
        //           });
        //         },
        //         update: function() {
        //           this.element.textContent = ((page.value-1)*ppp.value)+rowIndex+1;
        //         }
        //       });
        //     } else {
        //       let cellField = rowField.get(column.field.key) || rowField.createChild(column.field);
        //       table.children.push({
        //         class: "td",
        //         init: function(cell) {
        //           this.element.addEventListener("mousedown", function(event) {
        //             field.data.select.onCellMouseDown(colIndex, rowIndex);
        //           });
        //           this.element.addEventListener("mousemove", function() {
        //             field.data.select.onCellMouseMove(colIndex, rowIndex);
        //           });
        //           this.element.addEventListener("mouseup", function(event) {
        //             field.data.select.onCellMouseUp(colIndex, rowIndex);
        //             event.stopPropagation();
        //           });
        //           if (column.style) {
        //             this.element.style = column.style;
        //           }
        //           cellField.events.update = function() {
        //             cell.element.classList.toggle("loading", cellField.loading);
        //             cell.element.classList.toggle("modified", cellField.value === cellField.originalValue);
        //           };
        //           cellField.events.render = function() {
        //             cell.render();
        //           };
        //         },
        //         update: function(cell) {
        //           this.child = KarmaFields.fields[column.field.type || "group"](cellField);
        //           field.data.select.addField(colIndex, rowIndex, this.element, cellField);
        //         }
        //       });
        //     }
        //   });
        // });


        field.parent.get("footer/ids").split(",").forEach(function(id, rowIndex) {
          let rowField = field.get(id) || field.createChild({
            key: id
          });
          let trashField = rowField.get("trash") || rowField.createChild({
            key: "trash"
          });

          field.parent.resource.columns.forEach(function(column, colIndex) {
            if (column.type === "index") {
              table.children.push({
                class: "th table-row-index",
                init: function() {
                  this.element.addEventListener("mousedown", function(event) {
                    field.data.select.onIndexCellMouseDown(rowIndex);
                  });
                  this.element.addEventListener("mousemove", function() {
                    field.data.select.onIndexCellMouseMove(rowIndex);
                  });
                  this.element.addEventListener("mouseup", function(event) {
                    field.data.select.onIndexCellMouseUp(rowIndex);
                    event.stopPropagation();
                  });
                },
                update: function() {
                  this.element.textContent = ((page.value-1)*ppp.value)+rowIndex+1;
                }
              });
            } else {
              let cellField = rowField.get(column.field.key) || rowField.createChild(column.field);
              table.children.push({
                class: "td",
                init: function(cell) {
                  this.element.addEventListener("mousedown", function(event) {
                    field.data.select.onCellMouseDown(colIndex, rowIndex);
                  });
                  this.element.addEventListener("mousemove", function() {
                    field.data.select.onCellMouseMove(colIndex, rowIndex);
                  });
                  this.element.addEventListener("mouseup", function(event) {
                    field.data.select.onCellMouseUp(colIndex, rowIndex);
                    event.stopPropagation();
                  });
                  if (column.style) {
                    this.element.style = column.style;
                  }
                  cellField.events.update = function() {
                    cell.element.classList.toggle("loading", cellField.loading);
                    cell.element.classList.toggle("modified", cellField.value === cellField.originalValue);
                  };
                  cellField.events.render = function() {
                    cell.render();
                  };
                },
                update: function(cell) {
                  this.child = KarmaFields.fields[column.field.type || "group"](cellField);
                  field.data.select.addField(colIndex, rowIndex, this.element, cellField);
                }
              });
            }
          });
        });
      }
    }
  }
}






KarmaFields.fields.tableFooter = function(field) {
  return {
    class: "table-footer",
    update: function(footer) {
      field.events.update = function() {
        footer.render();
      };
      this.children = [
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
                      // var loading = field.history.read("static", ["loading"]);
                      // this.element.classList.toggle("loading", loading);
                    },
                    child: KarmaFields.includes.icon({
                      file: KarmaFields.icons_url+"/update.svg"
                    })
                  }],
                  init: function(item) {
                    this.element.title = "Reload";
                    this.element.addEventListener("click", function(event) {
                      item.element.classList.add("loading");
                      field.parent.data.query().then(function() {
                        item.element.classList.remove("loading");
                        field.parent.trigger("update");
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
                  init: function(button) {
                    this.element.title = "Save";
                    this.element.textContent = "Save";
                    this.element.addEventListener("click", function(event) {
                      button.element.classList.add("loading");

                      field.parent.data.sync().then(function() {
                        button.element.classList.remove("loading");
                        button.element.blur();
                        field.parent.trigger("render");
                      });

                      // let value = field.get("body").getModifiedValue();
                      // let driver = field.getRoot().driver;
                			// return KarmaFields.Transfer.update(driver, value).then(function(value) {
                      //   field.parent.get("body").setValue(value, "set");
                      //   return field.parent.data.query();
                      // }).then(function() {
                      //   item.element.classList.remove("loading");
                      //   item.element.blur();
                      //   field.parent.trigger("render");
                      // });
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function() {
                    this.element.disabled = !field.get("body").getModifiedValue();
                  }
                },
                // {
                //   tag: "button",
                //   class: "button footer-item",
                //   child: KarmaFields.includes.icon({
                //     file: KarmaFields.icons_url+"/admin-generic.svg"
                //   }),
                //   init: function(button) {
                //     this.element.title = "Options";
                //     this.element.addEventListener("click", function(event) {
                //       var displayOptions = field.history.read("static", ["displayOptions"]);
                //       field.history.write("static", ["displayOptions"], !displayOptions);
                //       footer.render();
                //       if (displayOptions) {
                //         button.element.blur();
                //       }
                //     });
                //     this.element.addEventListener("mouseup", function(event) {
                //       event.stopPropagation();
                //     });
                //   },
                //   update: function() {
                //     var displayOptions = field.history.read("static", ["displayOptions"]);
                //     this.element.classList.toggle("active", displayOptions || false);
                //   }
                // },
                {
                  tag: "button",
                  class: "button footer-item",
                  child: KarmaFields.includes.icon({
                    file: KarmaFields.icons_url+"/undo.svg"
                  }),
                  init: function(item) {
                    this.element.title = "Undo";
                    this.element.addEventListener("click", function(event) {
                      KarmaFields.History.undo(field.parent);
                      field.parent.trigger("render");
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function() {
                    this.element.disabled = KarmaFields.History.getIndex(field).index > 0;
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
                      KarmaFields.History.redo(field.parent);
                      field.parent.trigger("render");
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(button) {
                    let instance = KarmaFields.History.getInstance(field);
                    this.element.disabled = instance.index === instance.max;
                  }
                },
                {
                  tag: "button",
                  class: "button footer-item",
                  child: KarmaFields.includes.icon({
                    file: KarmaFields.icons_url+"/plus-alt2.svg"
                  }),
                  init: function(button) {
                    this.element.title = "Add";
                    // this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/plus-alt2.svg");
                    this.element.addEventListener("click", function(event) {
                      button.element.classList.add("loading");
                      // tableManager.addItem().then(function() {
                      field.parent.data.add().then(function() {
                        button.element.classList.remove("loading");
                        container.render();
                      });
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element) {
                    this.element.disabled = field.parent.resource.disable_add;
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
                      let fields = field.parent.get("body").data.select.getSelectedRows().map(function(cell) {
                        return cell.field;
                      });
                      if (fields) {
                        let idsField = field.get("ids");
                        idsField.setValue(idsField.value.split(",").filter(function(id) {
                          return !fields.some(function(field) {
                            field.resource.key == id;
                          });
                        }).join(","), "change");
                        field.parent.trigger("render", true);
                      }
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element) {
                    this.element.disabled = field.parent.resource.disable_delete || field.parent.get("body").data.select.getSelectedRows().length === 0;
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
                      let num = field.get("ids").value.split(",").length;
                      this.element.textContent = num ? num + " items" : "";
                    }
                  },
                  {
                    tag: "button",
                    class: "button footer-item",
                    init: function(button) {
                      this.element.innerText = "«";
                      this.element.addEventListener("click", function() {
                        let page = field.parent.get("header/page");
                        page.setValue(1, "change");
                        button.element.classList.add("loading");
                        field.parent.data.query().then(function() {
                          button.element.classList.remove("loading");
                          field.parent.trigger("render");
                        });
                      });
                    },
                    update: function() {
                      let num = field.get("ids").value.split(",").length;
                      let page = field.parent.get("header/page").value;
                      let ppp = field.parent.get("header/ppp").value;
                      this.element.style.display = num > ppp ? "block" : "none";
                      this.element.disabled = (page == 1);
                    }
                  },
                  {
                    tag: "button",
                    class: "button footer-item",
                    init: function(button) {
                      this.element.innerText = "‹";
                      this.element.addEventListener("click", function() {
                        let page = field.parent.get("header/page");
                        page.setValue(Math.max(page.value-1, 1), "change");
                        button.element.classList.add("loading");
                        field.parent.data.query().then(function() {
                          button.element.classList.remove("loading");
                          field.parent.trigger("render");
                        });
                      });
                    },
                    update: function() {
                      let num = field.get("ids").value.split(",").length;
                      let page = field.parent.get("header/page").value;
                      let ppp = field.parent.get("header/ppp").value;
                      this.element.style.display = num > ppp ? "block" : "none";
                      this.element.disabled = (page === 1);
                    }
                  },
                  {
                    class: "current-page footer-item",
                    update: function() {
                      let num = field.get("ids").value.split(",").length;
                      let page = field.parent.get("header/page").value;
                      let ppp = field.parent.get("header/ppp").value;
                      this.element.style.display = num > ppp ? "block" : "none";
                      this.element.textContent = num && page+" / "+Math.ceil(num/ppp) || "";
                    }
                  },
                  {
                    tag: "button",
                    class: "button footer-item",
                    init: function(button) {
                      this.element.innerText = "›";
                      this.element.addEventListener("click", function() {
                        let page = field.parent.get("header/page");
                        page.setValue(page.value+1, "change"); // -> should check max!
                        button.element.classList.add("loading");
                        field.parent.data.query().then(function() {
                          button.element.classList.remove("loading");
                          field.parent.trigger("render");
                        });
                      });
                    },
                    update: function() {
                      let num = field.get("ids").value.split(",").length;
                      let page = field.parent.get("header/page").value;
                      let ppp = field.parent.get("header/ppp").value;
                      this.element.style.display = num > ppp ? "block" : "none";
                      this.element.disabled = page >= Math.ceil(num/ppp);
                    }
                  },
                  {
                    tag: "button",
                    class: "button footer-item",
                    init: function(button) {
                      this.element.innerText = "»";
                      this.element.addEventListener("click", function() {
                        let page = field.parent.get("header/page");
                        let num = field.get("ids").value.split(",").length;
                        let ppp = field.parent.get("header/ppp").value;
                        page.setValue(Math.ceil(num/ppp), "change");
                        button.element.classList.add("loading");
                        field.parent.data.query().then(function() {
                          button.element.classList.remove("loading");
                          field.parent.trigger("render");
                        });
                      });
                    },
                    update: function() {
                      let num = field.get("ids").value.split(",").length;
                      let page = field.parent.get("header/page").value;
                      let ppp = field.parent.get("header/ppp").value;
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
  };
}

//
//
// KarmaFields.fields.table = function(field) {
//
//   // var selectManager = KarmaFields.selectors.grid();
//
//
//   // tableManager.request();
//
//
//
//   return {
//     class: "karma-field-table",
//     init: function(container) {
//
//       field.data.select = KarmaFields.selectors.grid();
//
//       //
//       // KarmaFields.events.onSelectAll = function(event) {
//       //   if (document.activeElement === document.body) {
//       //     field.data.select.onSelectAll(event);
//       //     event.preventDefault();
//       //   }
//       // };
//       // KarmaFields.events.onAdd = function(event) {
//       //   if (document.activeElement === document.body) {
//       //     tableManager.addItem();
//       //     event.preventDefault();
//       //   }
//       // };
//       // KarmaFields.events.onDelete = function(event) {
//       //   var items = field.data.select.getSelectedItems();
//       //   if (items.length) {
//       //     field.data.select.removeItems(items);
//       //     event.preventDefault();
//       //   }
//       // };
//       // KarmaFields.events.onCopy = function(event) {
//       //   field.data.select.onCopy(event);
//       // }
//       // KarmaFields.events.onPast = function(event) {
//       //   field.data.select.onPast(event);
//       //   container.render();
//       // }
//       // KarmaFields.events.onSave = function(event) {
//       //   tableManager.sync();
//       //   event.preventDefault();
//       // }
//       // KarmaFields.events.onUndo = function(event) {
//       //   field.history.undo();
//       //   container.render();
//       //   event.preventDefault();
//       // }
//       // KarmaFields.events.onRedo = function(event) {
//       //   field.history.redo();
//       //   container.render();
//       //   event.preventDefault();
//       // }
//       // KarmaFields.events.onUnload = function() {
//       //   // manager.save();
//       //   // manager.stopRefresh();
//       // }
//
//     },
//     update: function(container) {
//
//       let tableManager = KarmaFields.managers.table(field, field.history, field.resource);
//       let selectManager = field.data.select;
//
//       // field.events.render = function() {
//       //   container.render();
//       // };
//
//       // this.addEventListener("mouseup", function() {
//       //   // handle outside mouseup
//       //   selectManager.onClick();
//       // });
//
//       container.element.classList.add("loading");
//       tableManager.request().then(function() {
//         container.element.classList.remove("loading");
//         container.render();
//       });
//
//       // var params = {};
// 			// params.page = history.read("page", [], 1);
// 			// params.options = history.read("options", [], {});
// 			// params.filters = history.read("filters", [], {});
// 			// params.order = history.read("order", [], {});
//       //
// 			// history.write("static", ["loading"], 1);
//
// 			// field.trigger("load");
//
//
// 			return field.query(field.findByKey("header").getValue()).then(function(results) {
// 				var items = history.request(["table", "items"]);
// 				var count = history.request(["table", "count"]);
// 				results.items.forEach(function(item) {
// 					history.write("input", [resource.driver, item.uri], item);
// 				});
// 				history.write("static", ["loading"], 0);
// 				history.save(["table", "items"], results.items.map(function(item) {
// 					return item.uri;
// 				}), "nav", items);
// 				history.save(["table", "count"], parseInt(results.count), "nav", count);
//
//
// 				// field.trigger("render");
//         return results;
//       });
//
//       this.children = [
//         {
//           class: "table-header",
//           clear: true,
//           init: function(filter) {
//             let filterResource = field.getAttribute("filter");
//             if (filterResource) {
//               var filterField = field.createChild();
//               filterField.resource = filterResource;
//               filterField.buffer = "filters";
//               filterField.outputBuffer = false;
//               filterField.events.submit = function() {
//
//                 tableManager.setPage(1);
//                 container.element.classList.add("loading");
//                 return tableManager.request().then(function() {
//                   container.element.classList.remove("loading");
//                   container.render();
//                 });
//               }
//               filterField.events.update = function() {
//                 field.trigger("updateFooter");
//               };
//               filterField.events.render = this.render;
//               this.element._field = filterField;
//             }
//           },
//           update: function(filter) {
//             if (this.element._field) {
//               this.children = this.element._field.build();
//             }
//           }
//         },
//         {
//           class: "table-body",
//           clear: true,
//           children: [{
//             class: "table grid",
//             init: function() {
//               if (field.resource.width) {
//                 this.style.width = field.resource.width;
//               }
//               if (field.resource.style) {
//                 this.style = field.resource.style;
//               }
//             },
//             update: function(table) {
//
//               selectManager.init();
//
//               let templateColumns = [];
//               if (field.resource.index) {
//                 templateColumns.push(field.resource.index.width || "40px")
//               }
//               field.resource.children.filter(function(column) {
//                 return true;
//               }).forEach(function(column, colIndex) {
//                 templateColumns.push(column.width || "1fr");
//               });
//               this.element.style.gridTemplateColumns = templateColumns.join(" ");
//
//
//               this.children = [];
//
//               if (field.resource.index) {
//                 this.children.push({
//                   class: "th table-header-index",
//                   init: function() {
//                     if (field.resource.index.title) {
//                       this.element.textContent = field.resource.index.title;
//                     }
//                     this.element.addEventListener("mousedown", function(event) {
//                       selectManager.onIndexHeaderMouseDown();
//                     });
//                     this.element.addEventListener("mousemove", function(event) {
//                       selectManager.onIndexHeaderMouseMove();
//                     });
//                     this.element.addEventListener("mouseup", function(event) {
//                       selectManager.onIndexHeaderMouseUp();
//                       event.stopPropagation();
//                     });
//                   }
//                 });
//               }
//
//               field.resource.children.filter(function(column) {
//                 return true;
//               }).forEach(function(column, colIndex) {
//                 table.children.push({
//                   class: "th",
//                   init: function() {
//                     if (column.main) {
//                       this.element.classList.add("main");
//                     }
//                     if (column.width) {
//                       this.element.style.width = column.width;
//                     }
//                     this.element.addEventListener("mousedown", function(event) {
//                       selectManager.onHeaderMouseDown(colIndex);
//                     });
//                     this.element.addEventListener("mousemove", function(event) {
//                       selectManager.onHeaderMouseMove(colIndex);
//                     });
//                     this.element.addEventListener("mouseup", function(event) {
//                       selectManager.onHeaderMouseUp(colIndex);
//                       event.stopPropagation();
//                     });
//                   },
//                   update: function(th) {
//                     this.children = [
//                       {
//                         tag: "a",
//                         class: "header-cell-title",
//                         init: function() {
//                           this.element.textContent = column.title;
//                         }
//                       }
//                     ];
//                     if (column.sortable) {
//                       this.children.push({
//                         tag: "a",
//                         class: "header-cell-order",
//                         children: [{
//                           class: "order-icon change-order",
//                         }],
//                         init: function() {
//                           this.element.addEventListener("click", function() {
//                             container.element.classList.add("loading");
//                             tableManager.reorder(column).then(function() { // ! should use field.resource.children[colIndex]
//                               container.element.classList.remove("loading");
//                               container.render();
//                             });
//                           });
//                         },
//                         update: function() {
//                           var orderby = field.history.request(["order", "orderby"]);
//                           var order = field.history.request(["order", "order"]);
//                           this.element.classList.toggle("asc", orderby === column.key && order === "asc");
//                           this.element.classList.toggle("desc", orderby === column.key && order === "desc");
//                         }
//                       });
//                     }
//                   }
//                 });
//               });
//
//               let uris = tableManager.getItems();
//
//               uris && uris.forEach(function(uri, rowIndex) {
//
//                 if (field.resource.index) {
//                   table.children.push({
//                     class: "th table-row-index",
//                     init: function() {
//                       this.element.addEventListener("mousedown", function(event) {
//                         selectManager.onIndexCellMouseDown(rowIndex);
//                       });
//                       this.element.addEventListener("mousemove", function() {
//                         selectManager.onIndexCellMouseMove(rowIndex);
//                       });
//                       this.element.addEventListener("mouseup", function(event) {
//                         selectManager.onIndexCellMouseUp(rowIndex);
//                         event.stopPropagation();
//                       });
//                     },
//                     update: function() {
//                       var page = tableManager.getPage();
//                       var ppp = tableManager.getPpp();
//                       this.element.textContent = ((page-1)*ppp)+rowIndex+1;
//                     }
//                   });
//                 }
//
//                 field.resource.children.forEach(function(column, colIndex) {
//                   table.children.push({
//                     class: "td",
//                     reflow: function(element) {
//                       return !element._field
//                         || element._field.uri !== uri
//                         || (element._field.resource.name || element._field.resource.field) !== (column.name || column.field);
//                     },
//                     init: function(cell) {
//                       this.element.addEventListener("mousedown", function(event) {
//                         selectManager.onCellMouseDown(colIndex, rowIndex);
//                       });
//                       this.element.addEventListener("mousemove", function() {
//                         selectManager.onCellMouseMove(colIndex, rowIndex);
//                       });
//                       this.element.addEventListener("mouseup", function(event) {
//                         selectManager.onCellMouseUp(colIndex, rowIndex);
//                         event.stopPropagation();
//                       });
//                       if (column.container_style) {
//                         this.element.style = column.container_style;
//                       }
//
//                       let child = field.createChild();
//                       child.uri = uri;
//                       child.resource = column;
//                       child.element = this.element;
//                       child.events.update = function() {
//                         field.trigger("updateFooter");
//                       };
//                       child.events.modify = function() {
//                         cell.element.classList.toggle("modified", child.isModified());
//                       }
//                       child.events.render = function() {
//                         cell.render();
//                       }
//                       this.element._field = child;
//                     },
//                     update: function(cell) {
//                       this.child = KarmaFields.fields[column.name || column.field || "group"](this.element._field);
//                       selectManager.addField(colIndex, rowIndex, this.element, this.element._field);
//                       // this.element.classList.toggle("modified", this.element._field.isModified());
//                     }
//                   });
//                 });
//               });
//             }
//           }]
//         },
//         {
//           class: "table-footer",
//           update: function(footer) {
//             field.events.updateFooter = function() {
//               footer.render();
//             };
//             selectManager.onSelect = function() {
//               footer.render();
//             }
//             this.children = [
//               {
//                 class: "table-options-container",
//                 update: function(element) {
//                   var displayOptions = tableManager.history.read("static", ["displayOptions"]);
//                   this.child = displayOptions && {
//                     class: "table-options-body",
//                     init: function() {
//                       var optionField = field.createChild(field.resource.options);
//                       optionField.buffer = "options";
//                       optionField.outputBuffer = false;
//                       optionField.driver = false;
//                       optionField.events.submit = function() {
//                         field.history.setValue(["static", "displayOptions"], false);
//                         container.element.classList.add("loading");
//                         tableManager.request().then(function() {
//                           container.element.classList.remove("loading");
//                           container.render();
//                         });
//                       };
//                       this.element._field = optionField;
//                     },
//                     update: function() {
//                       if (field.resource.options) {
//                         this.children = this.element._field.build();
//                       }
//                     }
//                   };
//                 }
//               },
//               {
//                 class: "footer-bar",
//                 children: [
//                   {
//                     class: "footer-group table-info",
//                     children: [
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         children: [{
//                           class: "table-spinner",
//                           update: function(icon) {
//                             var loading = field.history.read("static", ["loading"]);
//                             this.element.classList.toggle("loading", loading);
//                           },
//                           child: KarmaFields.includes.icon({
//                             file: KarmaFields.icons_url+"/update.svg"
//                           })
//                         }],
//                         init: function(item) {
//                           this.element.title = "Reload";
//
//                           // field.events["load"] = function() {
//                           //   field.history.setValue(["static", "loading"], true);
//                           //   item.render();
//                           // }
//
//                           this.element.addEventListener("click", function(event) {
//                             container.element.classList.add("loading");
//                             tableManager.request().then(function() {
//                               container.element.classList.remove("loading");
//                               container.render();
//                               item.element.blur();
//                             });
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item primary",
//                         init: function() {
//                           this.element.title = "Save";
//                           this.element.textContent = "Save";
//                           this.element.addEventListener("click", function(event) {
//                             container.element.classList.add("loading");
//                             tableManager.sync().then(function() {
//                               return tableManager.request();
//                             }).then(function() {
//                               container.element.classList.remove("loading");
//                               container.render();
//                             });
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function() {
//                           this.element.disabled = field.history.contain(["input"], ["output"]);
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         child: KarmaFields.includes.icon({
//                           file: KarmaFields.icons_url+"/admin-generic.svg"
//                         }),
//                         init: function(button) {
//                           this.element.title = "Options";
//                           this.element.addEventListener("click", function(event) {
//                             var displayOptions = field.history.read("static", ["displayOptions"]);
//                             field.history.write("static", ["displayOptions"], !displayOptions);
//                             footer.render();
//                             if (displayOptions) {
//                               button.element.blur();
//                             }
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function() {
//                           var displayOptions = field.history.read("static", ["displayOptions"]);
//                           this.element.classList.toggle("active", displayOptions || false);
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         child: KarmaFields.includes.icon({
//                           file: KarmaFields.icons_url+"/undo.svg"
//                         }),
//                         init: function(item) {
//                           this.element.title = "Undo";
//                           // this.
//                           this.element.addEventListener("click", function(event) {
//                             field.history.undo();
//                             container.render();
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function() {
//                           this.element.disabled = !field.history.hasUndo();
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         child: KarmaFields.includes.icon({
//                           file: KarmaFields.icons_url+"/redo.svg"
//                         }),
//                         init: function(button) {
//                           this.element.title = "Redo";
//                           this.element.addEventListener("click", function(event) {
//                             field.history.redo();
//                             container.render();
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function(button) {
//                           this.element.disabled = !field.history.hasRedo();
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         child: KarmaFields.includes.icon({
//                           file: KarmaFields.icons_url+"/plus-alt2.svg"
//                         }),
//                         init: function(item) {
//                           this.element.title = "Add";
//                           // this.child = KarmaFields.includes.icon(KarmaFields.icons_url+"/plus-alt2.svg");
//                           this.element.addEventListener("click", function(event) {
//                             container.element.classList.add("loading");
//                             tableManager.addItem().then(function() {
//                               container.element.classList.remove("loading");
//                               container.render();
//                             });
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function(element) {
//                           this.element.disabled = field.getAttribute("disable_create");
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         child: KarmaFields.includes.icon({
//                           file: KarmaFields.icons_url+"/trash.svg"
//                         }),
//                         init: function(item) {
//                           this.element.title = "Delete";
//                           this.element.addEventListener("click", function(event) {
//                             var uris = selectManager.getSelectedRows().map(function(cell) {
//                               return cell.field.uri;
//                             });
//                             if (uris) {
//                               tableManager.removeItems(uris);
//                               container.render();
//                             }
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function(element) {
//                           var selectedRows = selectManager.getSelectedRows();
//                           this.element.disabled = selectedRows.length === 0 || field.getAttribute("disable_delete");
//                         }
//                       }
//                     ]
//                   },
//                   {
//                     class: "footer-group table-pagination",
//                     update: function() {
//                       this.children = [
//                         {
//                           tag: "p",
//                           class: "footer-item",
//                           update: function() {
//                             var num = tableManager.getCount();
//                             this.element.textContent = num ? num+" items" : "";
//                           }
//                         },
//                         {
//                           tag: "button",
//                           class: "button footer-item",
//                           init: function() {
//                             this.element.innerText = "«";
//                             this.element.addEventListener("click", function() {
//                               tableManager.setPage(1);
//                               container.element.classList.add("loading");
//                               tableManager.request().then(function() {
//                                 container.element.classList.remove("loading");
//                                 container.render();
//                               });
//                             });
//                           },
//                           update: function() {
//                             var num = tableManager.getCount();
//                             var ppp = tableManager.getPpp();
//                             var page = tableManager.getPage();
//                             this.element.style.display = num > ppp ? "block" : "none";
//                             this.element.disabled = (page === 1);
//                           }
//                         },
//                         {
//                           tag: "button",
//                           class: "button footer-item",
//                           init: function() {
//                             var page = tableManager.getPage();
//                             this.element.innerText = "‹";
//                             this.element.addEventListener("click", function() {
//                               tableManager.setPage(tableManager.getPage()-1);
//                               container.element.classList.add("loading");
//                               tableManager.request().then(function() {
//                                 container.element.classList.remove("loading");
//                                 container.render();
//                               });
//                             });
//                           },
//                           update: function() {
//                             var num = tableManager.getCount();
//                             var ppp = tableManager.getPpp();
//                             var page = tableManager.getPage();
//                             this.element.style.display = num > ppp ? "block" : "none";
//                             this.element.disabled = (page === 1);
//                           }
//                         },
//                         {
//                           class: "current-page footer-item",
//                           update: function() {
//                             var num = tableManager.getCount();
//                             var ppp = tableManager.getPpp();
//                             var page = tableManager.getPage();
//                             this.element.style.display = num > ppp ? "block" : "none";
//                             this.element.textContent = num && page+" / "+Math.ceil(num/ppp) || "";
//                           }
//                         },
//                         {
//                           tag: "button",
//                           class: "button footer-item",
//                           init: function() {
//                             this.element.innerText = "›";
//                             this.element.addEventListener("click", function() {
//                               tableManager.setPage(tableManager.getPage()+1);
//                               container.element.classList.add("loading");
//                               tableManager.request().then(function() {
//                                 container.element.classList.remove("loading");
//                                 container.render();
//                               });
//                             });
//                           },
//                           update: function() {
//                             var num = tableManager.getCount();
//                             var ppp = tableManager.getPpp();
//                             var page = tableManager.getPage();
//                             this.element.style.display = num > ppp ? "block" : "none";
//                             this.element.disabled = page >= Math.ceil(num/ppp);
//                           }
//                         },
//                         {
//                           tag: "button",
//                           class: "button footer-item",
//                           init: function(element) {
//                             this.element.innerText = "»";
//                             this.element.addEventListener("click", function() {
//                               var num = tableManager.getCount();
//                               var ppp = tableManager.getPpp();
//                               tableManager.setPage(Math.ceil(num/ppp));
//                               container.element.classList.add("loading");
//                               tableManager.request().then(function() {
//                                 container.element.classList.remove("loading");
//                                 container.render();
//                               });
//                             });
//                           },
//                           update: function() {
//                             var num = tableManager.getCount();
//                             var ppp = tableManager.getPpp();
//                             var page = tableManager.getPage();
//                             this.element.style.display = num > ppp ? "block" : "none";
//                             this.element.disabled = page >= Math.ceil(num/ppp);
//                           }
//                         }
//                       ];
//                     }
//                   }
//                 ]
//               }
//             ];
//           }
//         }
//       ];
//     }
//   };
// }
