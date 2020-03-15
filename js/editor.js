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

// Karma.Collection = function() {
//   var collection = {
//     items: [],
//
//   };
// }




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
  var post_type = "page";
  var tableManager = {};

  tableManager.request = {
    action: "karma_query_posts",
    post_type: object.name,
    post_status: "publish",
    num: options.num || 50,
    offset: 0,
    orderby: "menu_order",
    order: "ASC"
  };

  tableManager.getChildren = function(postId) {
    return this.posts.filter(function(post) {
      return parseInt(post.post_parent) === (postId || 0);
    });
  };
  tableManager.getParent = function(post) {
    if (post.parent === undefined) {
      post.parent = parseInt(post.post_parent) && this.posts && this.posts.find(function(otherPost) {
        return post.post_parent === otherPost.ID;
      }) || null;
    }
    return post.parent;
  };
  tableManager.getURI = function(post) {
    var parent = this.getParent(post);
    if (parent) {
      return this.getURI(parent) + "/" + post.post_name;
    } else {
      return (object.rewrite && object.rewrite.slug && (object.rewrite.slug + "/") || "") + post.post_name;
    }
  };
  tableManager.getTree = function() {
    var tree = [];
    this.posts && this.posts.forEach(function(post) {
      var parent =  tableManager.getParent(post);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(post);
      } else {
        tree.push(post);
      }
    });
    return tree;
  }
  tableManager.postPromises = {};
  tableManager.getClusterPromise = function(post) {
    var uri = this.getURI(post);
    if (!this.postPromises[uri]) {
      this.postPromises[uri] = new Promise(function(resolve, reject) {
        Ajax.get(Karma.clusters_url+"/"+uri+".json", {
          d: Date.now()
        }, function(results) {
          resolve(results);
        });
      });
    }
    return this.postPromises[uri];
  };

  tableManager.send = function() {
    Ajax.get(Karma.ajax_url, tableManager.request, function(results) {
      tableManager.posts = results.posts;
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
        init: function(listBody, update) {
          tableManager.update = update;
          tableManager.send();

        },
        update: function(query) {
          return {
            child: Karma.buildListHierarchy(query, tableManager, options)
          }
        }
      })
    ]
  });
}


Karma.buildListTable = function(query, tableManager, options) {

  var selectManager = Selectable.create();
  var dragManager = Sortable.create(selectManager);

  return build({
    tag: "table",
    class: "widefat fixed",
    init: function(table) {
      dragManager.onActivate = function() {
        table.classList.add("active");
      }
      dragManager.onDeactivate = function() {
        table.classList.remove("active");
      }
    },
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
          dragManager.element = tbody;
          // dragManager = Sortable.register(tbody, selectManager);


          // dragManager.onMove = function(selection, rect) {
          //   var index = dragManager.items.indexOf(selection[0]);
          //   var prev = index > 0 && dragManager.items[index-1];
          //   if (prev && rect.left > prev.box.left + 40) {
          //     tbody.style.boxShadow = "inset 40px 0px 0px 0px #f1f1f1";
          //     if (parent && parent !== prev) {
          //       parent.element.classList.remove("parent");
          //       parent = null;
          //     }
          //     if (prev && parent !== prev) {
          //       parent = prev;
          //       parent.element.classList.add("parent");
          //     }
          //   } else {
          //     tbody.style.boxShadow = "none";
          //     if (parent) {
          //       parent.element.classList.remove("parent");
          //       parent = null;
          //     }
          //   }
          //
          //   // if (parent && parent !== prev) {
          //   //   parent.element.classList.remove("parent");
          //   //   parent = null;
          //   // }
          //   // if (prev && parent !== prev) {
          //   //   parent = prev;
          //   //   prev.element.classList.add("parent");
          //   // }
          // };
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

                  dragItem = selectManager.addItem(tr);
                  dragItem.post = post;
                  dragItem.onReorder = function(index) {
                    Ajax.post(Karma.ajax_url, {
                      action: "karma_save_post",
                      ID: post.ID,
                      post_type: "page",
                      menu_order: index
                    }, function(results) {
                      console.log(results)
                    });
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
};



Karma.buildListHierarchy = function(query, tableManager, options) {

  var selectionSystem = Selection.createSystem();
  var zone = selectionSystem.addZone();



  var buildList = function(parentItem) {


    // var dragManager = Sortable.create(selectManager);

    // var zone = selectManager.addZone();
    // zone.parent = parentZone;


    return build({
      tag: "ul",
      init: function(ul) {
        // zone = selectManager.addZone(ul);
        parentItem.zone = ul;
        parentItem.onActivate = function() {
          ul.classList.add("active");
        };
        parentItem.onDeactivate = function() {
          ul.classList.remove("active");
        };
      },
      children: tableManager.getChildren(parentItem.id || 0).map(function(post) {

        var dragItem = parentItem.createChild();
        dragItem.id = parseInt(post.ID);
        dragItem.index = parseInt(post.menu_order);
        dragItem.parentId = parseInt(post.post_parent);
        dragItem.post = post;

        return build({
          tag: "li",
          init: function(li, update) {
            tableManager.getClusterPromise(post).then(function(results) {
              update(results);
            });
            dragItem.element = li;

            dragItem.onChange = function() {
              console.log({
                action: "karma_save_post",
                ID: post.ID,
                post_type: tableManager.request.post_type,
                menu_order: dragItem.index,
                post_parent: dragItem.parentId
              });
              // Ajax.post(Karma.ajax_url, {
              //   action: "karma_save_post",
              //   ID: post.ID,
              //   post_type: tableManager.request.post_type,
              //   menu_order: dragItem.index,
              //   post_parent: dragItem.parentId
              // }, function(results) {
              //   console.log(results)
              // });
            };
          },
          update: function(cluster) {
            return {
              init: function(li, update) {
                dragItem.onSelect = function() {
                  li.classList.add("selected");
                };
                dragItem.onUnselect = function() {
                  li.classList.remove("selected");
                };
                update();
              },
              update: function() {
                return {
                  children: [
                    build({
                      class: "row",
                      child: build({
                        tag: "a",
                        text: cluster.post_title
                      }),
                      init: function(row) {
                        dragItem.handle = row;
                        row.addEventListener("mousedown", dragItem.mousedown);
                        row.addEventListener("mousemove", dragItem.mousemove);
                      }
                    }),
                    buildList(dragItem)
                  ]
                }
              }
            }
          }
        })
      })
    });
  };
  return build({
    class: "selection-zone",
    child: buildList(zone),
    init: function(element) {
      zone.element = element;
    }
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
