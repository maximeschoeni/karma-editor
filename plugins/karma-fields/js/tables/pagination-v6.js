KarmaFields.tables.pagination = function(manager) {
  return KarmaFields.build({
    class: "footer-group table-pagination",
    // init: function(element, update) {
    //   // manager.renderPagination = update;
    //   // update();
    // },
    children: function() {
      var ppp = manager.options.ppp || Infinity;
      var maxPage = Math.ceil(manager.num/ppp);
      return [
        // KarmaFields.build({
        //   class: "num-item footer-item",
        //   text: function() {
        //     return manager.num+" items"
        //   }
        // }),
        KarmaFields.build({
          tag: "p",
          class: "footer-item",
          text: function() {
            return manager.num+" items";
          }
        }),
        manager.num > ppp && KarmaFields.build({
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "«";
            if (manager.options.page === 1) {
              element.disabled = true;
            }
            element.addEventListener("click", function() {
              manager.options.page = 1;
              manager.request();
            });
          }
        }),
        manager.num > ppp && KarmaFields.build({
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "‹";
            if (manager.options.page === 1) {
              element.disabled = true;
            }
            element.addEventListener("click", function() {
              manager.options.page = (manager.options.page || 1)-1;
              manager.request();
            });
          }
        }),
        manager.num > ppp && KarmaFields.build({
          class: "current-page footer-item",
          text: function() {
            return (manager.options.page || 1)+" / "+maxPage;
          }
        }),
        manager.num > ppp && KarmaFields.build({
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "›";
            if (manager.options.page >= maxPage) {
              element.disabled = true;
            }
            element.addEventListener("click", function() {
              manager.options.page = (manager.options.page || 1)+1;
              manager.request();
            });
          }
        }),
        manager.num > ppp && KarmaFields.build({
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "»";
            if (manager.options.page >= maxPage - 1) {
              element.disabled = true;
            }
            element.addEventListener("click", function() {
              manager.options.page = maxPage;
              manager.request();
            });
          }
        })
      ];
    }
  });
}
