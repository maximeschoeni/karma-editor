
KarmaFields.includes.icon = function(args) {
  var init = args.init;
  args.init = function(element, render) {
    if (init) {
      init(element, render, args);
    }
    if (args.url) {
      KarmaFields.getAsset(args.url).then(function(result) {
        requestAnimationFrame(function() {
          element.innerHTML = result;
        });
      });
    }
  }
  return args;
}
