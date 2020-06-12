KarmaFieldMedia.tables.footer = function(manager) {
  return build({
    class: "table-footer",
    children: [
      build({
        class: "table-control",
        children: function() {
          return [
            build({
              tag: "button",
              class: "button",
              init: function(element, update) {
                element.innerText = "Save";
              }
            })
          ];
        }
      }),
      build({
        class: "table-pagination",
        init: function(element, update) {
          manager.renderPagination = update;
          // update();
        },
        children: function() {
          var maxPage = Math.ceil(manager.num/manager.ppp);
          return [
            build({
              class: "pagination-item num-item",
              text: function() {
                return manager.num+" items"
              }
            }),
            build({
              tag: "button",
              class: "pagination-item button",
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
            build({
              tag: "button",
              class: "pagination-item button",
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
            build({
              class: "pagination-item current-page",
              text: function() {

                return manager.page+"/ "+maxPage;
              }
            }),
            build({
              tag: "button",
              class: "pagination-item button",
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
            build({
              tag: "button",
              class: "pagination-item button",
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
      })
    ]
  });
}
