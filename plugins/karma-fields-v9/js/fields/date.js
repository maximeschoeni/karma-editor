/**
 * version sept2020
 */


KarmaFields.wm.date = new WeakMap();

KarmaFields.fields.date = function(field) {

  return {
    class: "karma-field-date",
    // update: function() {
    //   console.log(field.uri, this.element);
    // },

    init: function(container) {
      field.fetchValue().then(function() {
        container.render();
      });
    },
    update: function(container) {
      var format = field.resource.format || "dd/mm/yyyy";

      this.state = Math.random()*9999999; // -> compat



      container.children = [
        {
          class: "date-popup-container",
          update: function(popup) {
            this.element.classList.toggle("open-down", this.element.getBoundingClientRect().top+window.pageYOffset < 500);

            // var value = field.getValue();
            // var date = value && KarmaFields.Calendar.parse(value) || new Date();
            // console.log(date);


            this.child = KarmaFields.wm.date.has(container.element) && {
              class: "karma-popup",
              init: function() {
                // prevent closing
                this.element.onmousedown = function(event) {
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
                            init: function() {
                              this.element.innerHTML = "&lsaquo;";
                              this.element.addEventListener("mouseup", function() {
                                // console.log("mouseup", date);
                                var date = KarmaFields.wm.date.get(container.element);

                                date.setMonth(date.getMonth()-1);
                                popup.render();
                              });
                            }
                          },
                          {
                            class: "karma-current-month",
                            update: function() {
                              var date = KarmaFields.wm.date.get(container.element);
                              this.element.textContent = KarmaFields.Calendar.format(date, "%fullmonth% yyyy");
                            }
                          },
                          {
                            class: "karma-next-month karma-calendar-arrow",
                            init: function() {
                              this.element.innerHTML = "&rsaquo;";
                              this.element.addEventListener("mouseup", function() {
                                var date = KarmaFields.wm.date.get(container.element);
                                date.setMonth(date.getMonth()+1);
                                popup.render();
                              });
                            }
                          }
                        ]
                      }
                    },
                    {
                      class: "karma-calendar-body",
                      update: function(body) {
                        var date = KarmaFields.wm.date.get(container.element);
                        var days = KarmaFields.Calendar.getMonthDays(date);
                        var value = field.getValue();
                        var rows = [];
                        while(days.length) {
                          rows.push(days.splice(0, 7));
                        }
                        this.children = [
                          {
                            tag: "ul",
                            class: "calendar-days-title",
                            children: rows[0].map(function(day) {
                              return {
                                tag: "li",
                                update: function() {
                                  this.element.textContent = KarmaFields.Calendar.format(day.date, "%d2%");
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
                                  update: function() {
                                    this.element.textContent = KarmaFields.Calendar.format(day.date, "#d");
                                  }
                                },
                                init: function(item) {
                                  this.element.onmouseup = function(event) {
                                    event.preventDefault();
                                    if (item.element.day) {
                                      // var date = KarmaFields.wm.date.get(container.element);
                                      field.setValue(item.element.day.sqlDate);
                                      // container.element.classList.remove("open");

                                      KarmaFields.wm.date.delete(container.element);

                                      container.render();
                                    }
                                  }
                                },
                                update: function() {

                                  this.element.classList.toggle("active", value === day.sqlDate);
                                  this.element.classList.toggle("offset", day.isOffset);
                                  this.element.classList.toggle("today", day.isToday);
                                  this.element.day = day;
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
            this.element.type = "text";
            this.element.id = field.getId();

            if (field.resource.readonly) {
              this.element.readOnly = true;
            } else {
              this.element.addEventListener("keyup", function() {
                var date = KarmaFields.Calendar.parse(this.value, format);
                if (date) {
                  var sqlDate = KarmaFields.Calendar.format(date);
                  field.setValue(sqlDate);
                  container.render();
                }
                this.classList.toggle("valid-date", date);
              });

              var keyChange = function(dir) {
                var value = field.getValue();
                var date = KarmaFields.Calendar.parse(value);
                var index = input.element.selectionStart || 0;
                if (format[index] === "y" || format[index-1] === "y") {
                  date.setFullYear(date.getFullYear() + dir);
                } else if (format[index] === "m" || format[index-1] === "m") {
                  date.setMonth(date.getMonth() + dir);
                } else if (format[index] === "d" || format[index-1] === "d") {
                  date.setDate(date.getDate() + dir);
                }

                input.element.setSelectionRange(index, index);
                var sqlDate = KarmaFields.Calendar.format(date);
                field.setValue(sqlDate);
                container.render();
              };
              this.element.addEventListener("keydown", function(event) {
                if (event.key === "ArrowDown") {
                  keyChange(1);
                  event.preventDefault();
                } else if (event.key === "ArrowUp") {
                  keyChange(-1);
                  event.preventDefault();
                }
              });
              this.element.addEventListener("mousedown", function() {
                // container.element.classList.add("open");
                var value = field.getValue();
                var date = value && KarmaFields.Calendar.parse(value) || new Date();
                KarmaFields.wm.date.set(container.element, date);
                container.render();
              });
              this.element.addEventListener("focus", function() {
                // container.element.classList.add("open");
                var value = field.getValue();
                var date = value && KarmaFields.Calendar.parse(value) || new Date();
                KarmaFields.wm.date.set(container.element, date);
                container.render();
              });
              this.element.addEventListener("focusout", function() {
                // container.element.classList.remove("open");
                KarmaFields.wm.date.delete(container.element);

                var date = KarmaFields.Calendar.parse(this.value, format);
                if (!date) {
                  field.setValue("");
                }
                container.render();
              });
            }
          },
          update: function() {
            var value = field.getValue();
            var date = value && KarmaFields.Calendar.parse(value);

            this.element.value = date && KarmaFields.Calendar.format(date, format) || "";
          }
        }
      ];

    }
  };
}
