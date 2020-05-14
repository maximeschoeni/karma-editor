/**
 * version mai2020
 */

// KarmaFieldMedia.customfields.date = function(sqlDate, option, onSave) {
KarmaFieldMedia.customfields.date = function(manager) {
  var format = manager.resource.format || "dd/mm/yyyy";
  var popup = {};
  var calendar = Calendar.create();
  // calendar.date = sqlDate && Calendar.parse(sqlDate) || new Date();
  return build({
    class: "date-input-container",
    children: function() {
      return [
        build({
          class: "date-popup-container",
          child: function() {
            return popup.isOpen && build({
              class: "karma-popup",
              child: build({
                class: "karma-calendar",
                init: function(element, update) {
                  calendar.onUpdate = function(days) {
                    var rows = [];
                    while(days.length) {
                      rows.push(days.splice(0, 7));
                    }
                    update(rows);
                  }
                },
                child: function(rows) {
                  return build({
                    class: "karma-calendar-content",
                    children: function() {
                      return [
                        build({
                          class: "karma-calendar-header",
                          child: function() {
                            return build({
                              class: "karma-calendar-nav",
                              children: function() {
                                return [
                                  build({
                                    class: "karma-prev-month karma-calendar-arrow",
                                    text: function() {
                                      return "&lsaquo;";
                                    },
                                    init: function(arrow, update) {
                                      arrow.addEventListener("mouseup", function() {
                                        calendar.changeMonth(-1);
                                      });
                                      update();
                                    }
                                  }),
                                  build({
                                    class: "karma-current-month",
                                    text: function() {
                                      return Calendar.format(calendar.date, "%fullmonth% yyyy");
                                    }
                                  }),
                                  build({
                                    class: "karma-next-month karma-calendar-arrow",
                                    text: function() {
                                      return " &rsaquo;";
                                    },
                                    init: function(arrow, update) {
                                      arrow.addEventListener("mouseup", function() {
                                        calendar.changeMonth(1);
                                      });
                                      update();
                                    }
                                  })
                                ];
                              }
                            })
                          }
                        }),
                        build({
                          class: "karma-calendar-body",
                          children: function() {
                            return [
                              build({
                                tag: "ul",
                                class: "calendar-days-title",
                                children: function() {
                                  return rows[0].map(function(day) {
                                    return build({
                                      tag: "li",
                                      text: function() {
                                        return Calendar.format(day.date, "%d2%");
                                      }
                                    });
                                  });
                                }
                              })
                            ].concat(rows.map(function(row) {
                              return build({
                                tag: "ul",
                                class: "calendar-days-content",
                                children: function() {
                                  return row.map(function(day) {
                                    return build({
                                      tag: "li",
                                      child: function() {
                                        return build({
                                          tag: "span",
                                          text: function() {
                                            return Calendar.format(day.date, "#d");
                                          }
                                        });
                                      },
                                      init: function(li, update) {
                                        if (popup.sqlDate === day.sqlDate) {
                                          li.classList.add("active");
                                        }
                                        if (day.isOffset) {
                                          li.classList.add("offset");
                                        }
                                        if (day.isToday) {
                                          li.classList.add("today");
                                        }
                                        li.onmouseup = function(event) {
                                          event.preventDefault();
                                          popup.sqlDate = day.sqlDate;
                                          popup.update();
                                          manager.save(popup.sqlDate);
                                          popup.close();
                                        }
                                        update();
                                      }
                                    });
                                  });
                                }
                              });
                            }));
                          }
                        })
                      ];
                    }
                  });
                }
              }),
              init: function(element, update) {
                // prevent closing
                element.onmousedown = function(event) {
                  event.preventDefault();
                };
                update();
              }
            });
          },
          init: function(container, update) {
            popup.open = function() {
              popup.isOpen = true;
              update();
              calendar.update();
              if (container.getBoundingClientRect().top+window.pageYOffset < 308) {
          			container.classList.add("open-down");
          		} else {
                container.classList.remove("open-down");
              }
            };
            popup.close = function() {
              popup.isOpen = false;
              update();
            };
          }
        }),
        build({
          tag: "input",
          class: "text",
          init: function(input) {
            input.type = "text";
            input.id = manager.resource.key;
            popup.update = function() {
              var date = Calendar.parse(popup.sqlDate);
              input.value = Calendar.format(date, format);
            };
            manager.default().then(function(result) {
              input.placeholder = result && Calendar.parse(result) || manager.resource.placeholder && Calendar.parse(manager.resource.placeholder) || "";
            });
            manager.value().then(function(result) {
              popup.sqlDate = result;
              calendar.date = result && Calendar.parse(result) || new Date();
              popup.update();
            });

            input.addEventListener("keyup", function() {
              var date = Calendar.parse(this.value, format);
              if (date) {
                calendar.date = date;
                popup.sqlDate = Calendar.format(date);
                calendar.update();
                popup.update();
              } else {
                popup.sqlDate = '';
              }
              //onSave && onSave(sqlDate);
              manager.save(popup.sqlDate);
            });
            var keyChange = function(dir) {
              var index = input.selectionStart || 0;
              var date = Calendar.parse(popup.sqlDate);
              if (format[index] === "y" || format[index-1] === "y") date.setFullYear(date.getFullYear() + dir);
              else if (format[index] === "m" || format[index-1] === "m") date.setMonth(date.getMonth() + dir);
              else if (format[index] === "d" || format[index-1] === "d") date.setDate(date.getDate() + dir);
              input.value = Calendar.format(date, format);
              popup.sqlDate = Calendar.format(date);
              calendar.date = date;
              calendar.update();
              input.setSelectionRange(index, index);
              popup.update();
            };
            input.addEventListener("keydown", function(event) {
              if (popup.sqlDate) {
                if (event.key === "ArrowDown") {
                  keyChange(1);
                  event.preventDefault();
                } else if (event.key === "ArrowUp") {
                  keyChange(-1);
                  event.preventDefault();
                }
              }
            });
            input.addEventListener("mousedown", function() {
              popup.open();
            });
            input.addEventListener("focus", function() {
              popup.open();
            });
            input.addEventListener("focusout", function() {
              popup.close();
            });
          }
        })
      ];
    }
  });
}
