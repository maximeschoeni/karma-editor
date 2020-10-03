KarmaFields.tables.headerCell = function(manager, column) {
  return KarmaFields.build({
    tag: "th",
    init: function(element, update) {
      if (column.main) {
        element.classList.add("main");
      }
      update();
    },
    child: function() {
      return KarmaFields.build({
        class: "header-cell",
        children: function() {
          return [
            KarmaFields.build({
              tag: "a",
              class: "header-cell-title",
              text: function() {
                return column.title;
              }
            }),
            column.sortable && KarmaFields.build({
              tag: "a",
              class: "header-cell-order",
              children: function() {
                return [
                  KarmaFields.build({
                    class: "order-icon change-order",
                    init: function(element) {
                      // var url = KarmaFields.icons_url+"/sort.svg";
                      // element.style.backgroundImage = "url("+url+")";
                      // fetch(url, {
                      //   cache: "force-cache"
                      // }).then(function(response) {
                      // 	return response.text();
                      // }).then(function(svg) {
                      //   element.innerHTML = svg;
                      // });
                    }
                  })
                  // KarmaFields.build({
                  //   class: "order-icon order-up",
                  //   init: function(element) {
                  //     var url = KarmaFields.icons_url+"/arrow-up.svg";
                  //     element.style.backgroundImage = "url("+url+")";
                  //     // fetch(url, {
                  //     //   cache: "force-cache"
                  //     // }).then(function(response) {
                  //     // 	return response.text();
                  //     // }).then(function(svg) {
                  //     //   element.innerHTML = svg;
                  //     // });
                  //   }
                  // }),
                  // KarmaFields.build({
                  //   class: "order-icon order-down",
                  //   init: function(element) {
                  //     var url = KarmaFields.icons_url+"/arrow-down.svg";
                  //     element.style.backgroundImage = "url("+url+")";
                  //     // fetch(url, {
                  //     //   cache: "force-cache"
                  //     // }).then(function(response) {
                  //     // 	return response.text();
                  //     // }).then(function(svg) {
                  //     //   element.innerHTML = svg;
                  //     // });
                  //   }
                  // })
                ];
              },
              init: function(a, update) {
                a.addEventListener("click", function() {
                  manager.reorder(column.key, column.default_order);
                  // if (manager.orderby === column.key) {
                  //   if (manager.order === "asc") {
                  //     manager.order = "desc";
                  //   } else {
                  //     manager.order = "asc";
                  //   }
                  // } else {
                  //   manager.orderby = column.key;
                  //   manager.order = column.default_order || "asc";
                  // }
                  manager.request();
                  update();
                });
                if (manager.options.orderby === column.key) {
                  a.classList.add(manager.options.order);
                }
                update();
              }
            })
          ];
        }
      })
    }
  });
}
