KarmaFieldMedia.fields.grid = function(field) {
  var select = KarmaFieldMedia.selectors.grid();
  var gridManager = {
    default: {rows: [{cells: [{text: ""}]}]},
    isEmptyValue: function(value) {
      return !value || !value.rows || !value.rows.length || !value.rows[0].cells || !value.rows[0].cells.length;
    },
    addRow: function(index) {
      field.history.save();
      var value = field.get();
      value.rows.splice(index, 0, {cells: value.rows[0].cells.map(function() {
        return {text:""};
      })});
      field.set(value).then(function() {
        field.save();
        gridManager.update();
      });
    },
    addCol: function(index) {
      field.history.save();
      var value = field.get();
      value.rows.forEach(function(row) {
        row.cells.splice(index, 0, {text:""});
        return row;
      });
      field.set(value).then(function() {
        field.save();
        gridManager.update();
      });
    },
    deleteRows: function(rows) {
      field.history.save();
      select.select();
      var value = field.get();
      value.rows = value.rows.filter(function(row, index) {
        return rows.indexOf(index) === -1;
      });
      if (this.isEmptyValue(value)) {
        value = this.default;
      }
      field.set(value).then(function() {
        field.save();
        console.log("ok")
        gridManager.update();
      });

    },
    deleteCols: function(cols) {
      field.history.save();
      select.select();
      var value = field.get();
      value.rows.forEach(function(row) {
        row.cells = row.cells.filter(function(cell, index) {
          return cols.indexOf(index) === -1;
        });
      });
      if (this.isEmptyValue(value)) {
        value = this.default;
      }
      field.set(value).then(function() {
        field.save();
        gridManager.update();
      });
    }
  };

  KarmaFieldMedia.events.onCopy = function(event) {
		select.onCopy(event);
	}
	KarmaFieldMedia.events.onPast = function(event) {
		select.onPast(event);
	}
  KarmaFieldMedia.events.onDelete = function(event) {
    var rect = select.getSelectionRect();
    if (rect.width > 1 || rect.height > 1) {
      var rows = select.getSelectedRows();
      var cols = select.getSelectedCols();
  		if (rows.length) {
  			gridManager.deleteRows(rows);
  			event.preventDefault();
  		} else if (cols.length) {
  			gridManager.deleteCols(cols);
  			event.preventDefault();
  		}
    }
	};
  KarmaFieldMedia.events.onSelectAll = function(event) {
		select.onSelectAll(event);
	};
  KarmaFieldMedia.events.onClick = function(event) {
		select.onClick();
	};

	return build({
		class: "karma-field grid-field",
		children: function() {
			return [
				field.resource.label && build({
					tag: "label",
					init: function(label) {
						label.htmlFor = field.id;
						label.innerHTML = field.resource.label;
					}
				}),
        build({
          class: "field-controls",
          child: function() {
            return build({
              class: "field-controls-group",
              children: function() {
                return [
                  build({
                    tag: "button",
                    init: function(element, update) {
                      element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var rect = select.getSelectionRect();
                        if (rect.height) {
                          select.selectionRect.top++;
                          gridManager.addRow(rect.top);
                        } else {
                          gridManager.addRow(0);
                        }
                      });
                      element.addEventListener("mouseup", function(event) {
                        event.stopPropagation();
                      });
                      fetch(KarmaFields.icons_url+"/table-row-before.svg").then(function(response) {
                        return response.text();
                      }).then(function(result) {
                        element.innerHTML = result;
                      });
                    }
                  }),
                  build({
                    tag: "button",
                    init: function(element) {
                      fetch(KarmaFields.icons_url+"/table-row-after.svg").then(function(response) {
                        return response.text();
                      }).then(function(result) {
                        element.innerHTML = result;
                      });
                      element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var rect = select.getSelectionRect();
                        if (rect.height) {
                          gridManager.addRow(rect.top+rect.height);
                        } else {
                          gridManager.addRow(select.rect.height);
                        }
                      });
                      element.addEventListener("mouseup", function(event) {
                        event.stopPropagation();
                      });
                    }
                  }),
                  build({
                    tag: "button",
                    init: function(element) {
                      // element.innerText = "add col before";
                      fetch(KarmaFields.icons_url+"/table-col-before.svg").then(function(response) {
                        return response.text();
                      }).then(function(result) {
                        element.innerHTML = result;
                      });
                      element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var rect = select.getSelectionRect();
                        if (rect.width) {
                          select.selectionRect.left++;
                          gridManager.addCol(rect.left);
                        } else {
                          gridManager.addCol(0);
                        }
                      });
                      element.addEventListener("mouseup", function(event) {
                        event.stopPropagation();
                      });
                    }
                  }),
                  build({
                    tag: "button",
                    init: function(element) {
                      fetch(KarmaFields.icons_url+"/table-col-after.svg").then(function(response) {
                        return response.text();
                      }).then(function(result) {
                        element.innerHTML = result;
                      });
                      element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var rect = select.getSelectionRect();
                        if (rect.width) {
                          gridManager.addCol(rect.left+rect.width);
                        } else {
                          gridManager.addCol(select.rect.width);
                        }
                      });
                      element.addEventListener("mouseup", function(event) {
                        event.stopPropagation();
                      });
                    }
                  }),
                  build({
                    tag: "button",
                    init: function(element) {
                      fetch(KarmaFields.icons_url+"/table-row-delete.svg").then(function(response) {
                        return response.text();
                      }).then(function(result) {
                        element.innerHTML = result;
                      });
                      element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var rect = select.getSelectionRect();
                        if (rect.height) {
                          var rows = [];
                          for (var i = 0; i < rect.height; i++) {
                            rows.push(rect.top + i);
                          }
                          gridManager.deleteRows(rows);
                        }
                      });
                      element.addEventListener("mouseup", function(event) {
                        event.stopPropagation();
                      });
                    }
                  }),
                  build({
                    tag: "button",
                    init: function(element) {
                      // element.innerText = "remove col";
                      fetch(KarmaFields.icons_url+"/table-col-delete.svg").then(function(response) {
                        return response.text();
                      }).then(function(result) {
                        element.innerHTML = result;
                      });
                      element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var rect = select.getSelectionRect();
                        if (rect.width) {
                          var cols = [];
                          for (var i = 0; i < rect.width; i++) {
                            cols.push(rect.left + i);
                          }
                          gridManager.deleteCols(cols);
                        }
                      });
                      element.addEventListener("mouseup", function(event) {
                        event.stopPropagation();
                      });
                    }
                  })
                ];
              }
            });
          }
        }),
        build({
          tag: "table",
          class: "grid",
          child: function() {
            return build({
              tag: "tbody",
              init: function(element, update) {
                field.fetch(gridManager.default).then(function(value) {
    							update();
    						});
                gridManager.update = update;
              },
              children: function() {
                select.init();
                var rowsField = KarmaFieldMedia.managers.field({
                  child_key: "rows"
                }, field.post, field.middleware, field.history, field);

                return rowsField.get().map(function(row, y) {
                  select.addRow(y, y);
                  var rowField = KarmaFieldMedia.managers.field({
                    child_key: y.toString()
                  }, field.post, field.middleware, field.history, rowsField);
                  return build({
                    tag: "tr",
                    children: function() {
                      var cellsField = KarmaFieldMedia.managers.field({
                        child_key: "cells",
                      }, field.post, field.middleware, field.history, rowField);
                      return cellsField.get().map(function(col, x) {
                        return build({
                          tag: "td",
                          init: function(cell, update) {
                            var cellField = KarmaFieldMedia.managers.field({
                              child_key: x.toString()
                            }, field.post, field.middleware, field.history, cellsField);
                            var inputField = KarmaFieldMedia.managers.field({
                              child_key: "text",
                              field: "textinput"
                            }, field.post, field.middleware, field.history, cellField);
                            select.addField(cell, inputField, x, y);
                            update(inputField);
                          },
                          child: function(inputField) {
                            return inputField.build();
                          }
                        });
                      });
                    }
                  });
                });
              }
            });
          }
        })
			];
		}
	});
}
