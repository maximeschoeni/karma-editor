/**
 * version mai2020
 */

KarmaFields.fields.date = function(field) {
  var format = field.resource.format || "dd/mm/yyyy";
  var dateManager = {};
  dateManager.calendar = KarmaFields.Calendar.create();

// console.log(KarmaFields.Calendar.format(new Date(), "dd/mm/yyyy"));

  var isOpen = false;
  // return KarmaFields.build({
  //  class: "karma-field date-input",
  //  children: function() {
  //   return [
  //     field.resource.label && KarmaFields.build({
  //       tag: "label",
  //       init: function(label) {
  //         label.htmlFor = field.id
  //         label.innerHTML = field.resource.label;
  //       }
  //     }),
      return KarmaFields.build({
        class: "karma-field-date",
        children: function() {
          return [
            KarmaFields.build({
              class: "date-popup-container",
              init: function(container, update) {
                dateManager.open = function() {
                  if (!isOpen) {
                    isOpen = true;
                    update();
                    if (container.getBoundingClientRect().top+window.pageYOffset < 500) {
                      container.classList.add("open-down");
                    } else {
                      container.classList.remove("open-down");
                    }
                  }

                };
                dateManager.close = function() {
                  if (isOpen) {
                    isOpen = false;
                    update();
                  }
                };
              },
              child: function() {

                return isOpen && KarmaFields.build({
                  class: "karma-popup",
                  init: function(element, update) {
                    // prevent closing
                    element.onmousedown = function(event) {
                      event.preventDefault();
                    };
                    update();
                  },
                  child: function() {
                    return KarmaFields.build({
                      class: "karma-calendar",
                      init: function(element, update) {
                        dateManager.calendar.onUpdate = function(days) {
                          var rows = [];
                          while(days.length) {
                            rows.push(days.splice(0, 7));
                          }
                          update(rows);
                        }
                        dateManager.calendar.update();
                      },
                      child: function(rows) {
                        return KarmaFields.build({
                          class: "karma-calendar-content",
                          children: function() {
                            return [
                              KarmaFields.build({
                                class: "karma-calendar-header",
                                child: function() {
                                  return KarmaFields.build({
                                    class: "karma-calendar-nav",
                                    children: function() {
                                      return [
                                        KarmaFields.build({
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
                                        KarmaFields.build({
                                          class: "karma-current-month",
                                          text: function() {
                                            return KarmaFields.Calendar.format(dateManager.calendar.date, "%fullmonth% yyyy");
                                          }
                                        }),
                                        KarmaFields.build({
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
                              KarmaFields.build({
                                class: "karma-calendar-body",
                                children: function() {
                                  return [
                                    KarmaFields.build({
                                      tag: "ul",
                                      class: "calendar-days-title",
                                      children: function() {
                                        return rows[0].map(function(day) {
                                          return KarmaFields.build({
                                            tag: "li",
                                            text: function() {
                                              return KarmaFields.Calendar.format(day.date, "%d2%");
                                            }
                                          });
                                        });
                                      }
                                    })
                                  ].concat(rows.map(function(row) {
                                    return KarmaFields.build({
                                      tag: "ul",
                                      class: "calendar-days-content",
                                      children: function() {
                                        return row.map(function(day) {
                                          return KarmaFields.build({
                                            tag: "li",
                                            child: function() {
                                              return KarmaFields.build({
                                                tag: "span",
                                                text: function() {
                                                  return KarmaFields.Calendar.format(day.date, "#d");
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

                                                if (field.isDifferent(dateManager.sqlDate)) {
                                                  field.history.save();
                                                }
                                                field.set(dateManager.sqlDate);

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
                    });
                  }
                });
              }
            }),
            KarmaFields.build({
              tag: "input",
              class: "text karma-field-input",
              init: function(input) {
                // field.input = input;
                input.type = "text";
                input.id = field.id;

                dateManager.update = function() {
                  if (dateManager.sqlDate) {
                    var date = KarmaFields.Calendar.parse(dateManager.sqlDate);
                    input.value = KarmaFields.Calendar.format(date, format);
                  }
                };
                // field.onDefault = function(value) {
    						// 	input.placeholder = value && KarmaFields.Calendar.parse(value) || field.resource.placeholder && KarmaFields.Calendar.parse(field.resource.placeholder) || "";
    						// }
    						// field.onUpdate = function(value) {
                //   dateManager.sqlDate = value;
                //   dateManager.calendar.date = value && KarmaFields.Calendar.parse(value) || new Date();
                //   dateManager.update();
    						// }
                // field.fetch().then(function(value) {
                //   if (!value && field.resource.default === "now") {
                //     value = KarmaFields.Calendar.format(new Date());
                //   }
                //   dateManager.sqlDate = value;
                //   dateManager.calendar.date = value && KarmaFields.Calendar.parse(value) || new Date();
                //   dateManager.update();
    						// });
    						// field.fetchPlaceholder().then(function(value) {
    						// 	input.placeholder = value || "";
    						// });
                field.onUpdate = function(value) {
                  if (value && value.length < 19) {
                    value += ("0000-00-00 00:00:00").slice(value.length);
                  }
                  dateManager.sqlDate = value;
                  dateManager.calendar.date = value && KarmaFields.Calendar.parse(value) || new Date();
                  dateManager.update();
                }
                field.onInherit = function(value) {
                  input.placeholder = value || "";
                }
                field.fetch().then(field.onUpdate);

    						field.onFocus = function() {
    							input.focus();
    						}
    						field.onBlur = function() {
    							input.blur();
    						}

                if (field.resource.readonly) {
          				input.readOnly = true;
          			} else {


                  input.addEventListener("keyup", function() {
                    var date = KarmaFields.Calendar.parse(this.value, format);
                    if (date) {
                      dateManager.calendar.date = date;
                      dateManager.sqlDate = KarmaFields.Calendar.format(date);
                      dateManager.calendar.update();
                      dateManager.update();
                    } else {
                      dateManager.sqlDate = '';
                    }
                    if (field.isModified(dateManager.sqlDate)) {
                      field.history.save();
                    }
                    field.set(dateManager.sqlDate);
                  });

                  var keyChange = function(dir) {
                    var index = input.selectionStart || 0;
                    var date = KarmaFields.Calendar.parse(dateManager.sqlDate);
                    if (format[index] === "y" || format[index-1] === "y") date.setFullYear(date.getFullYear() + dir);
                    else if (format[index] === "m" || format[index-1] === "m") date.setMonth(date.getMonth() + dir);
                    else if (format[index] === "d" || format[index-1] === "d") date.setDate(date.getDate() + dir);
                    input.value = KarmaFields.Calendar.format(date, format);
                    dateManager.sqlDate = KarmaFields.Calendar.format(date);
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
                }
                // input.addEventListener("blur", function() {
    						// 	field.blur();
    						// });
              }
            })
          ];
        }
      });
  //   ];
  //  }
  // });
}
