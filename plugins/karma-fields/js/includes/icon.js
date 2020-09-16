
KarmaFields.includes.icon = function(url) {
  return {
    class: "karma-icon",
    update: function(icon) {
      if (this.data.url !== url) {
        KarmaFields.getAsset(url).then(function(result) {
          requestAnimationFrame(function() {
            icon.element.innerHTML = result;
          });
        });
        this.data.url = url;
      }
    }
  };
}
