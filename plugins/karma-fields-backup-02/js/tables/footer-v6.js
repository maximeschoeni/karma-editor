KarmaFields.tables.footer = function(manager) {
  return KarmaFields.build({
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

      // var modifiedURIs = Object.keys(manager.getChanges());

      var modifiedURIs = Object.keys(manager.changes);
      // console.log(modifiedURIs);

      var items = manager.select.getSelectedItems();
      var selectedRows = manager.select.getSelectedRows();

      // console.log(selectedRows);

      // var optionsField;
      return [
        manager.displayOptions && KarmaFields.build({
          class: "table-options-container",
          children: function() {
            // var optionsManager = {};
            // manager.optionsField = KarmaFields.managers.field(manager.resource.options, manager.options);
            // if (manager.resource.options) {
            //   optionsManager.field = KarmaFields.managers.field(manager.resource.options, manager.options);
            //   // optionsManager.field.onModify = function(modified) {
            //   //   // manager.options.gridoptions = options.get();
            //   //   // manager.request();
            //   //   // optionsManager.isModified = modified;
            //   //   optionsManager.updateFooter();
            //   // }
            //   optionsManager.field.onModify = function(modified) {
            //
            //     manager.options.gridoptions = optionsManager.field.get();
            //
            //     console.log(manager.options.gridoptions, modified, optionsManager.field.isModified(manager.options.gridoptions));
            //
            //     // manager.updateFooter();
            //   }
            //
            // }



            return [
              // KarmaFields.build({
              //   class: "table-options-header field-controls",
              //   children: function() {
              //     return [
              //       KarmaFields.build({
              //         tag: "h4",
              //         text: function() {
              //           return "Options";
              //         }
              //       }),
              //       KarmaFields.includes.icon({
              //         tag: "button",
              //         url: function() {
              //           return KarmaFields.icons_url+"/no.svg";
              //         },
              //         init: function(element, update) {
              //           element.addEventListener("click", function() {
              //             manager.displayOptions = false;
              //             manager.renderFooter();
              //           });
              //           element.addEventListener("mouseup", function(event) {
              //             event.stopPropagation();
              //           });
              //           update();
              //         }
              //       })
              //     ];
              //   }
              // }),
              KarmaFields.build({
                class: "table-options-body",
                init: function(element, render) {
                  manager.renderOptions = render; // trigerred when history changes
                  render();
                },
                child: function() {
                  // if (optionsManager.field) {
                  //   return optionsManager.field.build();
                  // }
                  if (manager.optionsField) {
                    return manager.optionsField.build();
                  }
                }
              }),
              KarmaFields.build({
                class: "table-options-footer",
                // init: function(element, update) {
                //   optionsManager.field.onModify = update;
                //   update();
                // },
                children: function() {



                  return [
                    // build({
                    //   tag: "button",
                    //   class: "button",
                    //   init: function(element) {
                    //     element.innerText = "Close";
                    //     element.addEventListener("click", function() {
                    //       manager.displayOptions = false;
                    //       manager.renderFooter();
                    //     });
                    //   }
                    // }),
                    // build({
                    //   tag: "button",
                    //   class: "button primary",
                    //   init: function(element) {
                    //     element.innerText = "Update";
                    //     if (!optionsManager.field.modified) {
                    //       element.disabled = true;
                    //     }
                    //     element.addEventListener("click", function() {
                    //       manager.options.gridoptions = optionsManager.field.get();
                    //       manager.displayOptions = false;
                    //       manager.request();
                    //     });
                    //   }
                    // })
                    KarmaFields.includes.icon({
                      tag: "button",
                      class: "button footer-item",
                      url: function() {
                        return KarmaFields.icons_url+"/no.svg";
                      },
                      init: function(element, update) {
                        element.addEventListener("click", function() {
                          manager.displayOptions = false;
                          manager.renderFooter();
                        });
                        update();
                      }
                    }),
                  ];
                }
              })
            ];
          }
        }),
        KarmaFields.build({
          class: "footer-bar",
          children: function() {
            return [
              KarmaFields.build({
                class: "footer-group table-info",
                children: function() {
                  if (manager.loading) {
                    return[KarmaFields.includes.icon({
                      class: "footer-item table-spinner",
                      url: function() {
                        return KarmaFields.icons_url+"/update.svg";
                      }
                    })];
                  } else {
                    return [

                      // KarmaFields.build({
                      //   tag: "button",
                      //   class: "button footer-item primary",
                      //   init: function(element, update) {
                      //     element.innerText = "Save";
                      //     element.disabled = modifiedURIs.length === 0;
                      //     element.addEventListener("click", function(event) {
                      //       manager.sync();
                      //     });
                      //     element.addEventListener("mouseup", function(event) {
                      //       event.stopPropagation();
                      //     });
                      //   }
                      // }),
                      // KarmaFields.build({
                      //   tag: "p",
                      //   class: "footer-item",
                      //   text: function() {
                      //     var infos = [];
                      //     if (status) {
                      //       infos.push(status);
                      //       setTimeout(function() {
                    	// 				manager.renderFooter();
                    	// 			}, 1500);
                      //     } else {
                      //       // if (manager.options.gridoptions.ppp > 0) {
                      //       //   infos.push(manager.history.posts.length+"/"+manager.num+" items");
                      //       // } else {
                      //       //   infos.push(manager.num+" items");
                      //       // }
                      //       infos.push(manager.num+" items");
                      //       // if (editedFields.length > 1) {
                      //       //   infos.push(editedFields.length+" fields modified");
                      //       // } else if (editedFields.length > 0) {
                      //       //   infos.push(editedFields.length+" field modified");
                      //       // }
                      //       // if (items.length > 1) {
                      //       //   infos.push(items.length+" rows selected");
                      //       // } else if (items.length > 0) {
                      //       //   infos.push(items.length+" row selected");
                      //       // } else if (manager.select.rect.width*manager.select.rect.height > 1) {
                      //       //   infos.push((manager.select.rect.width*manager.select.rect.height)+" cells selected");
                      //       // } else if (manager.select.rect.width*manager.select.rect.height > 0) {
                      //       //   infos.push((manager.select.rect.width*manager.select.rect.height)+" cell selected");
                      //       // }
                      //     }
                      //     return infos.join(". ");
                      //   }
                      // }),
                      KarmaFields.build({
                        tag: "button",
                        class: "button footer-item primary",
                        init: function(element, update) {
                          element.title = "Save";
                          element.disabled = modifiedURIs.length === 0;
                          element.innerText = "Save";
                          element.addEventListener("click", function(event) {
                            manager.sync();
                          });
                          element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        }
                      }),
                      // KarmaFields.includes.icon({
                      //   tag: "button",
                      //   class: "button footer-item primary",
                      //   url: function() {
                      //     return KarmaFields.icons_url+"/update.svg";
                      //   },
                      //   // update: function(element) {
                      //   //   element.disabled = modifiedURIs.length === 0 && !(manager.optionsField && manager.optionsField.modified);
                      //   // },
                      //   init: function(element, update) {
                      //     element.title = "Save";
                      //     element.disabled = modifiedURIs.length === 0;
                      //
                      //     // if (manager.optionsField) {
                      //     //   manager.optionsField.onModify = function(modified) {
                      //     //     update();
                      //     //   }
                      //     //   manager.optionsField.onSubmit = function(modified) {
                      //     //     manager.displayOptions = false;
                			// 		// 		manager.sync();
                			// 		// 	}
                      //     // }
                      //
                      //     element.addEventListener("click", function(event) {
                      //       manager.sync();
                      //     });
                      //     element.addEventListener("mouseup", function(event) {
                      //       event.stopPropagation();
                      //     });
                      //     update();
                      //   }
                      // }),
                      KarmaFields.includes.icon({
                        tag: "button",
                        class: "button footer-item",
                        url: function() {
                          return KarmaFields.icons_url+"/admin-generic.svg";
                        },
                        init: function(element, update) {
                          element.title = "Options";
                          if (manager.displayOptions) {
                            element.classList.add("active");
                          }
                          element.addEventListener("click", function(event) {
                            manager.displayOptions = !manager.displayOptions;
                            manager.renderFooter();
                          });
                          element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                          update();
                        }
                      }),
                      KarmaFields.includes.icon({
                        tag: "button",
                        class: "button footer-item",
                        url: function() {
                          return KarmaFields.icons_url+"/undo.svg";
                        },
                        init: function(element, update) {
                          element.title = "Undo";
                          element.disabled = manager.history.index < 1;
                          element.addEventListener("click", function(event) {
                            manager.history.undo();
                          });
                          element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                          update();
                        }
                      }),
                      KarmaFields.includes.icon({
                        tag: "button",
                        class: "button footer-item",
                        url: function() {
                          return KarmaFields.icons_url+"/redo.svg";
                        },
                        init: function(element, update) {
                          element.title = "Redo";
                          element.disabled = manager.history.index >= manager.history.total;
                          element.addEventListener("click", function(event) {
                            manager.history.redo();
                          });
                          element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                          update();
                        }
                      }),
                      KarmaFields.includes.icon({
                        tag: "button",
                        class: "button footer-item",
                        url: function() {
                          return KarmaFields.icons_url+"/plus-alt2.svg";
                        },
                        init: function(element, update) {
                          element.title = "Add";
                          element.addEventListener("click", function(event) {
                            window.scrollTo(0, document.body.scrollHeight);
                            manager.addItem();
                          });
                          element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                          update();
                        }
                      }),
                      KarmaFields.includes.icon({
                        tag: "button",
                        class: "button footer-item",
                        url: function() {
                          return KarmaFields.icons_url+"/trash.svg";
                        },
                        init: function(element, update) {
                          element.innerText = "Delete";
                          // element.disabled = items.length === 0;
                          element.disabled = selectedRows.length === 0;

                          element.addEventListener("click", function(event) {
                            // manager.removeItems(items);
                            manager.removeItems(selectedRows);
                          });
                          element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                          update();
                        }
                      })
                    ];
                  }
                }
              }),

              // KarmaFields.build({
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
              //       KarmaFields.build({
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
              //       KarmaFields.build({
              //         tag: "p",
              //         class: "footer-item",
              //         text: function() {
              //           return editedFields.length > 1 ? editedFields.length+" fields modified" : "1 field modified";
              //         }
              //       })
              //     ];
              //   }
              // }),

              // KarmaFields.build({
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
              //           KarmaFields.build({
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
              //           KarmaFields.build({
              //             tag: "p",
              //             class: "footer-item",
              //             text: function() {
              //               return items.length > 1 ? items.length+" rows selected" : "1 row selected";
              //             }
              //           })
              //         ];
              //       } else if (manager.select.rect.width*manager.select.rect.height === 1) {
              //         return [
              //           KarmaFields.build({
              //             tag: "p",
              //             class: "footer-item",
              //             text: function() {
              //               return "1 cell selected";
              //             }
              //           }),
              //         ];
              //       } else if (manager.select.rect.width*manager.select.rect.height > 1) {
              //         return [
              //           KarmaFields.build({
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

              KarmaFields.tables.pagination(manager),
              // KarmaFields.build({
              //   class: "footer-group table-control",
              //   children: function() {
              //     return [
              //
              //       KarmaFields.build({
              //         tag: "button",
              //         class: "button footer-item",
              //         init: function(element, update) {
              //           element.innerText = "Options";
              //           element.addEventListener("click", function(event) {
              //             manager.displayOptions = !manager.displayOptions;
              //             manager.renderFooter();
              //           });
              //           element.addEventListener("mouseup", function(event) {
              //             event.stopPropagation();
              //           });
              //         }
              //       }),
              //       KarmaFields.build({
              //         tag: "button",
              //         class: "button footer-item",
              //         init: function(element, update) {
              //           element.innerText = "Undo";
              //           element.disabled = manager.history.index < 1;
              //           element.addEventListener("click", function(event) {
              //             manager.history.undo();
              //           });
              //           element.addEventListener("mouseup", function(event) {
              //             event.stopPropagation();
              //           });
              //         }
              //       }),
              //       KarmaFields.build({
              //         tag: "button",
              //         class: "button footer-item",
              //         init: function(element, update) {
              //           element.innerText = "Redo";
              //           element.disabled = manager.history.index >= manager.history.total;
              //           element.addEventListener("click", function(event) {
              //             manager.history.redo();
              //           });
              //           element.addEventListener("mouseup", function(event) {
              //             event.stopPropagation();
              //           });
              //         }
              //       }),
              //       KarmaFields.build({
              //         tag: "button",
              //         class: "button footer-item",
              //         init: function(element, update) {
              //           element.innerText = "Add";
              //           element.addEventListener("click", function(event) {
              //             window.scrollTo(0, document.body.scrollHeight);
              //             manager.addItem();
              //           });
              //           element.addEventListener("mouseup", function(event) {
              //             event.stopPropagation();
              //           });
              //         }
              //       }),
              //       KarmaFields.build({
              //         tag: "button",
              //         class: "button delete footer-item",
              //         init: function(element, update) {
              //           element.innerText = "Delete";
              //           element.disabled = items.length === 0;
              //           element.addEventListener("click", function(event) {
              //             manager.removeItems(items);
              //           });
              //           element.addEventListener("mouseup", function(event) {
              //             event.stopPropagation();
              //           });
              //         }
              //       })
              //
              //     ];
              //   }
              // })
            ];
          }
        })
      ];
    }
  });
}
