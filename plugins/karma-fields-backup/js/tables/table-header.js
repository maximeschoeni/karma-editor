KarmaFields.tables.header = function(manager) {
  manager.resource.filters.filter(function(filter) {
    return filter.type === "hidden";
  }).map(function(filter) {
    var filterManager = KarmaFields.managers.filter(manager, filter);
    manager.filters[filter.key] = filterManager;
  });

  return KarmaFields.build({
    class: "table-header",
    children: function() {
      return [
        KarmaFields.build({
          tag: "h1",
          text: function() {
            return manager.resource.title;
          }
        }),
        KarmaFields.build({
          class: "table-header-row",
          children: function() {
            return [
              KarmaFields.build({
                class: "table-header-status",
                children: function() {
                  return manager.resource.filters.filter(function(filter) {
                    return filter.type === "primary";
                  }).map(function(filter) {
                    // return manager.buildFilter(filter);
                    var filterManager = KarmaFields.managers.filter(manager, filter);
                    manager.filters[filter.key] = filterManager;
                    return filterManager.build();
                  });
                }
              })
            ];
          }
        }),
        KarmaFields.build({
          class: "table-header-row",
          children: function() {
            return [
              KarmaFields.build({
                class: "table-header-status",
                children: function() {
                  return manager.resource.filters.filter(function(filter) {
                    return !filter.type || filter.type === "secondary";
                  }).map(function(filter) {
                    // return manager.buildFilter(filter);
                    var filterManager = KarmaFields.managers.filter(manager, filter);
                    manager.filters[filter.key] = filterManager;
                    return filterManager.build();
                  });
                }
              }),
              KarmaFields.build({
                class: "table-header-search",
                child: function() {
                  return KarmaFields.filters.search(manager);
                  //return manager.buildSearch("poststatus");
                }
              })
            ];
          }
        })
      ];
    }
  });
}
