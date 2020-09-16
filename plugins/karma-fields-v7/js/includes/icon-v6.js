// KarmaFields.includes.icon = function(filename) {
//   return build({
//     class: "karma-icon",
//     init: function(element) {
//       fetch(KarmaFields.icons_url+"/"+filename).then(function(response) {
//         return response.text();
//       }).then(function(result) {
//         element.innerHTML = result;
//       });
//     }
//   });
// }


KarmaFields.includes.icon = function(args) {
  if (args.url && typeof args.url === "function") {
    args.text = function() {
      var url = args.url();
      if (!KarmaFields.assets[url]) {
        KarmaFields.assets[url] = fetch(url).then(function(response) {
          return response.text();
        });
      }
      return KarmaFields.assets[url];
    }
  }
  var element = KarmaFields.build(args);

  element.classList.add("karma-icon");

  // compat
  if (args.url && typeof args.url === "object") {
    if (!KarmaFields.assets[args.url]) {
      KarmaFields.assets[args.url] = fetch(args.url).then(function(response) {
        return response.text();
      });
    }
    KarmaFields.assets[args.url].then(function(result) {
      element.innerHTML = result;
    });
    // fetch(args.url).then(function(response) {
    //   return response.text();
    // }).then(function(result) {
    //   element.innerHTML = result;
    // });
  }
  return element;
}
