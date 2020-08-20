KarmaFields.tables.grid = function(manager) {
  return {
    class: "karma-field-table karma-fields",
    init: function(element, render) {
      element.addEventListener("mouseup", function() {
        // handle outside mouseup
        if (manager.select && manager.select.onClick) {
          manager.select.onClick();
        }
      });
      render();
    },
    children: function() {
      return [
        {
          class: "table-header",
          init: function(element, render) {
            manager.renderHeader = render;
            render();
          },
          child: function() {
            return manager.buildFilter();
          }
        },
        {
          class: "table-body",
          update: function() {
            return manager.getItems().length > 0;
          },
          child: function() {
            return {
              tag: "table",
              class: "grid",
              update: function(element) {
                manager.select.init();
                manager.fields = [];
              },
              init: function(element, render) {
                manager.render = render;
                manager.request();
              },
              children: function() {
                return [
                  {
                    tag: "thead",
                    child: function() {
                      return {
                        tag: "tr",
                        children: function() {
                          return manager.resource.columns.map(function(column, colIndex) {
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
                          })
                        }
                      };
                    }
                  },
                  {
                    tag: "tbody",
                    signature: true,
                    children: function() {
                      return manager.getItems().map(function(post, rowIndex) {
                        return {
                          tag: "tr",
                          update: function(element) {
                            manager.select.addRow(post, rowIndex);
                            return post.uri || post.pseudo_uri;
                          },
                          children: function() {
                            return manager.resource.columns.map(function(column, colIndex) {
                              var fieldManager = KarmaFields.managers.field(column, post, manager.resource.middleware, manager.history, null);
                              fieldManager.rowIndex = (((manager.options.page || 1)-1)*manager.options.ppp || 0)+rowIndex;
                              fieldManager.onChangeValue = function(key, value) {
                                manager.addChange(post, key, value);
                              }
                              fieldManager.onFilter = function(filters) {
                                manager.filters = filters;
                                manager.request();
                                manager.renderHeader();
                              }
                              fieldManager.onSave = manager.renderFooter;
                              manager.fields.push(fieldManager);
                              return {
                                tag: "td",
                                update: function(element) {
                                  if (column.field === "index") {
                                    manager.select.addRowIndex(element, fieldManager, colIndex, rowIndex);
                                  } else {
                                    manager.select.addField(element, fieldManager, colIndex, rowIndex);
                                  }
                                  fieldManager.onModify = function(isModified) {
                                    element.classList.toggle("modified", fieldManager.modified || false);
                                  };
                                  return fieldManager.get();
                                },
                                child: function() {
                                  return KarmaFields.fields[column.field](fieldManager)
                                }
                              };
                            });
                          }
                        };
                      });
                    }
                  }
                ];
              }
            };
          }
        },
        KarmaFields.tables.footer(manager)
      ];
    }
  };
}
