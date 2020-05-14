<div id="karma-fields-<?php echo $section['key']; ?>-container" class="karma-fields"></div>
<script>
	// document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-<?php echo $section['key']; ?>-container");
		var section = <?php echo json_encode($section); ?>;
		var post = <?php echo json_encode($current_post); ?>;
		container.appendChild(
			KarmaFieldMedia.buildSection(section, post)
		);
	// });
</script>
