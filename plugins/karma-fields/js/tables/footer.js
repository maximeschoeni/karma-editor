KarmaFieldMedia.tables.footer = function(manager) {
  return build({
    class: "table-footer",
    init: function(element, update) {
      manager.renderFooter = update;
      manager.select.onSelect = update;
      // update();
    },
    children: function(status) {
      var editedFields = manager.fields.filter(function(field) {
        return field.modifiedValue !== undefined;
      });
      var items = manager.select.getSelectedItems();
      return [
        build({
          class: "footer-group table-info",
          child: function() {
            if (manager.loading) {
              return build({
                class: "footer-item table-spinner"
              });
            } else {
              return build({
                tag: "p",
                class: "footer-item",
                text: function() {
                  var infos = [];
                  if (status) {
                    infos.push(status);
                    setTimeout(function() {
            					manager.renderFooter();
            				}, 1500);
                  } else {
                    if (manager.ppp > -1) {
                      infos.push(manager.posts.length+"/"+manager.num+" items");
                    } else {
                      infos.push(manager.num+" items");
                    }
                    if (editedFields.length > 1) {
                      infos.push(editedFields.length+" fields modified");
                    } else if (editedFields.length > 0) {
                      infos.push(editedFields.length+" field modified");
                    }
                    if (items.length > 1) {
                      infos.push(items.length+" rows selected");
                    } else if (items.length > 0) {
                      infos.push(items.length+" row selected");
                    } else if (manager.select.rect.width*manager.select.rect.height > 1) {
                      infos.push((manager.select.rect.width*manager.select.rect.height)+" cells selected");
                    } else if (manager.select.rect.width*manager.select.rect.height > 0) {
                      infos.push((manager.select.rect.width*manager.select.rect.height)+" cell selected");
                    }
                  }
                  return infos.join(". ");
                }
              });
            }
          }
        }),

        // build({
        //   class: "footer-group table-edit",
        //   init: function(element, update) {
        //     manager.renderEdit = update;
        //     update();
        //   },
        //   children: function() {
        //     var editedFields = manager.fields.filter(function(field) {
        //       return field.modifiedValue !== undefined;
        //     });
        //     return editedFields.length && [
        //       build({
        //         tag: "button",
        //         class: "button save footer-item",
        //         init: function(element, update) {
        //           element.innerText = "Save";
        //           element.addEventListener("click", function() {
        //             manager.save();
        //           });
        //           element.addEventListener("mouseup", function(event) {
        //             event.stopPropagation();
        //           });
        //         }
        //       }),
        //       build({
        //         tag: "p",
        //         class: "footer-item",
        //         text: function() {
        //           return editedFields.length > 1 ? editedFields.length+" fields modified" : "1 field modified";
        //         }
        //       })
        //     ];
        //   }
        // }),

        // build({
        //   class: "footer-group table-control",
        //   init: function(element, update) {
        //     // manager.renderControls = update;
        //     manager.select.onSelect = update;
        //     update();
        //   },
        //   children: function() {
        //     if (manager.select && manager.select.rect.width && manager.select.rect.height) {
        //       var items = manager.select.getSelectedItems();
        //       if (items.length) {
        //         return [
        //           build({
        //             tag: "button",
        //             class: "button delete footer-item",
        //             init: function(element, update) {
        //               element.innerText = "Delete";
        //               element.addEventListener("click", function() {
        //                 manager.removeItems(items);
        //               });
        //               element.addEventListener("mouseup", function(event) {
        //                 event.stopPropagation();
        //               });
        //             }
        //           }),
        //           build({
        //             tag: "p",
        //             class: "footer-item",
        //             text: function() {
        //               return items.length > 1 ? items.length+" rows selected" : "1 row selected";
        //             }
        //           })
        //         ];
        //       } else if (manager.select.rect.width*manager.select.rect.height === 1) {
        //         return [
        //           build({
        //             tag: "p",
        //             class: "footer-item",
        //             text: function() {
        //               return "1 cell selected";
        //             }
        //           }),
        //         ];
        //       } else if (manager.select.rect.width*manager.select.rect.height > 1) {
        //         return [
        //           build({
        //             tag: "p",
        //             class: "footer-item",
        //             text: function() {
        //               return (manager.select.rect.width*manager.select.rect.height)+" cells selected";
        //             }
        //           }),
        //         ];
        //       }
        //     } else {
        //
        //     }
        //   }
        // }),
        KarmaFieldMedia.tables.pagination(manager),
        build({
          class: "footer-group table-control",
          children: function() {
            return [
              build({
                tag: "button",
                class: "button footer-item",
                init: function(element, update) {
                  element.innerText = "Add";
                  element.addEventListener("click", function(event) {
                    window.scrollTo(0, document.body.scrollHeight);
                    manager.addItem();
                  });
                  element.addEventListener("mouseup", function(event) {
                    event.stopPropagation();
                  });
                }
              }),
              build({
                tag: "button",
                class: "button delete footer-item",
                init: function(element, update) {
                  element.innerText = "Delete";
                  element.disabled = items.length === 0;
                  element.addEventListener("click", function(event) {
                    manager.removeItems(items);
                  });
                  element.addEventListener("mouseup", function(event) {
                    event.stopPropagation();
                  });
                }
              }),
              build({
                tag: "button",
                class: "button footer-item",
                init: function(element, update) {
                  element.innerText = "Save";
                  element.disabled = editedFields.length === 0;
                  element.addEventListener("click", function(event) {
                    manager.save(editedFields);
                  });
                  element.addEventListener("mouseup", function(event) {
                    event.stopPropagation();
                  });
                }
              })
            ];
          }
        })
      ];
    }
  });
}
