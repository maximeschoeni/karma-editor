KarmaFieldMedia.tables.grid = function(manager) {
  return build({
    class: "karma-field-table grid",
    init: function(element, update) {
      element.addEventListener("mouseup", function() {
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
              },
              children: function() {
                manager.select = KarmaFieldMedia.selectors.grid(manager);
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
                      return manager.posts.map(function(post, rowIndex) {
                        manager.select.addRow(post, rowIndex);
                        return build({
                          tag: "tr",
                          children: function() {
                            return manager.resource.columns.map(function(column, colIndex) {
                              return build({
                                tag: "td",
                                child: function() {
                                  if (column.field) {
                                    var fieldManager = KarmaFieldMedia.managers.field(manager, column.field, post);
                                    var field = fieldManager.build();
                                    manager.select.addField(fieldManager, rowIndex, colIndex);
                                    return field;
                                  }
                                  // return column.field && KarmaFieldMedia.managers.field(manager, column.field, post).build();
                                  // manager.select.addField();
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
