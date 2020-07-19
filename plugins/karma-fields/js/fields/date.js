/**
 * version mai2020
 */

KarmaFieldMedia.fields.date = function(field) {
  var format = field.resource.format || "dd/mm/yyyy";
  var dateManager = {};
  dateManager.calendar = Calendar.create();

  return build({
   class: "karma-field date-input",
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
        class: "date-input-container",
        children: function() {
          return [
            build({
              class: "date-popup-container",
              child: function(isOpen) {
                return isOpen && build({
                  class: "karma-popup",
                  child: build({
                    class: "karma-calendar",
                    init: function(element, update) {
                      dateManager.calendar.onUpdate = function(days) {
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
                                            dateManager.calendar.changeMonth(-1);
                                          });
                                          update();
                                        }
                                      }),
                                      build({
                                        class: "karma-current-month",
                                        text: function() {
                                          return Calendar.format(dateManager.calendar.date, "%fullmonth% yyyy");
                                        }
                                      }),
                                      build({
                                        class: "karma-next-month karma-calendar-arrow",
                                        text: function() {
                                          return " &rsaquo;";
                                        },
                                        init: function(arrow, update) {
                                          arrow.addEventListener("mouseup", function() {
                                            dateManager.calendar.changeMonth(1);
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
                                            if (dateManager.sqlDate === day.sqlDate) {
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
                                              dateManager.sqlDate = day.sqlDate;
                                              dateManager.update();

                                              field.set(dateManager.sqlDate).then(function() {
                                								if (field.isModified != field.wasModified) {
                                									field.history.save();
                                								}
                                								field.save();
                                							});

                                              dateManager.close();
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
                dateManager.open = function() {
                  update(true);
                  dateManager.calendar.update();
                  if (container.getBoundingClientRect().top+window.pageYOffset < 308) {
                    container.classList.add("open-down");
                  } else {
                    container.classList.remove("open-down");
                  }
                };
                dateManager.close = function() {
                  update();
                };
              }
            }),
            build({
              tag: "input",
              class: "karma-field-input",
              init: function(input) {
                // field.input = input;
                input.type = "text";
                input.id = field.id;

                dateManager.update = function() {
                  if (dateManager.sqlDate) {
                    var date = Calendar.parse(dateManager.sqlDate);
                    input.value = Calendar.format(date, format);
                  }
                };
                // field.onDefault = function(value) {
    						// 	input.placeholder = value && Calendar.parse(value) || field.resource.placeholder && Calendar.parse(field.resource.placeholder) || "";
    						// }
    						// field.onUpdate = function(value) {
                //   dateManager.sqlDate = value;
                //   dateManager.calendar.date = value && Calendar.parse(value) || new Date();
                //   dateManager.update();
    						// }
                field.fetch().then(function(value) {
                  if (!value && field.resource.default === "now") {
                    value = Calendar.format(new Date());
                  }
                  dateManager.sqlDate = value;
                  dateManager.calendar.date = value && Calendar.parse(value) || new Date();
                  dateManager.update();
    						});
    						field.fetchPlaceholder().then(function(value) {
    							input.placeholder = value || "";
    						});

    						field.onFocus = function() {
    							input.focus();
    						}
    						field.onBlur = function() {
    							input.blur();
    						}


                input.addEventListener("keyup", function() {
                  var date = Calendar.parse(this.value, format);
                  if (date) {
                    dateManager.calendar.date = date;
                    dateManager.sqlDate = Calendar.format(date);
                    dateManager.calendar.update();
                    dateManager.update();
                  } else {
                    dateManager.sqlDate = '';
                  }
                  field.set(dateManager.sqlDate).then(function() {
    								if (field.isModified != field.wasModified) {
    									field.history.save();
    								}
    								field.save();
    							});
                });

                var keyChange = function(dir) {
                  var index = input.selectionStart || 0;
                  var date = Calendar.parse(dateManager.sqlDate);
                  if (format[index] === "y" || format[index-1] === "y") date.setFullYear(date.getFullYear() + dir);
                  else if (format[index] === "m" || format[index-1] === "m") date.setMonth(date.getMonth() + dir);
                  else if (format[index] === "d" || format[index-1] === "d") date.setDate(date.getDate() + dir);
                  input.value = Calendar.format(date, format);
                  dateManager.sqlDate = Calendar.format(date);
                  dateManager.calendar.date = date;
                  dateManager.calendar.update();
                  input.setSelectionRange(index, index);
                  dateManager.update();
                };
                input.addEventListener("keydown", function(event) {
                  if (dateManager.sqlDate) {
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
                  dateManager.open();
                });
                input.addEventListener("focus", function() {
                  dateManager.open();
                });
                input.addEventListener("focusout", function() {
                  dateManager.close();
                });
                // input.addEventListener("blur", function() {
    						// 	field.blur();
    						// });
              }
            })
          ];
        }
      })
    ];
   }
  });
}
