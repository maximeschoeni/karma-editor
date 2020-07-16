KarmaFieldMedia.tables.grid = function(manager) {
  return build({
    class: "karma-field-table grid",
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
        //KarmaFieldMedia.tables.header(manager),
        build({
          class: "table-header",
          child: function() {
            return manager.buildFilter();
          }
        }),
        build({
          class: "table-body",
          child: function() {
            return build({
              tag: "table",
              init: function(table, update) {
                manager.render = update;
                manager.request();
                // .then(function() {
                //   manager.history.save();
                // });
              },
              children: function() {
                manager.select.init(); // = KarmaFieldMedia.selectors.grid(manager);
                manager.fields = [];
                // manager.select.onSelect = manager.renderControls;
                return [
                  build({
                    tag: "thead",
                    child: function() {
                      return build({
                        tag: "tr",
                        children: function() {
                          return manager.resource.columns.map(function(column, colIndex) {
                            var headerCell = KarmaFieldMedia.tables.headerCell(manager, column);
                            manager.select.addCol(headerCell, colIndex);
                            return headerCell;
                          });
                        }
                      })
                    }
                  }),
                  build({
                    tag: "tbody",
                    children: function() {
                      return manager.getItems().map(function(post, rowIndex) {
                        manager.select.addRow(post, rowIndex);

                        // var rowManager = KarmaFieldMedia.managers.row(post, table);
                        // manager.rows.push(rowManager);

                        // manager.addRow(post, rowIndex);

                        return build({
                          tag: "tr",
                          children: function() {
                            return manager.resource.columns.map(function(column, colIndex) {
                              return build({
                                tag: "td",
                                init: function(cell, update) {
                                  if (column.field) {
                                    var fieldManager = KarmaFieldMedia.managers.field(column.field, post, manager.resource.middleware, manager.history, null);

                                    fieldManager.onModify = function(isModified) {
                        							if (isModified) {
                        								cell.classList.add("modified");
                        							} else {
                        								cell.classList.remove("modified");
                        							}
                        						};
                                    fieldManager.onSave = manager.renderFooter;



                                    // fieldManager.init();
                                    // fieldManager.update(field.modifiedValue);
                                    manager.fields.push(fieldManager);
                                    manager.select.addField(cell, fieldManager, colIndex, rowIndex);
                                    update(fieldManager);
                                  }
                                },
                                children: function(fieldManager) {
                                  return [
                                    fieldManager.build()
                                  ];
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
        KarmaFieldMedia.tables.footer(manager)
      ];
    }
  });
}
