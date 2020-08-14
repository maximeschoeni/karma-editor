KarmaFields.tables.gridCell = function(manager, post, column) {
  return KarmaFields.build({
    tag: "td",
    child: function() {
      return KarmaFields.manager.field({
        middleware: manager.resource.middleware,
        key: column.key,
        field: column.field,
        object: column.type
      }, post).build();
    }
  });
}
