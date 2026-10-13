<?php
$post_id = get_the_ID();
?>
<article class="post-item">
	<h3 style="display:none !important"><?php echo get_the_title($post_id)?></h3>
    <?php beeteam368_post_thumbnail($post_id, apply_filters('beeteam368_post_thumbnail_params', array('size' => 'beeteam368_thumb_16x9_0x', 'ratio' => 'img-16x9', 'position' => 'slider-sunflower', 'html' => 'no-link'), $post_id));?>    
</article>