if (!window.Karma) {
  var Karma = {};
}

Karma.postPromises = {};
Karma.getPostPromise = function(post) {
  var id = post.post_name;
  if (!this.postPromises[id]) {
    this.postPromises[id] = new Promise(function(resolve, reject) {
      Ajax.get(Karma.clusters_url+"/"+id+".json", {
        d: Date.now()
      }, function(results) {
        resolve(results);
      });
    });
  }
  return this.postPromises[id];
};

// Karma.getStatusPromise = function(statusName, post_type) {
//   var promise = new Promise(function(resolve, reject) {
//     Ajax.get(Karma.ajax_url, {
//       action: "karma_query_distinct_status",
//       post_type: post_type
//     }, function(results) {
//       return [
//         {
//           key: "all",
//           name: "All",
//           count: 0
//         },
//         {
//           key: "publish",
//           name: "Publish"
//         },
//         {
//           key: "draft",
//           name: "Draft"
//         },
//         {
//           key: "trash",
//           name: "Trash"
//         },
//         {
//           key: "auto-draft",
//           name: "Auto-Draft"
//         }
//       ].forEach(function(status) {
//         status.count = 0;
//         for (var i = 0; i < results.legnth; i++) {
//           if (results[i].post_status === status.key) {
//             status.count = results[i].num;
//           }
//         }
//       });
//     });
//
//   });
//
//
//
//   var id = post.post_name;
//   if (!this.postPromises[id]) {
//     this.postPromises[id] = new Promise(function(resolve, reject) {
//       Ajax.get(Karma.clusters_url+"/"+id+".json", {
//         d: Date.now()
//       }, function(results) {
//         resolve(results);
//       });
//     });
//   }
//   return this.postPromises[id];
// };

Karma.buildList = function(object, options) {
  console.log(object);
  var post_type = "page";
  var tableManager = {};

  tableManager.request = {
    action: "karma_query_posts",
    post_type: object.name,
    post_status: "publish",
    num: options.num || 50,
    offset: 0
  };
  // tableManager.selectedPosts = [];
  // tableManager.rows = [];
  // tableManager.selection = {
  //   clear: function() {
  //     tableManager.rows.forEach(this.remove);
  //   },
  //   add: function(row) {
  //     if (!row.selected) {
  //       row.selected = true;
  //       row.update();
  //     }
  //   },
  //   remove: function(row) {
  //     if (row.selected) {
  //       row.selected = false;
  //       row.update();
  //     }
  //   },
  //   get: function() {
  //     return tableManager.rows.filter(function(row) {
  //       return row.selected;
  //     });
  //   }
  //
  // };

  tableManager.send = function() {
    Ajax.get(Karma.ajax_url, tableManager.request, function(results) {
      tableManager.update && tableManager.update(results);
    });
  }

  var statusPromise = new Promise(function(resolve, reject) {
    Ajax.get(Karma.ajax_url, {
      action: "karma_query_distinct_status",
      post_type: post_type
    }, function(results) {
      var manager = {
        "all": {
          name: "All",
          count: 0
        },
        "publish": {
          name: "Publish",
          count: 0
        },
        "draft": {
          name: "Draft",
          count: 0
        },
        "trash": {
          name: "Trash",
          count: 0
        },
        "auto-draft": {
          name: "Auto-Draft",
          count: 0
        }
      };
      results.forEach(function(status) {
        manager[status.post_status].count = parseInt(status.num);
        manager.all.count += parseInt(status.num);
      });
      resolve(manager);
    });
  });
  var dragManager;



  return build({
    class: "karma-list-content",
    children: [
      build({
        class: "karma-list-header",
        children: [
          build({
            class: "karma-list-header-row",
            children: [
              build({
                tag: "ul",
                class: "status-list",
                init: function(ul, update) {
                  statusPromise.then(update);
                },
                update: function(status) {
                  return {
                    children: ["all", "publish", "draft", "trash", "auto-draft"].filter(function(statusKey) {
                      return status[statusKey].count;
                    }).map(function(statusKey) {
                      return build({
                        tag: "li",
                        class: tableManager.request.post_status === statusKey && "active",
                        children: [
                          build({
                            tag: "a",
                            text: status[statusKey].name
                          }),
                          build({
                            tag: "span",
                            text: " ("+status[statusKey].count+")"
                          })
                        ]
                      })
                    })
                  }
                }
                // children: [
                //   {
                //     key: null,
                //     name: "All"
                //   },
                //   {
                //     key: "publish",
                //     name: "Publish"
                //   },
                //   {
                //     key: "draft",
                //     name: "Draft"
                //   },
                //   {
                //     key: "trash",
                //     name: "Trash"
                //   },
                //   {
                //     key: "auto-draft",
                //     name: "Auto-Draft"
                //   }
                // ].map(function(status) {
                //   return build({
                //     tag: "li",
                //     init: function(li, update) {
                //       var request = {
                //         action: "karma_query_posts",
                //         post_type: object.name,
                //         query_posts: 0
                //       };
                //       if (status.key) {
                //         request.post_status = status.key;
                //       }
                //       Ajax.get(Karma.ajax_url, request, function(results) {
                //         if (results.count && parseInt(results.count)) {
                //           update(results.count);
                //         }
                //       });
                //     },
                //     update: function(count) {
                //       return {
                //         children: [
                //           build({
                //             tag: "a",
                //             text: status.name
                //           }),
                //           build({
                //             tag: "span",
                //             text: " ("+count+")"
                //           })
                //         ]
                //       }
                //     }
                //   })
                // })
              })
            ]
          }),
          build({
            class: "karma-list-header-row",
            children: [
              build({
                class: "karma-list-filters",
                children: options.filters.map(function(filter) {
                  console.log(filter);
                  if (filter.type === "taxonomy") {
                    return build({
                      class: "karma-list-filter-container",
                      init: function(container, update) {
                        Ajax.get(Karma.ajax_url, {
                          action: "karma_query_terms",
                          taxonomy: filter.taxonomy
                        }, function(results) {

                          results.terms && update(results.terms);

                        });
                      },
                      update: function(terms) {
                        return {
                          child: KarmaFieldMedia.buildSelector(terms.map(function(term) {
                            return {
                              key: term.id,
                              name: term.name
                            };
                          }), tableManager.request.taxonomy === filter.taxonomy && tableManager.request.term_id, function(value) {
                            tableManager.request.taxonomy = filter.taxonomy;
                            tableManager.request.term_id = this.value;
                            tableManager.send();
                          })
                        }

                      }
                    })
                  } else if (filter.type === "date") {
                    return build({
                      class: "karma-list-filter-container",
                      init: function(container, update) {
                        Ajax.get(Karma.ajax_url, {
                          action: "karma_query_distinct_years",
                          field: filter.field || '',
                          meta_key: filter.meta_key || '',
                          post_type: object.name
                        }, function(years) {
                          update(years);
                        });
                      },
                      update: function(years) {
                        return {
                          child: KarmaFieldMedia.buildSelector(years.map(function(year) {
                            return {
                              key: year,
                              name: year
                            };
                          }), (filter.field === "year" && tableManager.request.year) || (tableManager.request.meta_key === filter.meta_key && tableManager.request.meta_value), function(value) {
                            if (filter.field) {
                              tableManager.request.year = this.value;
                            } else if (filter.meta_key) {
                              tableManager.request.meta_key = filter.meta_key;
                              tableManager.request.compare = "BETWEEN"
                              tableManager.request.meta_value = this.value;
                            }

                            tableManager.send();
                          })
                        }

                      }
                    })

                  }

                })
              }),
              build({
                class: "karma-list-search",
                init: function(search) {
                  var input;
                  return {
                    children: [
                      build({
                        tag: "input",
                        init: function(element) {
                          input = element;
                          input.type = "search";
                          input.oninput = function() {
                            if (input.value.length !== 1) {
                              tableManager.request.search = input.value;
                              tableManager.send();
                            }
                          }
                        }
                      }),
                      build({
                        tag: "button",
                        class: "button",
                        text: "Seach "+(object.labels && object.labels.name || object.name),
                        init: function(button) {
                          button.onclick = function(event) {
                            tableManager.request.search = input.value;
                            tableManager.send();
                          }
                        }
                      })
                    ]
                  }
                }
              })
            ]
          })
        ]
      }),
      build({
        class: "karma-list-body",
        init: function(table, update) {
          tableManager.update = update;
          tableManager.send();
        },
        update: function(query) {
          console.log(query);
          return {
            child: build({
              tag: "table",
              class: "widefat fixed striped",
              children: [
                build({
                  tag: "thead",
                  child: build({
                    tag: "tr",
                    children: options.columns.map(function(column) {
                      return build({
                        tag: "th",
                        update: function() {
                          if (column.sortable) {
                            return {
                              children: [
                                build({
                                  tag: "span",
                                  text: column.name
                                }),
                                tableManager.orderby === column.key && build({
                                  tag: "span",
                                  class: "dashicons dashicons-arrow"+(tableManager.order === "asc" ? "-up" : "-down")
                                })
                              ]
                            }
                          } else {
                            return {
                              text: column.name
                            }
                          }
                        },
                        init: function(th, update) {
                          update();
                        }
                      })
                    })
                  })
                }),
                build({
                  tag: "tbody",
                  init: function(tbody, update) {
                    tableManager.updateTbody = update;
                    dragManager = Sortable.register(tbody);

                    var parent;

                    dragManager.onMove = function(selection, rect) {
                      var index = dragManager.items.indexOf(selection[0]);
                      var prev = index > 0 && dragManager.items[index-1];
                      if (prev && rect.left > prev.box.left + 40) {
                        tbody.style.boxShadow = "inset 40px 0px 0px 0px #f1f1f1";
                        if (parent && parent !== prev) {
                          parent.element.classList.remove("parent");
                          parent = null;
                        }
                        if (prev && parent !== prev) {
                          parent = prev;
                          parent.element.classList.add("parent");
                        }
                      } else {
                        tbody.style.boxShadow = "none";
                        if (parent) {
                          parent.element.classList.remove("parent");
                          parent = null;
                        }
                      }

                      // if (parent && parent !== prev) {
                      //   parent.element.classList.remove("parent");
                      //   parent = null;
                      // }
                      // if (prev && parent !== prev) {
                      //   parent = prev;
                      //   prev.element.classList.add("parent");
                      // }
                    };
                    update();
                  },
                  update: function() {
                    // var mouseDown = false;
                    // var dragging = false;
                    return {
                      children: query.posts.map(function(post) {
                        var dragItem;

                        return build({
                          tag: "tr",
                          init: function(tr, update) {

                            Karma.getPostPromise(post).then(function(results) {
                              update(results);
                            });

                            dragItem = dragManager.register(tr);
                            // dragItem.post = post;
                            dragItem.onReorder = function(index) {
                              console.log(post.post_name, index);
                            }


                          },
                          update: function(cluster) {

                            return {
                              init: function(tr, update) {
                                dragItem.onUpdate = update;
                                update();
                              },
                              update: function() {
                                return {
                                  // class: tableManager.selectedPosts.indexOf(post) > -1 && "selected",
                                  // class: rowManager.selected && "selected",
                                  init: function(tr) {
                                    // tr.className = dragItem.selected && "selected" || "";
                                    if (dragItem.selected) {
                                      tr.classList.add("selected");
                                    } else {
                                      tr.classList.remove("selected");
                                    }
                                  },
                                  children: options.columns.map(function(column) {
                                    return build({
                                      tag: "td",
                                      update: function() {
                                        if (column.key === "post_title") {
                                          return {
                                            child: build({
                                              tag: "a",
                                              text: cluster.post_title
                                            })
                                          }
                                        } else if (column.datatype === "date" && cluster[column.key]) {
                                          var date = new Date(Date.parse(cluster[column.key]));
                                          return {
                                            text: date.toLocaleDateString(Karma.locale, {year: 'numeric', month: 'long', day: 'numeric', hour:"2-digit", minute:"2-digit"})
                                          }
                                        } else {
                                          return {
                                            text: cluster[column.key] || "?"
                                          }
                                        }
                                      },
                                      init: function(td, update) {
                                        update();
                                      }
                                    })
                                  })
                                }
                              }
                            }
                          }
                        })
                      })
                    }
                  }
                })
              ]
            })
          }
        }
      })
    ]
  });
}



// Karma.dataTypes = {};
// Karma.dataTypes.date = {
//   printCell: function(value) {
//     return build({
//       text: Date.parse
//     });
//   }
// };
