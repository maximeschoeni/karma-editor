KarmaFieldMedia.tables.gridCell = function(manager, post, column) {
  return build({
    tag: "td",
    child: function() {
      return KarmaFieldMedia.manager.field({
        middleware: manager.resource.middleware,
        key: column.key,
        field: column.field,
        object: column.type
      }, post).build();
    }
  });
}
