KarmaFields.tables.pagination = function(manager) {
  return {
    class: "footer-group table-pagination",
    children: [
      {
        tag: "p",
        class: "footer-item",
        update: function(element) {
          element.textContent = manager.num ? manager.num+" items" : "";
        }
      },
      {
        tag: "button",
        class: "button footer-item",
        init: function(element) {
          element.innerText = "«";
          element.addEventListener("click", function() {
            manager.options.page = 1;
            manager.request();
          });
        },
        update: function(element) {
          element.style.display = manager.options.ppp && manager.num > manager.options.ppp ? "block" : "none";
          element.disabled = (manager.options.page === 1);
        }
      },
      {
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
        },
        update: function(element) {
          element.style.display = manager.options.ppp && manager.num > manager.options.ppp ? "block" : "none";
          element.disabled = (manager.options.page === 1);
        }
      },
      {
        class: "current-page footer-item",
        update: function(element) {
          element.style.display = manager.options.ppp && manager.num > manager.options.ppp ? "block" : "none";
          element.textContent = manager.options.ppp && (manager.options.page || 1)+" / "+Math.ceil(manager.num/manager.options.ppp) || "";
        }
      },
      {
        tag: "button",
        class: "button footer-item",
        init: function(element) {
          element.innerText = "›";
          element.addEventListener("click", function() {
            manager.options.page = (manager.options.page || 1)+1;
            manager.request();
          });
        },
        update: function(element) {
          element.style.display = manager.options.ppp && manager.num > manager.options.ppp ? "block" : "none";
          element.disabled = !manager.options.ppp || manager.options.page >= Math.ceil(manager.num/manager.options.ppp);
        }
      },
      {
        tag: "button",
        class: "button footer-item",
        init: function(element) {
          element.innerText = "»";
          element.addEventListener("click", function() {
            manager.options.page = maxPage;
            manager.request();
          });
        },
        update: function(element) {
          element.style.display = manager.options.ppp && manager.num > manager.options.ppp ? "block" : "none";
          element.disabled = !manager.options.ppp || manager.options.page >= Math.ceil(manager.num/manager.options.ppp);
        }
      }
    ]
  };
}
