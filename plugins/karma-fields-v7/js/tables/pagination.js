KarmaFields.tables.pagination = function(manager) {
  return {
    class: "footer-group table-pagination",
    update: function(element, render, args) {
      var options = manager.history.read(["options"]);
      var ppp = parseInt(options.ppp || Number.MAX_SAFE_INTEGER);
      var page = parseInt(options.page || 1);
      var num = parseInt(manager.history.read(["table", "count"]) || 0);

      args.children = [
        {
          tag: "p",
          class: "footer-item",
          update: function(element) {
            element.textContent = num ? num+" items" : "";
          }
        },
        {
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "«";
            element.addEventListener("click", function() {
              // manager.options.page = 1;
              manager.history.write(["options", "page"], 1);
              manager.request();
            });
          },
          update: function(element) {
            element.style.display = num > ppp ? "block" : "none";
            element.disabled = (page === 1);
          }
        },
        {
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "‹";
            if (page === 1) {
              element.disabled = true;
            }
            element.addEventListener("click", function() {
              manager.history.write(["options", "page"], page-1);
              manager.request();
            });
          },
          update: function(element) {
            element.style.display = num > ppp ? "block" : "none";
            element.disabled = (page === 1);
          }
        },
        {
          class: "current-page footer-item",
          update: function(element) {
            element.style.display = num > ppp ? "block" : "none";
            element.textContent = num && page+" / "+Math.ceil(num/ppp) || "";
          }
        },
        {
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "›";
            element.addEventListener("click", function() {
              manager.history.write(["options", "page"], page+1);
              manager.request();
            });
          },
          update: function(element) {
            element.style.display = num > ppp ? "block" : "none";
            element.disabled = page >= Math.ceil(num/ppp);
          }
        },
        {
          tag: "button",
          class: "button footer-item",
          init: function(element) {
            element.innerText = "»";
            element.addEventListener("click", function() {
              // manager.options.page = maxPage;
              manager.history.write(["options", "page"], Math.ceil(num/ppp));
              manager.request();
            });
          },
          update: function(element) {
            element.style.display = num > ppp ? "block" : "none";
            element.disabled = page >= Math.ceil(num/ppp);
          }
        }
      ];
    }
  };
}
