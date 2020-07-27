// KarmaFieldMedia.includes.icon = function(filename) {
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


KarmaFieldMedia.includes.icon = function(args) {
  args.class = "karma-icon";
  var element = build(args);
  if (args.url) {
    fetch(args.url).then(function(response) {
      return response.text();
    }).then(function(result) {
      element.innerHTML = result;
    });
  }
  return element;
}
