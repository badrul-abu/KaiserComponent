<?php
if (!class_exists('beeteam368_video_player')) {
    class beeteam368_video_player{
        public function __construct()
        {
            add_filter('beeteam368_player_mode_settings', array($this, 'player_lib'));
            add_filter('beeteam368_player_mode_default_settings', array($this, 'player_lib_default'));
			
			add_filter('beeteam368_video_settings_tab', array($this, 'video_player_settings_tabs'));
			add_filter('beeteam368_audio_settings_tab', array($this, 'audio_player_settings_tabs'));
			
			add_action('beeteam368_video_player_settings_options', array($this, 'video_player_settings_options'));
            add_action('beeteam368_audio_player_settings_options', array($this, 'audio_player_settings_options'));
			
			add_filter('beeteam368_video_main_toolbar_settings_tab', array($this, 'video_main_toolbar_settings_tabs'));
			add_action('beeteam368_video_main_toolbar_settings_options', array($this, 'video_main_toolbar_settings_options'));
			add_action('beeteam368_main_toolbar_auto_next_button', array($this, 'video_main_toolbar_auto_next_front_end'), 10, 2);

            add_filter('beeteam368_js_party_files', array($this, 'js'), 10, 4);
            add_filter('beeteam368_define_js_object', array($this, 'localize_script'), 10, 1);

            add_action('beeteam368_video_player_before_meta', array($this, 'video_before_meta'));
            add_action('beeteam368_video_player_after_meta', array($this, 'video_after_meta'));

            add_action('beeteam368_audio_player_before_meta', array($this, 'audio_before_meta'));
            add_action('beeteam368_audio_player_after_meta', array($this, 'audio_after_meta'));
			
			add_filter('upload_mimes', array($this, 'add_upload_mimes'), 10, 1);
			add_filter('beeteam368_post_thumb_control_class', array($this, 'preview_mode'),10, 3);
			add_filter('beeteam368_post_id_control_data', array($this, 'set_data_post_id'),10, 3);
			
			add_action('wp_ajax_getSinglePlayerParams', array($this, 'ajax_get_video_player_parameter'));
            add_action('wp_ajax_nopriv_getSinglePlayerParams', array($this, 'ajax_get_video_player_parameter'));
						
			global $beeteam368_video_settings;
			remove_action('beeteam368_before_single_primary_cw', array($beeteam368_video_settings, 'player_in_single_post'), 10, 1);
			remove_action('beeteam368_before_single', array($beeteam368_video_settings, 'player_in_single_post'), 10, 1);
			remove_action('beeteam368_video_player_in_single_playlist', array($beeteam368_video_settings, 'player_in_single_post'), 10, 2);
			remove_action('beeteam368_video_player_in_single_series', array($beeteam368_video_settings, 'player_in_single_post'), 10, 2);
			
			global $beeteam368_audio_settings;
			remove_action('beeteam368_before_single_primary_cw', array($beeteam368_audio_settings, 'player_in_single_post'), 10, 1);
			remove_action('beeteam368_before_single', array($beeteam368_audio_settings, 'player_in_single_post'), 10, 1);
			remove_action('beeteam368_audio_player_in_single_playlist', array($beeteam368_audio_settings, 'player_in_single_post'), 10, 2);
			remove_action('beeteam368_audio_player_in_single_series', array($beeteam368_audio_settings, 'player_in_single_post'), 10, 2);
						
			add_action('beeteam368_before_single_primary_cw', array($this, 'player_in_single_post'), 10, 1);
			add_action('beeteam368_before_single', array($this, 'player_in_single_post'), 10, 1);
			
			add_action('beeteam368_before_single_primary_cw', array($this, 'player_audio_in_single_post'), 10, 1);
			add_action('beeteam368_before_single', array($this, 'player_audio_in_single_post'), 10, 1);
			
			add_action('beeteam368_video_player_in_single_playlist', array($this, 'player_in_single_post'), 10, 2);
			add_action('beeteam368_video_player_in_single_series', array($this, 'player_in_single_post'), 10, 2);
			
			add_action('beeteam368_audio_player_in_single_playlist', array($this, 'player_audio_in_single_post'), 10, 2);
			add_action('beeteam368_audio_player_in_single_series', array($this, 'player_audio_in_single_post'), 10, 2);
			
			add_action('wp_enqueue_scripts', array($this, 're_register_mediaelement'), 5);
			
			add_action('beeteam368_after_content_slider_pro', array($this, 'add_button_play_to_slider'), 10, 2);
			
			add_action('get_header', array($this, 'setCookieAutoNext'));
			
			add_action( 'beeteam368_after_player_in_single_video', array($this, 'free_download'), 6, 2 );
			add_action( 'beeteam368_after_player_in_single_audio', array($this, 'free_download'), 6, 2 );
			
			add_action( 'beeteam368_after_video_player_in_single_playlist', array($this, 'free_download'), 6, 2 );
			add_action( 'beeteam368_after_audio_player_in_single_playlist', array($this, 'free_download'), 6, 2 );
			
			add_action( 'beeteam368_after_video_player_in_single_series', array($this, 'free_download'), 6, 2 );
			add_action( 'beeteam368_after_audio_player_in_single_series', array($this, 'free_download'), 6, 2 );
        }
		
		function free_download($post_id = NULL, $pos_style = 'small'){

            if( function_exists('check_download_access')) {
                $accessDownload = check_download_access();

                if($accessDownload){
                    if($post_id == NULL){
                        $post_id = get_the_ID();
                    }
                    
                    if(!$post_id){
                        return;
                    }
                    
                    $vm_media_download = get_post_meta($post_id, BEETEAM368_PREFIX . '_video_url', true);
                    
                    $arr_download_files = array();
                    
                    if(isset($vm_media_download) && !empty($vm_media_download)){
                        $default_file_name = esc_html__('Download File', 'beeteam368-extensions-pro');
                        
                        // $i_dl = 1;
                        // foreach($vm_media_download as $download_file){
                            
                        // 	if(isset($download_file['source_label']) && trim($download_file['source_label'])!=''){
                        // 		$new_file_name = trim($download_file['source_label']);
                        // 	} else{
                        // 		$new_file_name = $default_file_name.' '.$i_dl;
                        // 	}
                            
                        // 	$link_file_download = '';
                            
                        // 	if(isset($download_file['source_file_id']) && is_numeric($download_file['source_file_id'])){
                                
                        // 		$link_file_download = wp_get_attachment_url( $download_file['source_file_id'] );
                                
                        // 	}else{
                        // 		if(isset($download_file['source_file']) && trim($download_file['source_file'])!=''){
                                    
                        // 			$link_file_download = $download_file['source_file'];
                                    
                        // 		}
                        // 	}
                            
                            ob_start();
                            ?>
                                <a href="<?php echo esc_url($vm_media_download);?>" download class="classic-post-item flex-row-control flex-vertical-middle download-button" post-id="<?php echo $post_id; ?>" >
                                            
                                    <span class="classic-post-item-image">
                                        <span class="beeteam368-icon-item">
                                            <i class="fas fa-cloud-download-alt"></i>
                                        </span>
                                    </span>
                                    
                                    <span class="classic-post-item-content">
                                        <span class="classic-post-item-title h6"><?php echo esc_html($default_file_name);?></span>                                        
                                    </span>
                                    
                                </a>
                            
                                
                            <?php
                            $output_string = ob_get_contents();
                            ob_end_clean();
                            
                            $arr_download_files[] = $output_string;
                            
                            // $i_dl++;
                        // }        
			
                        //if(count($arr_download_files) > 0){
                            global $html_free_download_files_listing;		
                            $html_free_download_files_listing = implode('', $arr_download_files);	
                        ?>
                            <a href="<?php echo esc_url($vm_media_download);?>" class="btnn-default btnn-primary fw-spc-btn no-spc-bdr beeteam368-global-open-popup-control" data-popup-id="download_files_popup_free" data-action="open_download_files_popup_free">
                                <i class="fas fa-file-download icon"></i><span><?php echo esc_html($default_file_name);?></span>
                            </a> 
                        <?php			
                            add_action('wp_footer', function(){
                            ?>
                                <div class="beeteam368-global-popup beeteam368-download-files-free beeteam368-global-popup-control flex-row-control flex-vertical-middle flex-row-center" data-popup-id="download_files_popup_free">
                                    <div class="beeteam368-global-popup-content beeteam368-global-popup-content-control">
                                        
                                        <div class="top-section-title has-icon">
                                            <span class="beeteam368-icon-item"><i class="fas fa-file-download icon"></i></span>
                                            <span class="sub-title font-main"><?php echo esc_html__('Download', 'beeteam368-extensions-pro');?></span>
                                            <h2 class="h2 h3-mobile main-title-heading">                            
                                                <span class="main-title"><?php echo esc_html__('Download Files', 'beeteam368-extensions-pro');?></span><span class="hd-line"></span>
                                            </h2>
                                        </div>
                                                                                        
                                        <hr>
                                        
                                        <div class="beeteam368-download-files-wrapper beeteam368-download-files-wrapper-control">
                                            <?php 
                                            global $html_free_download_files_listing;
                                            echo $html_free_download_files_listing;
                                            ?>
                                        </div>
                                    </div>
                                </div>    
                            <?php	
                            });	
                        //}
                            
                        }
                }
            }
        }
		
		function add_button_play_to_slider($post_id, $params){
			if(get_post_type($post_id) !== BEETEAM368_POST_TYPE_PREFIX . '_video'){
				return;
			}
		?>
        	<div class="btn-slider-pro">
            
            	<?php
				$duration_element = '';
                $_video_duration = beeteam368_get_option('_video_duration', '_video_settings', 'on');			
				global $beeteam368_display_post_meta_override;	
				if(is_array($beeteam368_display_post_meta_override) && isset($beeteam368_display_post_meta_override['level_2_show_duration'])){
					$_video_duration = $beeteam368_display_post_meta_override['level_2_show_duration'];
				}
				
				if($_video_duration === 'on'){
					$duration = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_duration', true));
					if($duration != ''){
						$duration_element = '&nbsp; | &nbsp;'.$duration;							
					}
				}
				?>
            
            	<a href="<?php echo esc_url(beeteam368_get_post_url($post_id)); ?>" class="btnn-default btnn-primary"><i class="icon far fa-play-circle"></i><span><?php echo esc_html__('Watch NOW', 'beeteam368-extensions-pro').$duration_element?></span></a>               
                
                <?php				
				$_video_tag_label = beeteam368_get_option('_video_tag_label', '_video_settings', 'on');			
				global $beeteam368_display_post_meta_override;	
				if(is_array($beeteam368_display_post_meta_override) && isset($beeteam368_display_post_meta_override['level_2_show_tag_label'])){
					$_video_tag_label = $beeteam368_display_post_meta_override['level_2_show_tag_label'];
				}
				
				if($_video_tag_label === 'on'){
					$labels = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_tag_label', true));
					if($labels != ''){
						$labels = explode(',', $labels);
						if(count($labels) > 0){
							?>
                            <span class="btnn-default btnn-primary media-label">
								<?php
                                foreach($labels as $label){								
                                    if(trim($label) != ''){
                                ?>
                                        <span class="med-quality"><?php echo esc_html(trim($label));?></span>
                                <?php
                                    }
                                }
                                ?>
                            </span>
                            <?php
						}				
					}
				}				
				?>
                
                <?php if(beeteam368_get_option('_video_preview', '_video_settings', 'on') === 'on'){?>
                	<button class="reverse slider-preview preview-mode-control" data-id="<?php echo esc_attr($post_id);?>">
                    	<i class="icon far fa-eye"></i><span><?php echo esc_html__('Preview', 'beeteam368-extensions-pro')?></span>
                    </button>
                <?php }?>
            </div>
        <?php	
		}
		
		function re_register_mediaelement(){
			
			if(is_admin()){
				return;
			}
			
			wp_deregister_script('mediaelement');
			wp_deregister_script('mediaelement-core');
			wp_deregister_script('mediaelement-migrate');
			wp_deregister_script('mediaelement-vimeo');
			wp_deregister_script('wp-mediaelement');
			
			wp_deregister_style('mediaelement');
   			wp_deregister_style('wp-mediaelement');
			
			wp_register_script(
				'wp-mediaelement', 
				BEETEAM368_EXTENSIONS_PRO_URL . 'inc/pro-player/assets/player/mediaelement-and-player.min.js', 
				array('jquery'), 
				'5.0.5', 
				true 
			);
			
			wp_register_script(
				'mediaelement-vimeo', 
				BEETEAM368_EXTENSIONS_PRO_URL . 'inc/pro-player/assets/player/renderers/vimeo.js', 
				array('jquery', 'wp-mediaelement'), 
				'5.0.5', 
				true 
			);
			
			wp_register_style(
				'wp-mediaelement',
				BEETEAM368_EXTENSIONS_PRO_URL . 'inc/pro-player/assets/player/mediaelementplayer.min.css',
				array(),
				'5.0.5'
			);
			
		}

        function player_lib($mode){
            $mode['pro'] = esc_html__('Professional (media link with theme\'s player)', 'beeteam368-extensions-pro');
            return $mode;
        }

        function player_lib_default($value){
            $value = 'pro';
            return $value;
        }
		
		function add_upload_mimes( $upload_mimes ) {
			$upload_mimes['json'] = 'text/plain';
			return $upload_mimes; 
		}
		
        function video_before_meta($settings){
            $settings->add_field( array(
                'id'        	=> BEETEAM368_PREFIX . '_video_formats',
                'name'      	=> esc_html__( 'Video Formats', 'beeteam368-extensions-pro'),
                'type'      	=> 'radio_inline',
                'options' 		=> apply_filters('beeteam368_player_formats_settings', array(
                    'auto' => esc_html__('Automatic Recognition', 'beeteam368-extensions-pro'),
                    'self_hosted' => esc_html__('Self-Hosted Videos (*.mp4, *.webm...)', 'beeteam368-extensions-pro'),
                    'hls' => esc_html__('HLS (*.m3u8)', 'beeteam368-extensions-pro'),
                    'mpd' => esc_html__('M(PEG)-DASH (*.mpd)', 'beeteam368-extensions-pro'),
                )),
                'default' => 'auto',
                'attributes' => array(
                    'data-conditional-id' => BEETEAM368_PREFIX . '_video_mode',
                    'data-conditional-value' => 'pro',
                ),
            ));
			
			$settings->add_field( array(
                'id'        	=> BEETEAM368_PREFIX . '_video_choose',
                'name'      	=> esc_html__( 'Choose self-hosted Video', 'beeteam368-extensions-pro'),
                'type'      	=> 'file',
                'options' 		=> array( 'url' => false ),
                'query_args' => array(
                    'type' => array(
                        'video/x-ms-asf',
                        'video/x-ms-wmv',
                        'video/x-ms-wmx',
                        'video/x-ms-wm',
                        'video/avi',
                        'video/divx',
                        'video/x-flv',
                        'video/quicktime',
                        'video/mpeg',
                        'video/mp4',
                        'video/ogg',
                        'video/webm',
                        'video/x-matroska',
                        'video/3gpp',
                        'video/3gpp2'
                    ),
                ),

            ));
        }

        function video_after_meta($settings){
            $settings->add_field(array(
                'name' => esc_html__('Video Autoplay', 'beeteam368-extensions-pro'),
                'desc' => esc_html__('This feature does not work with videos in embedded mode.', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_video_autoplay',
                'default' => 'default',
                'type' => 'select',
                'options' => array(
                    '' => esc_html__('Default', 'beeteam368-extensions-pro'),
                    'off' => esc_html__('NO', 'beeteam368-extensions-pro'),
                    'on' => esc_html__('YES', 'beeteam368-extensions-pro'),
                ),
                'attributes' => array(
                    'data-conditional-id' => BEETEAM368_PREFIX . '_video_mode',
                    'data-conditional-value' => 'pro',
                ),
            ));
			$settings->add_field(array(
                'name' => esc_html__('Load Optimization', 'beeteam368-extensions-pro'),
                'desc' => esc_html__('Optimized loading in embedded mode. It will load the iframe after the user clicks the play button. If you disable this option, you won\'t be able to use "Pre-roll Ad" for embedded videos.', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_video_load_opti',
                'default' => '',
                'type' => 'select',
                'options' => array(
					'' => esc_html__('Default', 'beeteam368-extensions-pro'),
					'on' => esc_html__('YES', 'beeteam368-extensions-pro'),
                    'off' => esc_html__('NO', 'beeteam368-extensions-pro'),                    
                ),
            ));

            $group_media_source = $settings->add_field(array(
                'id'          => BEETEAM368_PREFIX . '_media_sources',
                'type'        => 'group',
                'description' => esc_html__('Media Sources - [Only work with Self-Hosted Videos, HLS, M(PEG)-DASH] - Sources are inserted into playlist objects and are lists of files. Sources serve a dual purpose, depending on the files used.', 'beeteam368-extensions-pro'),
                'options'     => array(
                    'group_title'   => esc_html__('Media Source {#}', 'beeteam368-extensions-pro'),
                    'add_button'	=> esc_html__('Add Media', 'beeteam368-extensions-pro'),
                    'remove_button' => esc_html__('Remove Media', 'beeteam368-extensions-pro'),
                    'closed'		=> true,
                ),
                'repeatable'  => true,
            ));
                $settings->add_group_field($group_media_source, array(
                    'id'   			=> 'source_label',
                    'name' 			=> esc_html__( 'Video Label', 'beeteam368-extensions-pro'),
                    'type' 			=> 'text',
                    'repeatable' 	=> false,
                ));
                $settings->add_group_field($group_media_source, array(
                    'id'   			=> 'source_file',
                    'name' 			=> esc_html__( 'Video File (or URL)', 'beeteam368-extensions-pro'),
                    'type' 			=> 'file',
                    'repeatable' 	=> false,
                ));
				
				$settings->add_group_field($group_media_source, array(
					'id'        	=> 'source_formats',
					'name'      	=> esc_html__( 'Video Formats', 'beeteam368-extensions-pro'),
					'type'      	=> 'radio_inline',
					'options' 		=> apply_filters('beeteam368_player_formats_settings', array(
						'auto' => esc_html__('Automatic Recognition', 'beeteam368-extensions-pro'),
						'self_hosted' => esc_html__('Self-Hosted Videos (*.mp4, *.webm...)', 'beeteam368-extensions-pro'),
						'hls' => esc_html__('HLS (*.m3u8)', 'beeteam368-extensions-pro'),
						'mpd' => esc_html__('M(PEG)-DASH (*.mpd)', 'beeteam368-extensions-pro'),
					)),
					'default' => 'auto',					
				));
				

            $group_media_subtitles = $settings->add_field(array(
                'id'          => BEETEAM368_PREFIX . '_media_subtitles',
                'type'        => 'group',
                'description' => esc_html__('Subtitles are text derived from either a transcript or screenplay of the dialog or commentary in films, television programs, video games, and the like, usually displayed at the bottom of the screen.', 'beeteam368-extensions-pro'),
                'options'     => array(
                    'group_title'   => esc_html__('Subtitles {#}', 'beeteam368-extensions-pro'),
                    'add_button'	=> esc_html__('Add Subtitles', 'beeteam368-extensions-pro'),
                    'remove_button' => esc_html__('Remove Subtitles', 'beeteam368-extensions-pro'),
                    'closed'		=> true,
                ),
                'repeatable'  => true,
            ));
                $settings->add_group_field($group_media_subtitles, array(
                    'id'   			=> 'label',
                    'name' 			=> esc_html__( 'Subtitle Label', 'beeteam368-extensions-pro'),
                    'type' 			=> 'text',
                    'desc'        	=> esc_html__('A user-readable title of the text track which is used by the browser when listing available text tracks.', 'beeteam368-extensions-pro'),
                    'repeatable' 	=> false,
                ));
                $settings->add_group_field($group_media_subtitles, array(
                    'id'   			=> 'srclang',
                    'name' 			=> esc_html__( 'Srclang', 'beeteam368-extensions-pro'),
                    'type' 			=> 'text',
                    'desc'        	=> esc_html__('Language of the track text data. It must be a valid BCP 47 language tag ( https://r12a.github.io/app-subtags/ ). If the kind attribute is set to subtitles, then srclang must be defined.', 'beeteam368-extensions-pro'),
                    'repeatable' 	=> false,
                ));
                $settings->add_group_field($group_media_subtitles, array(
                    'id'   			=> 'src',
                    'name' 			=> esc_html__( 'Src', 'beeteam368-extensions-pro'),
                    'type' 			=> 'file',
                    'desc'        	=> esc_html__('Address of the track (.vtt file). Must be a valid URL. This attribute must be specified and its URL value must have the same origin as the document — unless the <audio> or <video> parent element of the track element has a crossorigin attribute.', 'beeteam368-extensions-pro'),
                    'repeatable' 	=> false,
                ));
			
			$settings->add_field( array(
                'id' => BEETEAM368_PREFIX . '_video_url_preview',
                'name' => esc_html__( 'Preview Video URL ( url from video sites or self-hosted videos )', 'beeteam368-extensions-pro'),
                'type' => 'textarea_code',
                'options' => array( 'disable_codemirror' => true ),
                'column' => false,
                'desc' => 	wp_kses(__(
                    'Enter url from video sites like YouTube, Vimeo, Dailymotion or your file upload (*.mp4, *.webm, *.ogg, .ogv).                   
                    <br><br><strong>For Video Support:</strong> [video/mp4]<strong>*.mp4</strong>, [video/webm]<strong>*.webm</strong>, [video/ogg]<strong>*.ogg</strong>, [video/ogv]<strong>*.ogv</strong>
                    <br><strong>For HLS Support:</strong> [application/x-mpegURL]<strong>*.m3u8</strong>, [vnd.apple.mpegURL]<strong>*.m3u8</strong>, [video/MP2T]<strong>*.ts</strong>
                    <br><strong>For M(PEG)-DASH Support:</strong> [application/dash+xml]<strong>*.mpd</strong>', 'beeteam368-extensions-pro'),
                    array('br'=>array(), 'code'=>array(), 'strong'=>array())
                ),
            ));
			$settings->add_field( array(
                'id'        	=> BEETEAM368_PREFIX . '_video_formats_preview',
                'name'      	=> esc_html__( 'Preview Video Formats', 'beeteam368-extensions-pro'),
                'type'      	=> 'radio_inline',
                'options' 		=> apply_filters('beeteam368_player_formats_settings', array(
                    'auto' => esc_html__('Automatic Recognition', 'beeteam368-extensions-pro'),
                    'self_hosted' => esc_html__('Self-Hosted Videos (*.mp4, *.webm...)', 'beeteam368-extensions-pro'),
                    'hls' => esc_html__('HLS (*.m3u8)', 'beeteam368-extensions-pro'),
                    'mpd' => esc_html__('M(PEG)-DASH (*.mpd)', 'beeteam368-extensions-pro'),
                )),
                'default' => 'auto',
            ));
			$settings->add_field( array(
                'id' => BEETEAM368_PREFIX . '_video_webp_url_preview',
                'name' => esc_html__( 'Preview Webp URL', 'beeteam368-extensions-pro'),
                'type' => 'file',
                'column' => false,                
            ));
			
			$group_media_download = $settings->add_field(array(
				'id'          => BEETEAM368_PREFIX . '_media_download',
				'type'        => 'group',	
				'description' => esc_html__('FREE Download files.', 'beeteam368-extensions-pro'),		
				'options'     => array(
					'group_title'   => esc_html__('File Download {#}', 'beeteam368-extensions-pro'),
					'add_button'	=> esc_html__('Add File', 'beeteam368-extensions-pro'),
					'remove_button' => esc_html__('Remove File', 'beeteam368-extensions-pro'),				
					'closed'		=> true,
				),
				'repeatable'  => true,
			));	
				$settings->add_group_field($group_media_download, array(
					'id'   			=> 'source_label',
					'name' 			=> esc_html__( 'Label', 'beeteam368-extensions-pro'),
					'type' 			=> 'text',
					'repeatable' 	=> false,
				));
				$settings->add_group_field($group_media_download, array(
					'id'   			=> 'source_file',
					'name' 			=> esc_html__( 'File', 'beeteam368-extensions-pro'),
					'type' 			=> 'file',
					'repeatable' 	=> false,
				));
			
        }

        function audio_before_meta($settings){
            $settings->add_field( array(
                'id'        	=> BEETEAM368_PREFIX . '_audio_formats',
                'name'      	=> esc_html__( 'Audio Formats', 'beeteam368-extensions-pro'),
                'type'      	=> 'radio_inline',
                'options' 		=> apply_filters('beeteam368_player_formats_settings', array(
                    'auto' => esc_html__('Automatic Recognition', 'beeteam368-extensions-pro'),
                    'self_hosted' => esc_html__('Self-Hosted Audios (*.mp3, *.ogg...)', 'beeteam368-extensions-pro'),
                )),
                'default' => 'auto',
                'attributes' => array(
                    'data-conditional-id' => BEETEAM368_PREFIX . '_audio_mode',
                    'data-conditional-value' => 'pro',
                ),
            ));
			
			$settings->add_field( array(
                'id'        	=> BEETEAM368_PREFIX . '_audio_choose',
                'name'      	=> esc_html__( 'Choose self-hosted Audio', 'beeteam368-extensions-pro'),
                'type'      	=> 'file',
                'options' 		=> array( 'url' => false ),
                'query_args' => array(
                    'type' => array(
                        'video/x-ms-asf',
                        'video/x-ms-wmv',
                        'video/x-ms-wmx',
                        'video/x-ms-wm',
                        'video/avi',
                        'video/divx',
                        'video/x-flv',
                        'video/quicktime',
                        'video/mpeg',
                        'video/mp4',
                        'video/ogg',
                        'video/webm',
                        'video/x-matroska',
                        'video/3gpp',
                        'video/3gpp2',
                        'audio/mpeg',
                        'audio/ogg',
                        'audio/wav',
                        'audio/m4a',
                    ),
                ),

            ));
			
        }

        function audio_after_meta($settings){
			$settings->add_field( array(
                'id' => BEETEAM368_PREFIX . '_audio_url_demo',
                'name' => esc_html__( 'Demo Audio URL ( url from audio sites or self-hosted audios )', 'beeteam368-extensions-pro'),
                'type' => 'textarea_code',
                'options' => array( 'disable_codemirror' => true ),
                'column' => false,
                'desc' => 	wp_kses(__(				
                    'This is a shortened audio track for users to refer to before listening to the full version.<br>
					<strong>Only supports self-hosted audio</strong>:<br>										
					[audio/mp3]<strong>*.mp3</strong>, [audio/oga]<strong>*.oga</strong>, [audio/ogg]<strong>*.ogg</strong>, [audio/wav]<strong>*.wav</strong>', 'beeteam368-extensions-pro'),
                    array('br'=>array(), 'code'=>array(), 'strong'=>array())
                ),
            ));
			$settings->add_field( array(
                'id'        	=> BEETEAM368_PREFIX . '_audio_formats_demo',
                'name'      	=> esc_html__( 'Demo Audio Formats', 'beeteam368-extensions-pro'),
                'type'      	=> 'radio_inline',
                'options' 		=> apply_filters('beeteam368_player_formats_settings', array(
                    'auto' => esc_html__('Automatic Recognition', 'beeteam368-extensions-pro'),
                    'self_hosted' => esc_html__('Self-Hosted Audios (*.mp3, *.ogg...)', 'beeteam368-extensions-pro'),
                )),
                'default' => 'auto',                
            ));
			$group_media_download = $settings->add_field(array(
				'id'          => BEETEAM368_PREFIX . '_media_download',
				'type'        => 'group',	
				'description' => esc_html__('FREE Download files.', 'beeteam368-extensions-pro'),		
				'options'     => array(
					'group_title'   => esc_html__('File Download {#}', 'beeteam368-extensions-pro'),
					'add_button'	=> esc_html__('Add File', 'beeteam368-extensions-pro'),
					'remove_button' => esc_html__('Remove File', 'beeteam368-extensions-pro'),				
					'closed'		=> true,
				),
				'repeatable'  => true,
			));	
				$settings->add_group_field($group_media_download, array(
					'id'   			=> 'source_label',
					'name' 			=> esc_html__( 'Label', 'beeteam368-extensions-pro'),
					'type' 			=> 'text',
					'repeatable' 	=> false,
				));
				$settings->add_group_field($group_media_download, array(
					'id'   			=> 'source_file',
					'name' 			=> esc_html__( 'File', 'beeteam368-extensions-pro'),
					'type' 			=> 'file',
					'repeatable' 	=> false,
				));
        }
		
		function video_player_settings_tabs($tabs){
			$tabs[] = array(
				'id' => 'video-player-settings',
				'icon' => 'dashicons-video-alt3',
				'title' => esc_html__('Player Settings', 'beeteam368-extensions-pro'),
				'fields' => apply_filters('beeteam368_video_player_settings_tab', array(
					BEETEAM368_PREFIX . '_crossorigin',
					BEETEAM368_PREFIX . '_video_autoplay',
					BEETEAM368_PREFIX . '_video_player_language',
					BEETEAM368_PREFIX . '_video_load_opti',
					BEETEAM368_PREFIX . '_video_preview',
					BEETEAM368_PREFIX . '_adjust_video_size',
					BEETEAM368_PREFIX . '_floating_video_desktop',
					BEETEAM368_PREFIX . '_floating_video_mobile'
				)),
			);
			
			return $tabs;
		}
		
		function audio_player_settings_tabs($tabs){
			$tabs[] =  array(
				'id' => 'audio-player-settings',
				'icon' => 'dashicons-embed-audio',
				'title' => esc_html__('Player Settings', 'beeteam368-extensions-pro'),
				'fields' => apply_filters('beeteam368_audio_player_settings_tab', array(
					BEETEAM368_PREFIX . '_audio_crossorigin',
					BEETEAM368_PREFIX . '_audio_player_language',					
				)),
			);
			
			return $tabs;
		}
		
		function video_player_settings_options($settings_options){
			$settings_options->add_field(array(
                'name' => esc_html__('CORS', 'beeteam368-extensions-pro'),
                'desc' => esc_html__('The crossorigin content attribute on media elements is a CORS settings attribute.', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_crossorigin',
                'default' => '',
                'type' => 'select',
                'options' => array(
                    '' => esc_html__('Default', 'beeteam368-extensions-pro'),
                    'anonymous' => esc_html__('Anonymous', 'beeteam368-extensions-pro'),
					'use-credentials' => esc_html__('Use Credentials', 'beeteam368-extensions-pro'),
                ),
            ));
			
			$settings_options->add_field(array(
                'name' => esc_html__('Video Autoplay', 'beeteam368-extensions-pro'),
                'desc' => esc_html__('This feature does not work with videos in embedded mode.', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_video_autoplay',
                'default' => 'off',
                'type' => 'select',
                'options' => array(
                    'off' => esc_html__('NO', 'beeteam368-extensions-pro'),
                    'on' => esc_html__('YES', 'beeteam368-extensions-pro'),
                ),
            ));
			$settings_options->add_field(array(
                'name' => esc_html__('Load Optimization', 'beeteam368-extensions-pro'),
                'desc' => esc_html__('Optimized loading in embedded mode. It will load the iframe after the user clicks the play button. If you disable this option, you won\'t be able to use "Pre-roll Ad" for embedded videos.', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_video_load_opti',
                'default' => 'on',
                'type' => 'select',
                'options' => array(
					'on' => esc_html__('YES', 'beeteam368-extensions-pro'),
                    'off' => esc_html__('NO', 'beeteam368-extensions-pro'),                    
                ),
            ));
			$settings_options->add_field(array(
                'name' => esc_html__('Video Preview', 'beeteam368-extensions-pro'),
                'desc' => esc_html__('This feature will enable preview mode when the mouse pointer is above the thumbnail image.', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_video_preview',
                'default' => 'on',
                'type' => 'select',
                'options' => array(
					'on' => esc_html__('YES', 'beeteam368-extensions-pro'),
                    'off' => esc_html__('NO', 'beeteam368-extensions-pro'),                    
                ),
            ));
			$settings_options->add_field(array(
                'name' => esc_html__('Adjust Video Size', 'beeteam368-extensions-pro'),
                'desc' => esc_html__('Automatically adjust the size of the video to fit the player size [For self-hosted videos].', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_adjust_video_size',
                'default' => 'on',
                'type' => 'select',
                'options' => array(
					'on' => esc_html__('YES', 'beeteam368-extensions-pro'), 
					'off' => esc_html__('NO', 'beeteam368-extensions-pro'),                                       
                ),
            ));
			
			$settings_options->add_field(array(
                'name' => esc_html__('Minimize + Float Player (Desktop)', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_floating_video_desktop',
                'default' => 'on',
                'type' => 'select',
                'options' => array(
					'on' => esc_html__('YES', 'beeteam368-extensions-pro'),
					'off' => esc_html__('NO', 'beeteam368-extensions-pro'),                    
                ),
            ));
			$settings_options->add_field(array(
                'name' => esc_html__('Minimize + Float Player (Mobile)', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_floating_video_mobile',
                'default' => 'on',
                'type' => 'select',
                'options' => array(
					'on' => esc_html__('YES', 'beeteam368-extensions-pro'), 
					'off' => esc_html__('NO', 'beeteam368-extensions-pro'),
                ),
            ));
			
			
            $settings_options->add_field(array(
                'name' => esc_html__('Default Languages', 'beeteam368-extensions-pro'),
                'desc' => esc_html__('This feature does not work with videos in embedded mode.', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_video_player_language',
                'default' => 'en.js',
                'type' => 'select',
                'options' => array(
                    'en' => esc_html__('English (en)', 'beeteam368-extensions-pro'),
                    'ca' => esc_html__('Català / Catalan (ca)', 'beeteam368-extensions-pro'),
                    'cs' => esc_html__('Čeština / Czech (cs)', 'beeteam368-extensions-pro'),
                    'de' => esc_html__('Deutsch / German (de)', 'beeteam368-extensions-pro'),
                    'es' => esc_html__('Español / Spanish; Castilian (es)', 'beeteam368-extensions-pro'),
                    'fa' => esc_html__('فارسی / Persian (fa)', 'beeteam368-extensions-pro'),
                    'fr' => esc_html__('Français / French (fr)', 'beeteam368-extensions-pro'),
                    'hr' => esc_html__('Hrvatski / Croatian (hr)', 'beeteam368-extensions-pro'),
                    'hu' => esc_html__('Magyar / Hungarian (hu)', 'beeteam368-extensions-pro'),
                    'it' => esc_html__('Italiano / Italian (it)', 'beeteam368-extensions-pro'),
                    'ja' => esc_html__('日本語 / Japanese (ja)', 'beeteam368-extensions-pro'),
                    'ko' => esc_html__('한국어 / Korean (ko)', 'beeteam368-extensions-pro'),
                    'ms' => esc_html__('Melayu / Malay (ms)', 'beeteam368-extensions-pro'),
                    'nl' => esc_html__('Nederlands / Dutch (nl)', 'beeteam368-extensions-pro'),
                    'pl' => esc_html__('Polski / Polish (pl)', 'beeteam368-extensions-pro'),
                    'pt' => esc_html__('Português / Portuguese (pt)', 'beeteam368-extensions-pro'),
                    'ro' => esc_html__('Română / Romanian (ro)', 'beeteam368-extensions-pro'),
                    'ru' => esc_html__('Русский / Russian (ru)', 'beeteam368-extensions-pro'),
                    'sk' => esc_html__('Slovensko / Slovak (sk)', 'beeteam368-extensions-pro'),
                    'sv' => esc_html__('Svenska / Swedish (sv)', 'beeteam368-extensions-pro'),
                    'tr' => esc_html__('Turkish (tr)', 'beeteam368-extensions-pro'),
                    'uk' => esc_html__('Українська / Ukrainian (uk)', 'beeteam368-extensions-pro'),
                    'zh-CN' => esc_html__('简体中文 / Simplified Chinese (zh-CN)', 'beeteam368-extensions-pro'),
                    'zh' => esc_html__('繁体中文 / Traditional Chinese (zh-TW)', 'beeteam368-extensions-pro'),
                ),
            ));
		}
		
		function audio_player_settings_options($settings_options){
			$settings_options->add_field(array(
                'name' => esc_html__('CORS', 'beeteam368-extensions-pro'),
                'desc' => esc_html__('The crossorigin content attribute on media elements is a CORS settings attribute.', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_audio_crossorigin',
                'default' => '',
                'type' => 'select',
                'options' => array(
                    '' => esc_html__('Default', 'beeteam368-extensions-pro'),
                    'anonymous' => esc_html__('Anonymous', 'beeteam368-extensions-pro'),
					'use-credentials' => esc_html__('Use Credentials', 'beeteam368-extensions-pro'),
                ),
            ));
			
            $settings_options->add_field(array(
                'name' => esc_html__('Default Languages', 'beeteam368-extensions-pro'),
                'desc' => esc_html__('This feature does not work with videos in embedded mode.', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_audio_player_language',
                'default' => 'en.js',
                'type' => 'select',
                'options' => array(
                    'en' => esc_html__('English (en)', 'beeteam368-extensions-pro'),
                    'ca' => esc_html__('Català / Catalan (ca)', 'beeteam368-extensions-pro'),
                    'cs' => esc_html__('Čeština / Czech (cs)', 'beeteam368-extensions-pro'),
                    'de' => esc_html__('Deutsch / German (de)', 'beeteam368-extensions-pro'),
                    'es' => esc_html__('Español / Spanish; Castilian (es)', 'beeteam368-extensions-pro'),
                    'fa' => esc_html__('فارسی / Persian (fa)', 'beeteam368-extensions-pro'),
                    'fr' => esc_html__('Français / French (fr)', 'beeteam368-extensions-pro'),
                    'hr' => esc_html__('Hrvatski / Croatian (hr)', 'beeteam368-extensions-pro'),
                    'hu' => esc_html__('Magyar / Hungarian (hu)', 'beeteam368-extensions-pro'),
                    'it' => esc_html__('Italiano / Italian (it)', 'beeteam368-extensions-pro'),
                    'ja' => esc_html__('日本語 / Japanese (ja)', 'beeteam368-extensions-pro'),
                    'ko' => esc_html__('한국어 / Korean (ko)', 'beeteam368-extensions-pro'),
                    'ms' => esc_html__('Melayu / Malay (ms)', 'beeteam368-extensions-pro'),
                    'nl' => esc_html__('Nederlands / Dutch (nl)', 'beeteam368-extensions-pro'),
                    'pl' => esc_html__('Polski / Polish (pl)', 'beeteam368-extensions-pro'),
                    'pt' => esc_html__('Português / Portuguese (pt)', 'beeteam368-extensions-pro'),
                    'ro' => esc_html__('Română / Romanian (ro)', 'beeteam368-extensions-pro'),
                    'ru' => esc_html__('Русский / Russian (ru)', 'beeteam368-extensions-pro'),
                    'sk' => esc_html__('Slovensko / Slovak (sk)', 'beeteam368-extensions-pro'),
                    'sv' => esc_html__('Svenska / Swedish (sv)', 'beeteam368-extensions-pro'),
                    'tr' => esc_html__('Turkish (tr)', 'beeteam368-extensions-pro'),
                    'uk' => esc_html__('Українська / Ukrainian (uk)', 'beeteam368-extensions-pro'),
                    'zh-CN' => esc_html__('简体中文 / Simplified Chinese (zh-CN)', 'beeteam368-extensions-pro'),
                    'zh' => esc_html__('繁体中文 / Traditional Chinese (zh-TW)', 'beeteam368-extensions-pro'),
                ),
            ));
		}
		
		function video_main_toolbar_settings_tabs($fields){
			$fields[] = BEETEAM368_PREFIX . '_mtb_auto_next';
			$fields[] = BEETEAM368_PREFIX . '_mtb_auto_next_mode';			
			return $fields;
		}	
		
		function video_main_toolbar_settings_options($settings_options){
			$settings_options->add_field(array(
                'name' => esc_html__('Display "Auto Next" Button', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_mtb_auto_next',
                'default' => 'on',
                'type' => 'select',
                'options' => array(
                    'on' => esc_html__('YES', 'beeteam368-extensions-pro'),
                    'off' => esc_html__('NO', 'beeteam368-extensions-pro'),
                ),

            ));
			
			$settings_options->add_field(array(
                'name' => esc_html__('Default "Auto Next" Mode', 'beeteam368-extensions-pro'),
                'id' => BEETEAM368_PREFIX . '_mtb_auto_next_mode',
                'default' => 'off',
                'type' => 'select',
                'options' => array(
					'off' => esc_html__('OFF', 'beeteam368-extensions-pro'),
                    'on' => esc_html__('ON', 'beeteam368-extensions-pro'),                    
                ),
				'attributes' => array(
                    'data-conditional-id' => BEETEAM368_PREFIX . '_mtb_auto_next',
                    'data-conditional-value' => 'on',
                ),
            ));
		}		
		
		function setCookieAutoNext(){
			if(is_single() && get_post_type() === BEETEAM368_POST_TYPE_PREFIX . '_video' && !isset($_COOKIE['beeteam368_auto_next']) && beeteam368_get_option('_mtb_auto_next_mode', '_video_settings', 'off') === 'on'){
				setcookie('beeteam368_auto_next', 'true', time() + (86400 * 368), '/');	
			}
		}
		
		function video_main_toolbar_auto_next_front_end($post_id, $pos_style){
			$post_type = get_post_type($post_id);
			if($post_type != BEETEAM368_POST_TYPE_PREFIX . '_video'){
				return;
			}
			
			$mtb_auto_next = beeteam368_get_option('_mtb_auto_next', '_video_settings', 'on');
			if($mtb_auto_next === 'on'){
				$autoNextCookie = isset($_COOKIE['beeteam368_auto_next']) && $_COOKIE['beeteam368_auto_next'] == 'true'?true:false;
				$extra_class = $autoNextCookie?'primary-color-focus':'';
				
				if(!isset($_COOKIE['beeteam368_auto_next']) && beeteam368_get_option('_mtb_auto_next_mode', '_video_settings', 'off') === 'on'){
					$extra_class = 'primary-color-focus';
				}
				
				$next_url = get_permalink( beeteam368_general::get_adjacent_post_by_id($post_id, 'next', $post_type, beeteam368_get_option('_mtb_prev_next_video_query', '_video_settings', '')) );				
				$next_url = apply_filters('beeteam368_next_url_media_query', $next_url);
			?>
        		<div class="sub-block-wrapper">    
                    <div class="beeteam368-icon-item is-square tooltip-style auto-next-control <?php echo esc_attr($extra_class);?>" data-next-post="<?php echo esc_url($next_url);?>">
                        <i class="icon fas fa-fast-forward"></i>
                        <span class="tooltip-text"><?php echo esc_html__('Auto Next', 'beeteam368-extensions-pro')?></span>
                    </div>
                </div>
        	<?php
			}
		}	
		
		function create_video_player_parameter($post_id = NULL, $isPreview = 0){			
			
			$params = array(
                'video_mode' => 'embed',
                'video_formats' => 'auto',
                'video_label' => '',
                'video_url' => '',
                'media_sources' => '',
                'video_subtitles' => '',
                'video_id' => '',
                'video_network' => '',
                'video_autoplay' => 'off',
                'video_poster' => '',
                'video_ratio' => '16:9',
				'video_load_opti' => 'on',
				'video_url_preview' => '',
				'video_formats_preview' => '',
				'video_id_preview' => '',
				'video_network_preview' => '',
				'video_preview' => '0',
            );
			
			if($post_id == NULL || $post_id == 0 || $post_id == ''){
				return $params;
			}
			
			$params['post_id'] = $post_id;
			
			$params['video_mode'] = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_mode', true));
			$params['video_formats'] = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_formats', true));
			$params['video_label'] = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_label', true));
			$params['video_url'] = do_shortcode(trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_url', true)));
			$params['media_sources'] = get_post_meta($post_id, BEETEAM368_PREFIX . '_media_sources', true);
			
			$params['video_mode'] = apply_filters('beeteam368_replace_original_video_mode', $params['video_mode'], $post_id);
			$params['video_formats'] = apply_filters('beeteam368_replace_original_video_formats', $params['video_formats'], $post_id);
			$params['video_url'] = apply_filters('beeteam368_replace_original_video_url', $params['video_url'], $post_id);
			$params['media_sources'] = apply_filters('beeteam368_replace_original_media_sources', $params['media_sources'], $post_id);
			
			$params['video_subtitles'] = get_post_meta($post_id, BEETEAM368_PREFIX . '_media_subtitles', true);
			
			$params['video_id'] = $this->getVideoID($params['video_url']);
			
			$video_network = $this->getVideoNetwork($params['video_url']);
			if($video_network == 'embed'){
				$params['video_mode'] = 'embed';
			}
			if($params['video_formats'] == 'auto'){
				$params['video_network'] = $video_network;
			}else{
				$params['video_network'] = $params['video_formats'];
			}

			$global_autoplay = beeteam368_get_option('_video_autoplay', '_video_settings', 'off');
			$single_autoplay = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_autoplay', true));
			if($single_autoplay == ''){
				$autoplay = $global_autoplay;
			}else{
				$autoplay = $single_autoplay;
			}
			$params['video_autoplay'] = $autoplay;

			$params['video_poster'] = beeteam368_post_thumbnail($post_id, apply_filters('beeteam368_video_player_poster_params', array('size' => 'beeteam368_thumb_16x9_2x', 'ratio' => 'img-16x9', 'position' => 'single-post-video-player', 'html' => 'url-only', 'echo' => false), $post_id));

			$params['video_ratio'] = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_ratio', true));
			
			$global_load_opti = beeteam368_get_option('_video_load_opti', '_video_settings', 'on');
			$single_load_opti = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_load_opti', true));
			if($single_load_opti == ''){
				$load_opti = $global_load_opti;
			}else{
				$load_opti = $single_load_opti;					
			}	
			$params['video_load_opti'] = $load_opti;
			
			$params['video_url_preview'] = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_url_preview', true));
			$params['video_formats_preview'] = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_formats_preview', true));
						
			$params['video_id_preview'] = $this->getVideoID($params['video_url_preview']);
			
			$video_network_preview = $this->getVideoNetwork($params['video_url_preview']);
			if($params['video_formats_preview'] == 'auto'){
				$params['video_network_preview'] = $video_network_preview;
			}else{
				$params['video_network_preview'] = $params['video_formats_preview'];
			}

			/*Premium Video*/
			$isProtect_html = apply_filters('beeteam368_media_protect_html', '', $post_id, $params['video_url_preview'], 'video');
			$params['media_protect_html'] = $isProtect_html;
			
			$isProtect = apply_filters('beeteam368_media_protect', trim($isProtect_html)!=''?true:false, $post_id, $params['video_url_preview'], 'video');			
			$params['media_protect'] = $isProtect;			
			if($isProtect){
				if($params['video_url_preview']!='' && $params['video_network_preview'] !== 'embed'){
					$params['video_mode'] = 'pro';
					$params['video_url'] = $params['video_url_preview'];
					$params['video_network'] = $params['video_network_preview'];
					$params['video_id'] = $params['video_id_preview'];
				}elseif($params['video_url_preview']!='' && $params['video_network_preview'] === 'embed' && isset($_GET['trailer']) && $_GET['trailer'] == 1){
					$params['video_mode'] = 'embed';
					$params['video_url'] = $params['video_url_preview'];
					$params['video_network'] = $params['video_network_preview'];
					$params['video_id'] = $params['video_id_preview'];
				}else{
					$params['video_url'] = '';
				}
			}
			/*Premium Video*/
			
			/*Preview Video*/
			$params['video_preview'] = $isPreview;
			/*Preview Video*/
			
			return apply_filters('beeteam368_video_single_params_hook', $params);
		}

        public function beeteam368_pro_player( $params = array() ){
			
            if(isset($params) && is_array($params)){
				
				if(isset($params['media_protect']) && isset($params['media_protect_html']) && $params['media_protect'] && trim($params['media_protect_html']) != ''){
					if(isset($_GET['trailer']) && $_GET['trailer'] == 1){
						$trailer_mode = 1;
					}else{
						return trim($params['media_protect_html']);
					}
				}
				
                ob_start();
                $rnd_id = 'beeteam368_player_' . rand(1, 99999) . time();
				
				/*update function CSS Ratio*/
                $css_ratio = '';
                $css_ratio_class = '';

                if($params['video_ratio'] == 'auto'){
                    $default_ratio = 0;
                    $css_ratio_class = 'non-pd-player';
                }elseif($params['video_ratio'] == '' || $params['video_ratio'] == '16:9'){
                    $default_ratio = 56.25;
                    $css_ratio_class = 'pd-player';
                }else{
                    $video_ratio = explode(':', $params['video_ratio']);
                    if(count($video_ratio) === 2 && is_numeric($video_ratio[0]) && is_numeric($video_ratio[1])){
                        $default_ratio = $video_ratio[1]/$video_ratio[0]*100;
                        $css_ratio_class = 'pd-player';
                    }
                }

                if(isset($default_ratio) && $default_ratio > 0){
                    $css_ratio = 'style="padding-top:'.$default_ratio.'%;"';
                }/*update function CSS Ratio*/

                ?>
                <div id="<?php echo esc_attr($rnd_id);?>" class="beeteam368-player beeteam368-player-control">
                	<div class="beeteam368-player-wrapper-ratio" <?php echo apply_filters('beeteam368_css_ratio_in_pro_player', $css_ratio);?>></div>
                    <div class="beeteam368-player-wrapper beeteam368-player-wrapper-control temporaty-ratio <?php echo esc_attr($css_ratio_class);?>" <?php echo apply_filters('beeteam368_css_ratio_in_pro_player', $css_ratio);?>>
                    	
                        <div class="float-video-title"><h5><?php echo get_the_title($params['post_id']);?></h5></div>
                        <a href="#" title="<?php echo esc_attr__('Close', 'beeteam368-extensions-pro');?>" class="close-floating-video close-floating-video-control"><i class="fas fa-times"></i></a>
                        <a href="#" title="<?php echo esc_attr__('Scroll Up', 'beeteam368-extensions-pro');?>" class="scroll-up-floating-video scroll-up-floating-video-control"><i class="fas fa-arrow-alt-circle-up"></i></a>
                        
                        <div class="player-load-overlay">
                            <div class="loading-container loading-control abslt">
                                <div class="shape shape-1"></div>
                                <div class="shape shape-2"></div>
                                <div class="shape shape-3"></div>
                                <div class="shape shape-4"></div>
                            </div>
                        </div>
                        
                        <?php if(isset($trailer_mode) && $trailer_mode === 1){?>
                            <a href="<?php echo esc_attr(beeteam368_get_post_url($params['post_id']));?>" class="beeteam368-icon-item tooltip-style bottom-center back-to-main-media">
                                <i class="fas fa-photo-video"></i>
                                <span class="tooltip-text"><?php echo esc_html__('Main Video', 'beeteam368-extensions-pro');?></span>
                            </a>    
                        <?php }?>
                    </div>
                    
                    <?php do_action('beeteam368_after_control_player', $rnd_id, $params);?>
                    
                </div>
                <script>
                    jQuery(document).on('beeteam368PlayerLibraryInstalled', function(){
						<?php do_action('beeteam368_trigger_real_times_media', $rnd_id, $params);?>
                        jQuery('#<?php echo esc_attr($rnd_id);?>').beeteam368_pro_player(<?php echo json_encode($params);?>);
                    });
                </script>
                <?php
                $output_string = trim(ob_get_contents());
                ob_end_clean();

                return $output_string;
            }
        }
		
        function player_in_single_post($post_id = 0, $overwrite_pos = ''){
            if($post_id > 0 || (is_single() && get_post_type() === BEETEAM368_POST_TYPE_PREFIX . '_video')){							
                if($post_id == 0 || $post_id == NULL || $post_id == ''){							
                	$post_id = get_the_ID();
				}
				
				if($post_id == 0 || $post_id === FALSE){
					return;
				}
				
				if($overwrite_pos !== ''){
					switch($overwrite_pos){
						case 'player_in_playlist':
							do_action('beeteam368_before_video_player_in_single_playlist', $post_id, 'small');
							echo apply_filters('beeteam368_return_player_in_single_playlist', $this->beeteam368_pro_player($this->create_video_player_parameter($post_id)), $post_id, $overwrite_pos);
							do_action('beeteam368_after_video_player_in_single_playlist', $post_id, 'small');													
							break;
							
						case 'player_in_series':
							do_action('beeteam368_before_video_player_in_single_series', $post_id, 'small');
							echo apply_filters('beeteam368_return_player_in_single_series', $this->beeteam368_pro_player($this->create_video_player_parameter($post_id)), $post_id, $overwrite_pos);
							do_action('beeteam368_after_video_player_in_single_series', $post_id, 'small');													
							break;	
					}
										
					return;				
				}
				
				$current_filter = current_filter();
				
				$position = 'classic';
				
				$global_video_single_player_position = beeteam368_get_option('_video_single_player_position', '_video_settings', 'classic');
				$single_video_single_player_position = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_single_player_position', true));
				
				if($single_video_single_player_position === ''){
					$position = $global_video_single_player_position;
				}else{
					$position = $single_video_single_player_position;
				}
				
				if($position === 'classic' && $current_filter === 'beeteam368_before_single'){
				?>
                	<div class="classic-pos-video-player is-single-post-main-player">
						<?php
						do_action('beeteam368_before_player_in_single_video', $post_id, 'small');
                        echo apply_filters('beeteam368_return_player', $this->beeteam368_pro_player($this->create_video_player_parameter($post_id)), $post_id, $current_filter);
                        do_action('beeteam368_after_player_in_single_video', $post_id, 'small');
                        ?>
                    </div>
                <?php	
				}elseif($position === 'special' && $current_filter === 'beeteam368_before_single_primary_cw'){
                ?>
                    <div class="<?php echo esc_attr(beeteam368_container_classes_control('single-header-element')); ?> single-header-element is-single-post-main-player">
                        <div class="site__row flex-row-control">
                            <div class="site__col">
                                <?php
								do_action('beeteam368_before_player_in_single_video', $post_id, 'big');
                                echo apply_filters('beeteam368_return_player', $this->beeteam368_pro_player($this->create_video_player_parameter($post_id)), $post_id, $current_filter);
                                do_action('beeteam368_after_player_in_single_video', $post_id, 'big');
                                ?>
                            </div>
                        </div>
                    </div>
                <?php
				}
            }
        }
		
		function create_audio_player_parameter($post_id = NULL){			
			
			$params = array(
                'audio_mode' => 'embed',
                'audio_formats' => 'auto',                
                'audio_url' => '',
            );
			
			if($post_id == NULL || $post_id == 0 || $post_id == ''){
				return $params;
			}
			
			$params['post_id'] = $post_id;
			
			$params['audio_mode'] = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_audio_mode', true));
			$params['audio_formats'] = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_audio_formats', true));
			$params['audio_url'] = do_shortcode(trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_audio_url', true)));
			
			$params['audio_mode'] = apply_filters('beeteam368_replace_original_audio_mode', $params['audio_mode'], $post_id);
			$params['audio_formats'] = apply_filters('beeteam368_replace_original_audio_formats', $params['audio_formats'], $post_id);
			$params['audio_url'] = apply_filters('beeteam368_replace_original_audio_url', $params['audio_url'], $post_id);
			
			$params['audio_poster'] = beeteam368_post_thumbnail($post_id, apply_filters('beeteam368_audio_player_poster_params', array('size' => 'full', 'ratio' => 'img-16x9', 'position' => 'single-post-video-player', 'html' => 'url-only', 'echo' => false), $post_id));
			
			$audio_network = $this->getAudioNetwork($params['audio_url']);
			if($audio_network == 'embed'){
				$params['audio_mode'] = 'embed';
			}
			if($params['audio_formats'] == 'auto'){
				$params['audio_network'] = $audio_network;
			}else{
				$params['audio_network'] = $params['audio_formats'];
			}
			
			$params['audio_url_demo'] = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_audio_url_demo', true));
			$params['audio_formats_demo'] = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_audio_formats_demo', true));
						
			$audio_network_demo = $this->getAudioNetwork($params['audio_url_demo']);
			if($params['audio_formats_demo'] == 'auto'){
				$params['audio_network_demo'] = $audio_network_demo;
			}else{
				$params['audio_network_demo'] = $params['audio_formats_demo'];
			}
			
			/*Premium Audio*/
			$isProtect_html = apply_filters('beeteam368_media_protect_html', '', $post_id, $params['audio_url_demo'], 'audio');
			$params['media_protect_html'] = $isProtect_html;
			
			$isProtect = apply_filters('beeteam368_media_protect', trim($isProtect_html)!=''?true:false, $post_id, $params['audio_url_demo'], 'audio');			
			$params['media_protect'] = $isProtect;			
			if($isProtect){
				if($params['audio_url_demo']!='' && $params['audio_network_demo'] !== 'embed'){
					$params['audio_mode'] = 'pro';
					$params['audio_url'] = $params['audio_url_demo'];
					$params['audio_network'] = $params['audio_network_demo'];
				}elseif($params['audio_url_demo']!='' && $params['audio_network_demo'] === 'embed' && isset($_GET['trailer']) && $_GET['trailer'] == 1){
					$params['audio_mode'] = 'embed';
					$params['audio_url'] = $params['audio_url_demo'];
					$params['audio_network'] = $params['audio_network_demo'];
				}else{
					$params['audio_url'] = '';
				}
			}
			/*Premium Audio*/
			
			return $params;
		}
		
		public function beeteam368_audio_pro_player( $params = array() ){
			
            if(isset($params) && is_array($params)){
				
				if(isset($params['media_protect']) && isset($params['media_protect_html']) && $params['media_protect'] && trim($params['media_protect_html']) != ''){
					if(isset($_GET['trailer']) && $_GET['trailer'] == 1){
						$trailer_mode = 1;
					}else{
						return trim($params['media_protect_html']);
					}
				}
				
                ob_start();
                $rnd_id = 'beeteam368_player_' . rand(1, 99999) . time();
                ?>
                <div id="<?php echo esc_attr($rnd_id);?>" class="beeteam368-player beeteam368-player-control">
                    <div class="beeteam368-audio-player-wrapper beeteam368-player-wrapper beeteam368-player-wrapper-control temporaty-height">
                        <div class="player-load-overlay">
                            <div class="loading-container loading-control abslt">
                                <div class="shape shape-1"></div>
                                <div class="shape shape-2"></div>
                                <div class="shape shape-3"></div>
                                <div class="shape shape-4"></div>
                            </div>
                        </div>
                        
                        <?php if(isset($trailer_mode) && $trailer_mode === 1){?>
                            <a href="<?php echo esc_attr(beeteam368_get_post_url($params['post_id']));?>" class="beeteam368-icon-item tooltip-style bottom-center back-to-main-media">
                                <i class="fas fa-volume-up"></i>
                                <span class="tooltip-text"><?php echo esc_html__('Main Audio', 'beeteam368-extensions-pro');?></span>
                            </a>    
                        <?php }?>
                    </div>
                    
                    <?php do_action('beeteam368_after_control_player', $rnd_id, $params);?>
                    
                </div>
                <script>
                    jQuery(document).on('beeteam368PlayerLibraryInstalled', function(){
						<?php do_action('beeteam368_trigger_real_times_media', $rnd_id, $params);?>
                        jQuery('#<?php echo esc_attr($rnd_id);?>').beeteam368_audio_pro_player(<?php echo json_encode($params);?>);
                    });
                </script>
                <?php
                $output_string = trim(ob_get_contents());
                ob_end_clean();

                return $output_string;
            }
        }
		
		function player_audio_in_single_post($post_id = 0, $overwrite_pos = ''){
            if($post_id > 0 || (is_single() && get_post_type() === BEETEAM368_POST_TYPE_PREFIX . '_audio')){							
                if($post_id == 0 || $post_id == NULL || $post_id == ''){							
                	$post_id = get_the_ID();
				}
				
				if($post_id == 0 || $post_id === FALSE){
					return;
				}
				
				if($overwrite_pos !== ''){
					switch($overwrite_pos){
						case 'player_in_playlist':
							do_action('beeteam368_before_audio_player_in_single_playlist', $post_id, 'small');
							echo apply_filters('beeteam368_return_audio_player_in_single_playlist', $this->beeteam368_audio_pro_player($this->create_audio_player_parameter($post_id)), $post_id, $overwrite_pos);
							do_action('beeteam368_after_audio_player_in_single_playlist', $post_id, 'small');													
							break;
							
						case 'player_in_series':
							do_action('beeteam368_before_audio_player_in_single_series', $post_id, 'small');
							echo apply_filters('beeteam368_return_audio_player_in_single_series', $this->beeteam368_audio_pro_player($this->create_audio_player_parameter($post_id)), $post_id, $overwrite_pos);
							do_action('beeteam368_after_audio_player_in_single_series', $post_id, 'small');													
							break;	
					}
										
					return;				
				}
				
				$current_filter = current_filter();
				
				$position = 'classic';
				
				$global_audio_single_player_position = beeteam368_get_option('_audio_single_player_position', '_audio_settings', 'classic');
				$single_audio_single_player_position = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_audio_single_player_position', true));
				
				if($single_audio_single_player_position === ''){
					$position = $global_audio_single_player_position;
				}else{
					$position = $single_audio_single_player_position;
				}
				
				if($position === 'classic' && $current_filter === 'beeteam368_before_single'){
				?>
                	<div class="classic-pos-audio-player is-single-post-main-player">
						<?php
						do_action('beeteam368_before_player_in_single_audio', $post_id, 'small');
						echo apply_filters('beeteam368_return_audio_player', $this->beeteam368_audio_pro_player($this->create_audio_player_parameter($post_id)), $post_id, $current_filter);
						do_action('beeteam368_after_player_in_single_audio', $post_id, 'small'); 
						?>
                    </div>
                <?php	
				}elseif($position === 'special' && $current_filter === 'beeteam368_before_single_primary_cw'){
                ?>
                    <div class="<?php echo esc_attr(beeteam368_container_classes_control('single-header-element')); ?> single-header-element is-single-post-main-player">
                        <div class="site__row flex-row-control">
                            <div class="site__col">
                                <?php
								do_action('beeteam368_before_player_in_single_audio', $post_id, 'big');
								echo apply_filters('beeteam368_return_audio_player', $this->beeteam368_audio_pro_player($this->create_audio_player_parameter($post_id)), $post_id, $current_filter); 
								do_action('beeteam368_after_player_in_single_audio', $post_id, 'big');
								?>
                            </div>
                        </div>
                    </div>
                <?php
				}
            }
        }
		
		function preview_mode($class, $post_id, $params){
			
			if($params['post_type'] === BEETEAM368_POST_TYPE_PREFIX . '_video'){
				$video_preview = beeteam368_get_option('_video_preview', '_video_settings', 'on');
				if($video_preview === 'on'){
					return esc_attr($class.' preview-mode-control');
				}
			}			
			return $class;
			
		}
		
		function set_data_post_id($data, $post_id, $params){
			
			if($params['post_type'] === BEETEAM368_POST_TYPE_PREFIX . '_video'){
				$video_preview = beeteam368_get_option('_video_preview', '_video_settings', 'on');
				if($video_preview === 'on'){
					$webp_preview = '';
					$_video_url_preview = trim(get_post_meta($post_id, BEETEAM368_PREFIX . '_video_webp_url_preview', true));
					if($_video_url_preview!=''){
						$extension = pathinfo(parse_url($_video_url_preview, PHP_URL_PATH), PATHINFO_EXTENSION);
						if($extension == 'webp'){
							$webp_preview = ' data-webp-preview="'.esc_url($_video_url_preview).'"';
						}
					}
					return apply_filters('beeteam368_set_id_in_image_preview_control', $data.$webp_preview.' data-id="'.esc_attr($post_id).'"');
				}
			}			
			return $data;
			
		}
		
		function ajax_get_video_player_parameter(){
			$security = isset($_POST['security'])?sanitize_text_field($_POST['security']):'';
			
			$isPreview = 0;
			
			if (!beeteam368_ajax_verify_nonce($security, false)){				
				wp_send_json($this->create_video_player_parameter(0, $isPreview));
				return;
				die();			
			}
			
			if(isset($_POST['post_id'])&&is_numeric($_POST['post_id'])){				
				if(isset($_POST['preview'])&&is_numeric($_POST['preview'])&&$_POST['preview']==1){
					$isPreview = 1;
				}
				wp_send_json($this->create_video_player_parameter($_POST['post_id'], $isPreview));
				return;
				die();
			}
			
			wp_send_json($this->create_video_player_parameter(0, $isPreview));
			return;
			die();
		}

        function js($values, $beeteam368_header_style, $template_directory_uri, $beeteam368_theme_version)
        {
            if (is_array($values)) {
                $values[] = array('beeteam368-pro-player', BEETEAM368_EXTENSIONS_PRO_URL . 'inc/pro-player/assets/pro-player.js', [], true);
				
				$mtb_auto_next = beeteam368_get_option('_mtb_auto_next', '_video_settings', 'on');
				if($mtb_auto_next === 'on'){
					$values[] = array('js-cookie', BEETEAM368_EXTENSIONS_PRO_URL . 'inc/pro-player/assets/js.cookie.min.js', [], true);
				}
            }
            return $values;
        }

        function localize_script($define_js_object){
            if(is_array($define_js_object)){
                $define_js_object['player_library_url'] = BEETEAM368_EXTENSIONS_PRO_URL . 'inc/pro-player/assets/';
                $define_js_object['player_library_lang'] = beeteam368_get_option('_video_player_language', '_video_settings', 'en');
				$define_js_object['player_crossorigin'] = beeteam368_get_option('_crossorigin', '_video_settings', '');
				$define_js_object['player_audio_crossorigin'] = beeteam368_get_option('_audio_crossorigin', '_audio_settings', '');
				$define_js_object['player_adjust_video_size'] = beeteam368_get_option('_adjust_video_size', '_video_settings', 'on');
				$define_js_object['floating_video_desktop'] = beeteam368_get_option('_floating_video_desktop', '_video_settings', 'on');
				$define_js_object['floating_video_mobile'] = beeteam368_get_option('_floating_video_mobile', '_video_settings', 'on');
                $define_js_object['video_link_does_not_exist_text'] = esc_html__( 'Oops, Video link does not exist or has not been updated!!!', 'beeteam368-extensions-pro');
				$define_js_object['audio_link_does_not_exist_text'] = esc_html__( 'Oops, Audio link does not exist or has not been updated!!!', 'beeteam368-extensions-pro');
				$define_js_object['video_no_preview_text'] = esc_html__( 'No Preview', 'beeteam368-extensions-pro');
				
				$define_js_object['video_knbdn_loading_advertisement'] = esc_html__( 'Loading advertisement...', 'beeteam368-extensions-pro');
				$define_js_object['video_knbdn_skip_ad'] = esc_html__( 'Skip Ad', 'beeteam368-extensions-pro');
				$define_js_object['video_knbdn_skip_ad_in'] = esc_html__( 'Skip Ad in', 'beeteam368-extensions-pro');
				$define_js_object['video_knbdn_ad_single_text'] = esc_html__( 'Ad', 'beeteam368-extensions-pro');
            }

            return $define_js_object;
        }

        public function get_video_id_from_url($url = '', $regexes = array()){
            if($url == '' || !is_array($regexes)){
                return '';
            }

            foreach($regexes as $regex) {
                if(preg_match($regex, $url, $matches)) {
                    return $matches[1];
                }
            }
            return '';
        }

        public function getYoutubeID($url = ''){
            $regexes = array(
                '#(?:https?:)?//www\.youtube(?:\-nocookie)?\.com/(?:v|e|embed)/([A-Za-z0-9\-_]+)#',
                '#(?:https?(?:a|vh?)?://)?(?:www\.)?youtube(?:\-nocookie)?\.com/watch\?.*v=([A-Za-z0-9\-_]+)#',
                '#(?:https?(?:a|vh?)?://)?youtu\.be/([A-Za-z0-9\-_]+)#',
                '#<div class="lyte" id="([A-Za-z0-9\-_]+)"#',
                '#data-youtube-id="([A-Za-z0-9\-_]+)"#'
            );

            return $this->get_video_id_from_url($url, $regexes);
        }

        public function getVimeoID($url = ''){ //Vimeo
            $regexes = array(
                '#<object[^>]+>.+?http://vimeo\.com/moogaloop.swf\?clip_id=([A-Za-z0-9\-_]+)&.+?</object>#s',
                '#(?:https?:)?//player\.vimeo\.com/video/([0-9]+)#',
                '#\[vimeo id=([A-Za-z0-9\-_]+)]#',
                '#\[vimeo clip_id="([A-Za-z0-9\-_]+)"[^>]*]#',
                '#\[vimeo video_id="([A-Za-z0-9\-_]+)"[^>]*]#',
                '#(?:https?://)?(?:www\.)?vimeo\.com/([0-9]+)#',
                '#(?:https?://)?(?:www\.)?vimeo\.com/channels/(?:[A-Za-z0-9]+)/([0-9]+)#'
            );

            return $this->get_video_id_from_url($url, $regexes);
        }

        public function getDailymotionID($url = ''){
            $regexes = array(
                '#<object[^>]+>.+?http://www\.dailymotion\.com/swf/video/([A-Za-z0-9]+).+?</object>#s',
                '#//www\.dailymotion\.com/embed/video/([A-Za-z0-9]+)#',
                '#(?:https?://)?(?:www\.)?dailymotion\.com/video/([A-Za-z0-9]+)#'
            );

            return $this->get_video_id_from_url($url, $regexes);
        }

        public function getFacebookID($url = ''){
            $regexes = array(
                '~/videos/(?:t\.\d+/)?(\d+)~i',
                '#(?://|\%2F\%2F)(?:www\.)?facebook\.com(?:/|\%2F)(?:[a-zA-Z0-9]+)(?:/|\%2F)videos(?:/|\%2F)([0-9]+)#',
                '#http://www\.facebook\.com/v/([0-9]+)#',
                '#https?://www\.facebook\.com/video/embed\?video_id=([0-9]+)#',
                '#https?://www\.facebook\.com/video\.php\?v=([0-9]+)#'
            );

            return $this->get_video_id_from_url($url, $regexes);
        }

        public function getTwitchID($url = ''){
            $regexes = array(
                '#(?:www\.)?twitch\.tv/(?:[A-Za-z0-9_]+)/v/([0-9]+)#',
                '#(?:www\.)?twitch\.tv/(?:[A-Za-z0-9_]+)/c/([0-9]+)#',
                '#(?:www\.)?twitch\.tv/(?:[A-Za-z0-9_]+)/([0-9]+)#',
                '#(?:www\.)?twitch\.tv/(?:[A-Za-z0-9_]+)/video/([0-9]+)#',
                '#<object[^>]+>.+?http://www\.twitch\.tv/widgets/archive_embed_player\.swf.+?chapter_id=([0-9]+).+?</object>#s',
                '#<object[^>]+>.+?http://www\.twitch\.tv/swflibs/TwitchPlayer\.swf.+?videoId=c([0-9]+).+?</object>#s',
                '#(?:www\.)?twitch\.tv/([A-Za-z0-9_]+)#',
            );
            $return_id = $this->get_video_id_from_url($url, $regexes);

            if($return_id!='' && !is_numeric($return_id)){
                return 'channel...?><[~|~]'.$return_id;
            }

            if($return_id==''){
                $split_url = explode('/', trim($url));
                if(count($split_url)>0){
                    $count = count($split_url)-1;
                    return 'channel...?><[~|~]'.$split_url[$count];
                }
                return '';
            }
            return $return_id;
        }

        public function getDriveID($url = ''){
            $regexes = array(
                '#(?:https?://)?(?:www\.)?drive\.google\.com/file/d/([A-Za-z0-9\-_]+)#',
            );

            return $this->get_video_id_from_url($url, $regexes);
        }

        public function getVideoNetwork($url = ''){

            if($url == ''){
                return '';
            }

            $videoNetwork = '';

            if(strpos($url, 'youtube.com') || strpos($url, 'youtu.be') || strpos($url, 'youtube-nocookie.com')){
                $videoNetwork='youtube';
            }elseif(strpos($url, 'vimeo.com')){
                $videoNetwork='vimeo';
            }elseif(strpos($url, 'dailymotion.com') || strpos($url, 'dai.ly')){
                $videoNetwork='dailymotion';
            }elseif(strpos($url, 'facebook.com')){
                $videoNetwork='facebook';
            }elseif(strpos($url, 'twitch.tv')){
                $videoNetwork='twitch';
            }elseif(strpos($url, 'drive.google.com')){
                $videoNetwork='google_drive';
            }elseif(preg_match('/<iframe/', $url) || preg_match('/<object/', $url) || preg_match('/<script/', $url)){
                $videoNetwork='embed';
            }else{
                $videoNetwork='self_hosted';

                $path      = parse_url($url, PHP_URL_PATH);
                $extension = pathinfo($path, PATHINFO_EXTENSION);

                if($extension == 'm3u8'){
                    $videoNetwork = 'hls';
                }elseif($extension == 'mpd'){
                    $videoNetwork = 'mpd';
                }
            }

            return $videoNetwork;
        }
		
		public function getAudioNetwork($url = ''){

            if($url == ''){
                return '';
            }

            $audioNetwork = '';

            if(preg_match('/<iframe/', $url) || preg_match('/<object/', $url) || preg_match('/<script/', $url)){
                $audioNetwork='embed';
            }else{
                $audioNetwork='self_hosted';
            }

            return $audioNetwork;
        }

        public function getVideoID($url = ''){

            if($url == ''){
                return '';
            }

            $videoID = '';
            $videoNetwork = $this->getVideoNetwork($url);

            switch ($videoNetwork){
                case 'youtube':
                    $videoID = $this->getYoutubeID($url);
                    break;
                case 'vimeo':
                    $videoID = $this->getVimeoID($url);
                    break;
                case 'dailymotion':
                    $videoID = $this->getDailymotionID($url);
                    break;
                case 'facebook':
                    $videoID = $this->getFacebookID($url);
                    break;
                case 'twitch':
                    $videoID = $this->getTwitchID($url);
                    break;
                case 'google_drive':
                    $videoID = $this->getDriveID($url);
                    break;
            }

            return $videoID;
        }
    }
}
global $beeteam368_video_player;
$beeteam368_video_player = new beeteam368_video_player();