KarmaFields.tables.grid = function(manager) {
  return KarmaFields.build({
    class: "karma-field-table karma-fields",
    init: function(element, update) {

      element.addEventListener("mouseup", function() {
        // console.log("grid mouseup");
        // handle outside mouseup
        if (manager.select && manager.select.onClick) {
          manager.select.onClick();
        }
      });
      update();
    },
    children: function() {
      return [
        //KarmaFields.tables.header(manager),
        KarmaFields.build({
          class: "table-header",
          init: function(element, render) {
            manager.renderHeader = render;
            render();
          },
          child: function() {
            return manager.buildFilter();
          }
        }),
        KarmaFields.build({
          class: "table-body",
          child: function() {
            return KarmaFields.build({
              tag: "table",
              class: "grid",
              init: function(table, update) {
                manager.render = update;
                manager.request();

                // setTimeout(function() {
                //   manager.request();
                // }, 1000);

                // .then(function() {
                //   manager.history.save();
                // });
              },
              children: function() {
                manager.select.init(); // = KarmaFields.selectors.grid(manager);
                manager.fields = [];
                // manager.select.onSelect = manager.renderControls;
                return [
                  KarmaFields.build({
                    tag: "thead",
                    child: function() {
                      return KarmaFields.build({
                        tag: "tr",
                        children: function() {
                          return manager.resource.columns.filter(function(column) {
                            return true;
                            // return manager.options.gridoptions.columns[column.key];
                          }).map(function(column, colIndex) {
                            var headerCell = KarmaFields.tables.headerCell(manager, column);

                            if (column.field === "index") {
                              manager.select.addIndexHeader(headerCell, colIndex);
                            } else {
                              manager.select.addCol(headerCell, colIndex);
                            }


                            if (column.width) {
                              headerCell.style.width = column.width;
                            }
                            return headerCell;
                          });
                        }
                      })
                    }
                  }),
                  KarmaFields.build({
                    tag: "tbody",
                    // hash: manager.getItems().map(function(post) {
                    //   return post.uri || post.pseudo_uri;
                    // }).join(" "),

                    // init: function(element, update) {
                    //   manager.onAddRow = function(post, rowIndex) {
                    //     var row = KarmaFields.tables.gridRow(manager, post, rowIndex);
                    //     if (rowIndex >= element.children.length) {
                    //       element.appendChild(row);
                    //     } else {
                    //       element.insertBefore(row, element.children[rowIndex]);
                    //     }
                    //   };
                    //   manager.onRemoveRow = function(post) {
                    //     var rowIndex = manager.getItems().indexOf(post);
                    //     element.removeChild(element.children[rowIndex]);
                    //     manager.select.removeRow(rowIndex);
                    //   }
                    //   update();
                    // },
                    children: function() {
                      return manager.getItems().map(function(post, rowIndex) {
                        manager.select.addRow(post, rowIndex);

                        // var rowManager = KarmaFields.managers.row(post, table);
                        // manager.rows.push(rowManager);

                        // manager.addRow(post, rowIndex);

                        return KarmaFields.build({
                          tag: "tr",
                          // hash: post.uri || post.pseudo_uri,

                          children: function() {
                            return manager.resource.columns.filter(function(column) {
                              return true;
                              // return manager.options.gridoptions.columns[column.key];
                            }).map(function(column, colIndex) {

                              var fieldManager = KarmaFields.managers.field(column, post, manager.resource.middleware, manager.history, null);

                              fieldManager.rowIndex = (((manager.options.page || 1)-1)*manager.options.ppp || 0)+rowIndex;

                              // fieldManager.tableManager = manager; // needed for filterlink field




                              fieldManager.onChangeValue = function(key, value) {
                                manager.addChange(post, key, value);
                              }

                              fieldManager.onFilter = function(filters) {
                                manager.filters = filters;
                          			manager.request();
                          			manager.renderHeader();
                              }




                              // fieldManager.onModify = function(isModified) {
                              // 	if (isModified) {
                              // 		cell.classList.add("modified");
                              // 	} else {
                              // 		cell.classList.remove("modified");
                              // 	}
                              // };

                              fieldManager.onSave = manager.renderFooter;
                              // fieldManager.init();
                              // fieldManager.update(field.modifiedValue);
                              manager.fields.push(fieldManager);


                              return KarmaFields.build({
                                tag: "td",
                                signature: function() {
                                  return fieldManager.get();
                                },
                                init: function(cell, update) {

                                  if (column.field === "index") {
                                    manager.select.addRowIndex(cell, fieldManager, colIndex, rowIndex);
                                  } else {
                                    manager.select.addField(cell, fieldManager, colIndex, rowIndex);
                                  }
                                  fieldManager.onModify = function(isModified) {
                                  	cell.classList.toggle("modified", fieldManager.modified || false);
                                  };
                                  update();
                                },
                                child: function() {
                                  return KarmaFields.fields[column.field](fieldManager);
                                    // fieldManager.build()

                                }
                              });
                            });
                          }
                        });
                      });
                    }
                  })
                ];
              }
            })
          }
        }),
        KarmaFields.tables.footer(manager)
      ];
    }
  });
}

// KarmaFields.tables.gridRow = function(manager, post, rowIndex) {
//   return KarmaFields.build({
//     tag: "tr",
//     children: function() {
//       return manager.resource.columns.map(function(column, colIndex) {
//         var fieldManager = KarmaFields.managers.field(column, post, manager.resource.middleware, manager.history, null);
//         fieldManager.rowIndex = ((manager.page-1)*manager.options.gridoptions.ppp)+rowIndex;
//         fieldManager.onSave = manager.renderFooter;
//         manager.fields.push(fieldManager);
//         return KarmaFields.build({
//           tag: "td",
//           init: function(cell, update) {
//             manager.select.addField(cell, fieldManager, colIndex, rowIndex);
//             fieldManager.onModify = function(isModified) {
//               cell.classList.toggle("modified", fieldManager.modified || false);
//             };
//             update();
//           },
//           child: function() {
//             return KarmaFields.fields[column.field](fieldManager);
//           }
//         });
//       });
//     }
//   });
// }
