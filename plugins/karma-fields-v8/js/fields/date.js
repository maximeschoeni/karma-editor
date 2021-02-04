/**
 * version sept2020
 */


// KarmaFields.wm.date = new WeakMap();

KarmaFields.fields.date = function(field) {

  let date;

  return {
    className: "karma-field-date",
    // update: function() {
    //   console.log(field.uri, this);
    // },

    init: function(container) {
      field.fetchValue().then(function() {
        container.render();
      });
    },
    update: function(container) {
      var format = field.resource.format || "dd/mm/yyyy";

      this.state = Math.random()*9999999; // -> compat



      container.kids = [
        {
          className: "date-popup-container",

          update: function(popup) {
            this.classList.toggle("open-down", this.getBoundingClientRect().top+window.pageYOffset < 500);

            // var value = field.getValue();
            // var date = value && KarmaFields.Calendar.parse(value) || new Date();
            // console.log(date);


            this.kids = date && [{
              className: "karma-popup",
              init: function() {
                // prevent closing
                this.onmousedown = function(event) {
                  event.preventDefault();
                };
              },
              kids: [{
                className: "karma-calendar",
                kids: [{
                  className: "karma-calendar-content",
                  kids: [
                    {
                      className: "karma-calendar-header",
                      kids: [{
                        className: "karma-calendar-nav",
                        kids: [
                          {
                            className: "karma-prev-month karma-calendar-arrow",
                            init: function() {
                              this.innerHTML = "&lsaquo;";
                              this.addEventListener("mouseup", function() {
                                // console.log("mouseup", date);

                                date.setMonth(date.getMonth()-1);
                                popup.render();
                              });
                            }
                          },
                          {
                            className: "karma-current-month",
                            update: function() {
                              this.textContent = KarmaFields.Calendar.format(date, "%fullmonth% yyyy");
                            }
                          },
                          {
                            className: "karma-next-month karma-calendar-arrow",
                            init: function() {
                              this.innerHTML = "&rsaquo;";
                              this.addEventListener("mouseup", function() {
                                date.setMonth(date.getMonth()+1);
                                popup.render();
                              });
                            }
                          }
                        ]
                      }]
                    },
                    {
                      className: "karma-calendar-body",
                      clear: true,
                      update: function(body) {
                        var days = KarmaFields.Calendar.getMonthDays(date);
                        var value = field.getValue();
                        var rows = [];
                        while(days.length) {
                          rows.push(days.splice(0, 7));
                        }
                        this.kids = [
                          {
                            tag: "ul",
                            className: "calendar-days-title",
                            kids: rows[0].map(function(day) {
                              return {
                                tag: "li",
                                update: function() {
                                  this.textContent = KarmaFields.Calendar.format(day.date, "%d2%");
                                }
                              };
                            })
                          }
                        ].concat(rows.map(function(row) {
                          return {
                            tag: "ul",
                            className: "calendar-days-content",
                            kids: row.map(function(day) {
                              return {
                                tag: "li",
                                kids: [{
                                  tag: "span",
                                  update: function() {
                                    this.textContent = KarmaFields.Calendar.format(day.date, "#d");
                                  }
                                }],
                                init: function(item) {
                                  this.onmouseup = function(event) {
                                    event.preventDefault();
                                    if (item.day) {
                                      // var date = KarmaFields.wm.date.get(container);

                                      field.setValue(item.day.sqlDate);
                                      // container.classList.remove("open");

                                      // KarmaFields.wm.date.delete(container);
                                      date = null;

                                      container.render();
                                    }
                                  }
                                },
                                update: function() {

                                  this.classList.toggle("active", value === day.sqlDate);
                                  this.classList.toggle("offset", day.isOffset);
                                  this.classList.toggle("today", day.isToday);
                                  this.day = day;
                                }
                              };
                            })
                          };
                        }));
                      }
                    }
                  ]
                }]
              }]
            }];
          }
        },
        {
          tag: "input",
          className: "text karma-field-input",
          init: function(input) {
            // field.input = input;
            this.type = "text";
            this.id = field.getId();

            if (field.resource.readonly) {
              this.readOnly = true;
            } else {
              this.addEventListener("keyup", function() {
                let inputDate = KarmaFields.Calendar.parse(this.value, format);
                if (inputDate) {
                  date = inputDate;
                  var sqlDate = KarmaFields.Calendar.format(date);
                  field.setValue(sqlDate);
                  container.render();
                }
                this.classList.toggle("valid-date", inputDate);
              });

              var keyChange = function(dir) {
                var value = field.getValue();
                date = KarmaFields.Calendar.parse(value);
                var index = input.selectionStart || 0;
                if (format[index] === "y" || format[index-1] === "y") {
                  date.setFullYear(date.getFullYear() + dir);
                } else if (format[index] === "m" || format[index-1] === "m") {
                  date.setMonth(date.getMonth() + dir);
                } else if (format[index] === "d" || format[index-1] === "d") {
                  date.setDate(date.getDate() + dir);
                }

                input.setSelectionRange(index, index);
                var sqlDate = KarmaFields.Calendar.format(date);
                field.setValue(sqlDate);
                container.render();
              };
              this.addEventListener("keydown", function(event) {
                if (event.key === "ArrowDown") {
                  keyChange(1);
                  event.preventDefault();
                } else if (event.key === "ArrowUp") {
                  keyChange(-1);
                  event.preventDefault();
                }
              });
              this.addEventListener("mousedown", function() {
                var value = field.getValue();
                date = value && KarmaFields.Calendar.parse(value) || new Date();
                container.render();
              });
              this.addEventListener("focus", function() {
                var value = field.getValue();
                date = value && KarmaFields.Calendar.parse(value) || new Date();
                container.render();
              });
              this.addEventListener("focusout", function() {

                date = null;
                if (!KarmaFields.Calendar.parse(this.value, format)) {
                  field.setValue("");
                }
                container.render();
              });
            }
          },
          update: function() {
            var value = field.getValue();
            var date = value && KarmaFields.Calendar.parse(value);
            this.value = date && KarmaFields.Calendar.format(date, format) || "";
            

          }
        }
      ];

    }
  };
}
