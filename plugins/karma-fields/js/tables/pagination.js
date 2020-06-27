KarmaFieldMedia.tables.pagination = function(manager) {
  return build({
    class: "footer-group table-pagination",
    // init: function(element, update) {
    //   // manager.renderPagination = update;
    //   // update();
    // },
    children: function() {
      var maxPage = Math.ceil(manager.num/manager.ppp);
      return [
        // build({
        //   class: "num-item footer-item",
        //   text: function() {
        //     return manager.num+" items"
        //   }
        // }),
        manager.ppp > -1 && build({
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "«";
            if (manager.page === 1) {
              element.disabled = true;
            }
            element.addEventListener("click", function() {
              manager.page = 1;
              manager.request();
            });
          }
        }),
        manager.ppp > -1 && build({
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "‹";
            if (manager.page === 1) {
              element.disabled = true;
            }
            element.addEventListener("click", function() {
              manager.page = manager.page-1;
              manager.request();
            });
          }
        }),
        manager.ppp > -1 && build({
          class: "current-page footer-item",
          text: function() {
            return manager.page+"/ "+maxPage;
          }
        }),
        manager.ppp > -1 && build({
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "›";
            if (manager.page >= maxPage) {
              element.disabled = true;
            }
            element.addEventListener("click", function() {
              manager.page = manager.page+1;
              manager.request();
            });
          }
        }),
        manager.ppp > -1 && build({
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "»";
            if (manager.page >= maxPage - 1) {
              element.disabled = true;
            }
            element.addEventListener("click", function() {
              manager.page = maxPage;
              manager.request();
            });
          }
        })
      ];
    }
  });
}
