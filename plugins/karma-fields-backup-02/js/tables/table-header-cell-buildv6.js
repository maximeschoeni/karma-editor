KarmaFields.tables.headerCell = function(manager, column) {
  return KarmaFields.build_6({
    tag: "th",
    signature: true,
    init: function(element, render) {
      if (column.main) {
        element.classList.add("main");
      }
      render();
    },
    child: KarmaFields.build_6({
      class: "header-cell",
      signature: true,
      children: [
        KarmaFields.build_6({
          tag: "a",
          class: "header-cell-title",
          update: function(element) {
            element.innerText = column.title;
          }
        }),
        column.sortable && KarmaFields.build_6({
          tag: "a",
          class: "header-cell-order",
          child: KarmaFields.build({
            class: "order-icon change-order",
          }),
          init: function(a, update) {
            a.addEventListener("click", function() {
              manager.reorder(column.key, column.default_order);
              manager.request();
              update();
            });
            if (manager.options.orderby === column.key) {
              a.classList.add(manager.options.order);
            }
            update();
          }
        })
      ]
    })
  });
}
