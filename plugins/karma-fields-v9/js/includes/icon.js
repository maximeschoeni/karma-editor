
KarmaFields.includes.icon = function(url) {
  return {
    class: "karma-icon",
    norender: true,
    init: function(icon) {
      KarmaFields.getAsset(url).then(function(result) {
        requestAnimationFrame(function() {
          icon.element.innerHTML = result;
        });
      });
    }
  };
}
