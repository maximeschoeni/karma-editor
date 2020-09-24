<div id="karma-fields-table-<?php echo $id; ?>-container" class="karma-fields-table"></div>



<?php

// $user_id = get_current_user_id();
// $save = get_user_meta($user_id, 'karma-save-03', true);
// var_dump($save);

?>
<script>
	// (function() {
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-table-<?php echo $id; ?>-container");
		var resource = <?php echo json_encode($args); ?>;

		var history = KarmaFields.History.createInstance();
		// history.store.inner = <?php //echo json_encode($save['inner']); ?>;

		var save = <?php echo $save; ?>;

		console.log(save);

		history.store.input = !Array.isArray(save.input) && save.input || {};
		history.store.inner = !Array.isArray(save.input) && save.inner || {};
		history.store.output = !Array.isArray(save.input) && save.output || {};
		history.undos = save.undos || [];
		history.redos = save.redos || [];
		history.temp = !Array.isArray(save.input) && save.temp || {};

		<?php /* if ($save) { ?>

		history.store.input = <?php echo json_encode($save['input']); ?>;
		history.store.inner = <?php echo json_encode($save['inner']); ?>;
		history.store.output = <?php echo json_encode($save['output']); ?>;
		history.undos = <?php echo json_encode($save['undos']); ?>;
		history.redos = <?php echo json_encode($save['redos']); ?>;
		history.temp = <?php echo json_encode($save['temp']); ?>;

		<?php } */ ?>

		// console.log(history.store.inner);


		// console.log(<?php //echo json_encode($save); ?>);

		// array(
		// 	'inner' => $request->get_params('inner'),
		// 	'output' => $request->get_params('output'),
		// 	'undos' => $request->get_params('undos'),
		// 	'redos' => $request->get_params('redos'),
		// 	'temp' => $request->get_params('temp')
		// );


		var tableManager = KarmaFields.managers.table(resource, history);

		window.tableManager = tableManager;


		KarmaFields.build(tableManager.build(), container);

	});
	// })();
</script>
