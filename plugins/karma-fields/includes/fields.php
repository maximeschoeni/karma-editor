<div id="karma-fields-field-container-<?php echo $index; ?>" class="karma-fields"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-input-<?php echo $index; ?>">
<script>
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-field-container-<?php echo $index; ?>");
		var input = document.getElementById("karma-fields-input-<?php echo $index; ?>");
		var post = {uri: "<?php echo $uri ?>"};
		var resources =  <?php echo json_encode($resources); ?>;
		var middleware = "<?php echo $middleware ?>";

		var history = KarmaFieldMedia.managers.history();
		var fieldManager;
		// var field;


		fieldManager = KarmaFieldMedia.managers.field(resources, post, middleware, history);
		fieldManager.onUpdateState = function(state) {
			// console.trace();
			// console.log(state);
			input.value = JSON.stringify(state);
		};
		container.appendChild(fieldManager.build());

		history.onUpdate = function() {
			fieldManager.update();
		};

		// function() {
		//
		// 	if () {
		// 		fieldManager.onUpdate();
		// 	}
		//
		//
		// 	// if (field) {
		// 	// 	container.removeChild(field);
		// 	// }
		// 	// fieldManager = KarmaFieldMedia.managers.field(resources, post, middleware, history);
		// 	// fieldManager.onUpdateState = function(state) {
		// 	// 	// console.trace();
		// 	// 	// console.log(state);
		// 	// 	input.value = JSON.stringify(state);
		// 	// };
		// 	// fieldManager.build().then(function(element) {
		// 	// 	field = element;
		// 	// 	container.appendChild(field);
		// 	// });
		//
		// }

		container.addEventListener("focusin", function() {
			KarmaFieldMedia.events.onUndo = function(event) {
				history.undo();
				event.preventDefault();
			}
			KarmaFieldMedia.events.onRedo = function(event) {
				history.redo();
				event.preventDefault();
			}
		});


// setTimeout(function() {
// 	history.onUpdate();
// }, 2000);


	});
</script>
