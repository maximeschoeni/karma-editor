KarmaFields.tables.headerCell = function(manager, column) {
  return {
    tag: "th",
    init: function(element, update) {
      if (column.main) {
        element.classList.add("main");
      }
    },
    child: {
      class: "header-cell",
      children: [
        {
          tag: "a",
          class: "header-cell-title",
          text: column.title
        },
        column.sortable && {
          tag: "a",
          class: "header-cell-order",
          child: {
            class: "order-icon change-order",
          },
          init: function(a, render) {
            a.addEventListener("click", function() {
              manager.reorder(column.key, column.default_order);
              manager.request();
              render();
            });
          },
          update: function(a) {
            if (manager.options.orderby === column.key) {
              a.classList.add(manager.options.order);
            }
          }
        }
      ]
    }
  };
}
