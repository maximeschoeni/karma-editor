<div id="karma-fields-table-<?php echo $id; ?>-container" class="karma-fields-table"></div>
<script>
	(function() {
		var container = document.getElementById("karma-fields-table-<?php echo $id; ?>-container");
		var resource = <?php echo json_encode($args); ?>;

		container.appendChild(
			KarmaFieldMedia.managers.table(resource).build()
		);
	})();
</script>
