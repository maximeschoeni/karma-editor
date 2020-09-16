/**
 * version sept2020
 */

KarmaFields.fields.date = function(field) {
  var format = field.resource.format || "dd/mm/yyyy";

  var manager = {};

  return {
    class: "karma-field-date",
    init: function(element, render, args) {
      field.fetchValue().then(function() {
        args.children = [
          {
            class: "date-popup-container",
            update: function(element, renderPopup, args) {
              element.classList.toggle("open-down", element.getBoundingClientRect().top+window.pageYOffset < 500);
              var value = field.getValue();
              args.child = manager.date && {
                class: "karma-popup",
                init: function(element) {
                  // prevent closing
                  element.onmousedown = function(event) {
                    event.preventDefault();
                  };
                },
                child: {
                  class: "karma-calendar",
                  child: {
                    class: "karma-calendar-content",
                    children: [
                      {
                        class: "karma-calendar-header",
                        child: {
                          class: "karma-calendar-nav",
                          children: [
                            {
                              class: "karma-prev-month karma-calendar-arrow",
                              init: function(arrow) {
                                arrow.innerHTML = "&lsaquo;";
                                arrow.addEventListener("mouseup", function() {
                                  manager.date.setMonth(manager.date.getMonth()-1);
                                  renderPopup();
                                });
                              }
                            },
                            {
                              class: "karma-current-month",
                              update: function(element) {
                                element.textContent = KarmaFields.Calendar.format(manager.date, "%fullmonth% yyyy");
                              }
                            },
                            {
                              class: "karma-next-month karma-calendar-arrow",
                              init: function(arrow) {
                                arrow.innerHTML = "&rsaquo;";
                                arrow.addEventListener("mouseup", function() {
                                  manager.date.setMonth(manager.date.getMonth()+1);
                                  renderPopup();
                                });
                              }
                            }
                          ]
                        }
                      },
                      {
                        class: "karma-calendar-body",
                        update: function(element, renderBody, args) {
                          var days = KarmaFields.Calendar.getMonthDays(manager.date);
                          var rows = [];
                          while(days.length) {
                            rows.push(days.splice(0, 7));
                          }
                          args.children = [
                            {
                              tag: "ul",
                              class: "calendar-days-title",
                              children: rows[0].map(function(day) {
                                return {
                                  tag: "li",
                                  update: function(element) {
                                    element.textContent = KarmaFields.Calendar.format(day.date, "%d2%");
                                  }
                                };
                              })
                            }
                          ].concat(rows.map(function(row) {
                            return {
                              tag: "ul",
                              class: "calendar-days-content",
                              children: row.map(function(day) {
                                return {
                                  tag: "li",
                                  child: {
                                    tag: "span",
                                    update: function(element) {
                                      element.textContent = KarmaFields.Calendar.format(day.date, "#d");
                                    }
                                  },
                                  init: function(li, update) {
                                    li.onmouseup = function(event) {
                                      event.preventDefault();
                                      field.setValue(day.sqlDate);
                                      console.log(day.sqlDate);
                                      manager.date = null;
                                      render();
                                    }
                                  },
                                  update: function(li, update) {
                                    li.classList.toggle("active", value === day.sqlDate);
                                    li.classList.toggle("offset", day.isOffset);
                                    li.classList.toggle("today", day.isToday);
                                  }
                                };
                              })
                            };
                          }));
                        }
                      }
                    ]
                  }
                }
              };
            }
          },
          {
            tag: "input",
            class: "text karma-field-input",
            init: function(input) {
              // field.input = input;
              input.type = "text";
              input.id = field.id;

              if (field.resource.readonly) {
                input.readOnly = true;
              } else {
                input.addEventListener("keyup", function() {
                  var date = KarmaFields.Calendar.parse(this.value, format);
                  if (date) {
                    var sqlDate = KarmaFields.Calendar.format(date);
                    field.setValue(sqlDate);
                    render();
                  }
                  input.classList.toggle("valid-date", date);
                });

                var keyChange = function(dir) {
                  var value = field.getValue();
                  var date = KarmaFields.Calendar.parse(value);
                  var index = input.selectionStart || 0;
                  if (format[index] === "y" || format[index-1] === "y") {
                    date.setFullYear(date.getFullYear() + dir);
                  } else if (format[index] === "m" || format[index-1] === "m") {
                    date.setMonth(date.getMonth() + dir);
                  } else if (format[index] === "d" || format[index-1] === "d") {
                    date.setDate(date.getDate() + dir);
                  }
                  // input.value = KarmaFields.Calendar.format(date, format);

                  input.setSelectionRange(index, index);
                  var sqlDate = KarmaFields.Calendar.format(date);
                  field.setValue(sqlDate);
                  render();
                };
                input.addEventListener("keydown", function(event) {
                  if (event.key === "ArrowDown") {
                    keyChange(1);
                    event.preventDefault();
                  } else if (event.key === "ArrowUp") {
                    keyChange(-1);
                    event.preventDefault();
                  }
                });
                input.addEventListener("mousedown", function() {
                  var sqlDate = field.getValue();
                  manager.date = sqlDate && KarmaFields.Calendar.parse(sqlDate) || new Date();
                  render();
                });
                input.addEventListener("focus", function() {
                  var sqlDate = field.getValue();
                  manager.date = sqlDate && KarmaFields.Calendar.parse(sqlDate) || new Date();
                  render();
                });
                input.addEventListener("focusout", function() {
                  manager.date = null;
                  render();
                });
              }
            },
            update: function(input) {
              var value = field.getValue();
              var date = value && KarmaFields.Calendar.parse(value);
              if (date) {
                input.value = KarmaFields.Calendar.format(date, format);
              }
            }
          }
        ];
        render();
      });
    }
  };
}
