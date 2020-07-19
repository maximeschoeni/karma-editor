KarmaFieldMedia.fields.grid = function(field) {
  var select = KarmaFieldMedia.selectors.grid();
  var gridManager = {
    addRow: function(index) {
      var value = field.get();
      value.splice(index, 0, value[0].map(function() {
        return "";
      }));
      field.set(value).then(function() {
        field.save();
        gridManager.update();
      });
    },
    addCol: function(index) {
      var value = field.get().map(function(row) {
        row.splice(index, 0, "");
        return row;
      });
      field.set(value).then(function() {
        field.save();
        gridManager.update();
      });
    },
    deleteRows: function(rows) {
      field.history.save();
      field.set(field.get().filter(function(row, index) {
        return rows.indexOf(index) === -1;
      })).then(function() {
        field.save();
        gridManager.update();
      });
    },
    deleteCols: function(cols) {
      field.history.save();
      field.set(field.get().map(function(row) {
        return row.filter(function(cell, index) {
          return cols.indexOf(index) === -1;
        });
      })).then(function() {
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
		var rows = select.getSelectedRows();
    var cols = select.getSelectedCols();
    console.log(rows, cols);
		if (rows) {
			gridManager.deleteRows(rows);
			event.preventDefault();
		} else if (cols) {
			gridManager.deleteCols(cols);
			event.preventDefault();
		}
	};
  KarmaFieldMedia.events.onSelectAll = function(event) {
		select.onSelectAll(event);
	};

	return build({
		class: "karma-field grid-field",
    init: function(element, update) {
      element.addEventListener("mouseup", function() {
        if (select && select.onClick) {
          select.onClick();
        }
      });
      update();
    },
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
          class: "grid-controls",
          children: function() {
            return [
              build({
                tag: "button",
                init: function(element) {
                  element.innerText = "add row before";
                  element.addEventListener("click", function(event) {
                    event.preventDefault();
                    if (select.rect.height) {
                      gridManager.addRow(select.rect.y);
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
                  element.innerText = "add row after";
                  element.addEventListener("click", function(event) {
                    event.preventDefault();
                    if (select.rect.height) {
                      gridManager.addRow(select.rect.y+select.rect.height);
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
                  element.innerText = "add col before";
                  element.addEventListener("click", function(event) {
                    event.preventDefault();
                    if (select.rect.width) {
                      gridManager.addCol(select.rect.x);
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
                  element.innerText = "add col after";
                  element.addEventListener("click", function(event) {
                    event.preventDefault();
                    if (select.rect.width) {
                      gridManager.addCol(select.rect.x+select.rect.width);
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
                  element.innerText = "remove row";
                  element.addEventListener("click", function(event) {
                    event.preventDefault();
                    if (select.rect.height) {
                      var rows = [];
                      for (var i = 0; i < select.rect.height; i++) {
                        rows.push(select.rect.y + i);
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
                  element.innerText = "remove col";
                  element.addEventListener("click", function(event) {
                    event.preventDefault();
                    if (select.rect.width) {
                      var rows = [];
                      for (var i = 0; i < select.rect.width; i++) {
                        rows.push(select.rect.x + i);
                      }
                      gridManager.deleteCols(rows);
                    }
                  });
                  element.addEventListener("mouseup", function(event) {
                    event.stopPropagation();
                  });
                }
              })
            ];
          }
        }),
        build({
          tag: "table",
          class: "grid",
          child: function() {
            return build({
              tag: "tbody",
              init: function(element, update) {
                field.fetch([[""]]).then(function(value) {
    							update();
    						});
                gridManager.update = update;
              },
              children: function() {
                select.init();
                return field.get().map(function(row, y) {
                  select.addRow(y, y);
                  var rowField = KarmaFieldMedia.managers.field({
                    child_key: y.toString()
                  }, field.post, field.middleware, field.history, field);
                  return build({
                    tag: "tr",
                    children: function() {
                      return rowField.get().map(function(col, x) {
                        return build({
                          tag: "td",
                          init: function(cell, update) {
                            var inputField = KarmaFieldMedia.managers.field({
                              child_key: x.toString(),
                              field: "textinput"
                            }, field.post, field.middleware, field.history, rowField);
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
