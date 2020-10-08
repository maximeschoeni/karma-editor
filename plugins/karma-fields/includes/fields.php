<div id="karma-fields-field-<?php echo $index; ?>-container" class="karma-fields"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-input-<?php echo $index; ?>">

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-field-<?php echo $index; ?>-container");
		var input = document.getElementById("karma-fields-input-<?php echo $index; ?>");
		var resource = <?php echo json_encode($args); ?>;
		var id = <?php echo $id; ?>;
		var history = KarmaFields.History.createInstance();

		window.fieldHistory = history;

		var fieldManager = KarmaFields.managers.field();
		fieldManager.resource = resource;
		fieldManager.inputBuffer = "input";
		fieldManager.outputBuffer = "output";
		fieldManager.history = history;
		fieldManager.path = id;

		fieldManager.onSetValue = function() {
			var output = history.getValue(["output"]);
			// KarmaFields.Transfer.update(resource.driver, output);
			input.value = JSON.stringify(output);
		};
		var fieldNode = KarmaFields.build({
			children: fieldManager.build()
		}, container);
		container.addEventListener("focusin", function() {
			KarmaFields.events.onUndo = function(event) {

				history.undo();

				fieldNode.render();
				event.preventDefault();
			}
			KarmaFields.events.onRedo = function(event) {
				history.redo();
				event.preventDefault();
			}
		});

	});
</script>



<?php /*

<div id="karma-fields-field-container-<?php echo $index; ?>" class="karma-fields"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-input-<?php echo $index; ?>">
<script>
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-field-container-<?php echo $index; ?>");
		var input = document.getElementById("karma-fields-input-<?php echo $index; ?>");
		var post = {uri: "<?php echo $uri ?>"};
		var resources =  <?php echo json_encode($resources); ?>;
		var middleware = "<?php echo $middleware ?>";

		var history = KarmaFields.managers.history();
		var fieldManager;
		// var field;


		fieldManager = KarmaFields.managers.field(resources, post, middleware, history);
		fieldManager.onUpdateState = function(state) {
			// console.trace();
			// console.log(state);
			input.value = JSON.stringify(state);
		};
		container.appendChild(fieldManager.build());

		history.onUpdate = function() {
			fieldManager.update();
		};


		container.addEventListener("focusin", function() {
			KarmaFields.events.onUndo = function(event) {
				history.undo();
				event.preventDefault();
			}
			KarmaFields.events.onRedo = function(event) {
				history.redo();
				event.preventDefault();
			}
		});


	});
</script>


*/
