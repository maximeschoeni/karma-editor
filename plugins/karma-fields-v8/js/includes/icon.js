
KarmaFields.includes.icon = function(icon) {
  return {
    className: "karma-icon",
    render: function() {
      if (icon.file !== this.current_url) {
        let element = this;
        KarmaFields.getAsset(icon.file).then(function(result) {
          requestAnimationFrame(function() {
            element.innerHTML = result;
          });
        });
        this.currentUrl = icon.file;
      }
    }
  };
}
