!function ($) {
		
	/* --------------------------------------------------
	Event Listeners
	-------------------------------------------------- */

	$(document).ready(function() {

		init();

	});
	
	$(window).on("load", function() {
		
		// init();
		
	});

	// w3tc is not able to replace asset urls with cdn urls
	// in ajax calls, we will do it here 
	if (bitly.cdn_url) {
		
		jQuery.ajaxSetup({
			
			converters: {
				
				"text html": function( textValue ) {

					var element = jQuery(textValue);

					// bg images
					element.find("*[data-backstretch-image]").each(function(){
						$(this).attr('data-backstretch-image',
							$(this).attr('data-backstretch-image').replace(bitly.site_domain,bitly.cdn_url)
						);
					});

					// images
					element.find("img").each(function(){
						$(this).attr('src',
							$(this).attr('src').replace(bitly.site_domain,bitly.cdn_url)
						);
					});

					// download link
					element.find("a.download-link").each(function(){
						$(this).attr('href',
							$(this).attr('href').replace(bitly.site_domain,bitly.cdn_url)
						);
					});

					return element.wrapAll('<div></div>').parent().html();
				}
				
			}
			
		});
		
	}
	
	/* --------------------------------------------------
	Initialize
	-------------------------------------------------- */
	
	function init() {

		// Define Site Namespace
		
		$.bitly = {};
		
		$.bitly.stage = $("#stage");
		
		$.bitly.scrollbar_width = get_scrollbar_width();
		
		// Initialize default window resize event
		
		$(window).resize(function () { 
			
			window_resize();
			
		});
		
		window_resize();
		
		// Initialize default window scroll event
		
		$(window).scroll(function () { 
			
			window_scroll();
			
		});
		
		window_scroll();
		
		// Allow modal backdrop click to trigger close
		
		$(document.body).on('click','> .modal-backdrop',function() {
			
			$('.modal').modal('hide');
			
		});
		
		// Initialize Bootstrap Tooltip Plugin
		
		init_tooltips();

		// Update Headers with Class if they have Icons
		
		$(":header").each(function() {
			
			var heading = $(this);
			var heading_class = '';
			
			heading.find('.icon').each(function() {
				
				heading_class = 'has-icon';
				
				if($(this).hasClass('icon-small')) {
					
					heading_class = heading_class + ' has-icon-small';
					
				}
				
				if($(this).hasClass('icon-medium')) {
					
					heading_class = heading_class + ' has-icon-medium';
					
				}
				
				if($(this).hasClass('icon-large')) {
					
					heading_class = heading_class + ' has-icon-large';
					
				}
				
				if($(this).hasClass('icon-jumbo')) {
					
					heading_class = heading_class + ' has-icon-jumbo';
					
				}
				
			});
			
			heading.addClass(heading_class);
			
		})
		
		// Initialize Header Stage Sidebar Toggle
		
		$('#header-mobile-menu-button').click(function(e) {
			
			e.preventDefault();
			stage_sidebar_toggle();
			
		});
		
		// Initialize Backstretch Plugin
		
		init_backstretch('.backstretch');
		
		// Initialize Video
		
		video_init();
		
		// Initialize Dynamically Positioned Elements
		
		$('.scale-to-fit').scaleToFit();
		$('.size-to-fit').sizeToFit();
		$('.fill-vertical').fillVertical();
		$('.center-vertical').centerVertical();
		$('.center-horizontal').centerHorizontal();
		$('.vertically-balanced').verticallyBalanced();
		
		// Initialize Scroller
		
		$('.container-scrollable').perfectScrollbar();
		
		// Pie Charts
		
		$('.stat-card-pie-chart').each(function() {
			
			var percent = parseInt($(this).data('percent'));
			var deg = 360 * percent / 100;
			
			if (percent > 50) {
				
				$(this).addClass('gt-50');
				
			}
			
			$(this).find('.stat-card-pie-chart-progress-fill').css('transform', 'rotate('+ deg +'deg)');
			
		});
		
		// Simulate Placeholder Text
		
		simulate_placeholders();

		window.simulate_placeholders = simulate_placeholders;
		
		// Initialize Views
		
		views_init();
		
		// Load Marketo Forms
		
		$(".bitly-form").loadForm();

		// Bitly Link Shortener

		$('form.link-shortener').submit(function(){

			var val = $(this).find('#link-shortener-url').val();

			if( val == "" ){

				return false;

			}else{

				if( val.indexOf('http') !== 0 ){

					val = 'http://' + val;

				}
			}

		}).bind("paste",function(){

			var form = $(this);

			setTimeout(function(){

				form.submit();

			}, 100);

		});

		// Links

		$('.m-link').each(function(){
			
			var m = unescape($(this).data('mlink').split("").reverse().join(""));

			$(this).attr('href', $(this).attr('href')+m);
			
		});
		
		$('.m-text').each(function(){
			
			var m = unescape($(this).data('mlink').replace('a3%f6%47%c6%96%16%d6%','').split("").reverse().join(""));

			$(this).html(m);
			
		});

		// adjust embeded image classes
		var move_classes = ['image-fill','image-float-right','image-float-left','image-no-border','image-rounded','image-responsive','image-responsive-small','image-responsive-medium','image-responsive-large','alignleft','aligncenter','alignright','alignnone'];
			
		$('span.resource-content-body-image-wrapper').each(function(){

			for (var i = 0; i < move_classes.length; i++) {

				if( $(this).find( 'img.' + move_classes[i] ).length ){

					$(this).addClass(move_classes[i]);

				}

			};
		});

		// adjust animated gifs
		$("img.animated-gif[data-max-height]").each(function(){

			var max_height = $(this).data("max-height");
			if( ($(this).height() >= max_height) && ($(this).height() > $(this).width()) ){
				$(this)
					.css('height', max_height)
					.css('width', 'auto');
			}

		});
		
	}
	
	/* --------------------------------------------------
	Initialize: Video
	-------------------------------------------------- */
	
	function video_init() {
		
		$(".load-video").each(function() {
			
			var src_webm = $(this).data('video-webm');
			var src_ogg = $(this).data('video-ogg');
			var src_mp4 = $(this).data('video-mp4');
			var src_swf = $(this).data('video-swf');
			var autoplay = $(this).data('video-autoplay');
			
			var video = '';
			var video_swf = '';
			
			
			if(((src_webm != '') && (src_webm != null)) || ((src_ogg != '') && (src_ogg != null)) || ((src_mp4 != '') && (src_mp4 != null))) {
				
				var video = $('<video preload="auto" autoplay="' + autoplay + '" loop="" muted=""><source src="' + src_webm + '" type="video/webm"><source src="' + src_ogg + '" type="video/ogg; codecs=&quot;theora, vorbis&quot;"><source src="' + src_mp4 + '" type="video/mp4"></video>');
				
			}
			
			if((src_swf != '') && (src_swf != null)) {
				
				video_swf = $('<object scale="noborder" type="application/x-shockwave-flash" data="' + src_swf + '" id="page-header-background-video-swf" name="page-header-background-video-swf" height="100%" width="100%"><param name="movie" value="' + src_swf + '"><param name="allowScriptAccess" value="always"><param name="allowNetworking" value="all"><param name="wmode" value="opaque"></object>');
				
			}
			
			$(this).append(video);
			$(this).append(video_swf);
			
		});
		
		window_resize();
		
	}
	
	/* --------------------------------------------------
	Initialize: Views
	-------------------------------------------------- */
	
	function views_init() {
		
		if($.bitly.stage.hasClass("about")) {
			
			view_about_init();
				
		}
		
		if($.bitly.stage.hasClass("get-started-with-bitly-brand-tools")) {
			
			view_get_started_with_bitly_brand_tools_init();
				
		}
		
		if($.bitly.stage.hasClass("careers")) {
			
			view_careers_init();
				
		}
		
		if($.bitly.stage.hasClass("contact")) {
			
			view_contact_init();
				
		}
		
		if($.bitly.stage.hasClass("home")) {
			
			view_home_init();
				
		}

		if($.bitly.stage.hasClass("partners")) {
			
			view_partners_init();
				
		}

		if($.bitly.stage.hasClass("resources")) {
			
			view_resources_init();
				
		}
		
	}
	
	
		
	/* --------------------------------------------------
	Initialize: View (Careers)
	-------------------------------------------------- */
	
	function view_about_init() {
		
		$(window).scroll(function () { 
			
		});
		
		$(window).resize(function () { 
			
			view_about_resize();
			
		});

		// show/hide/randomize employee images
		var parent = $('#page-about-employees');
		var employees = parent.find('.page-about-employee');

	  	while (employees.length) {
	        parent.append(employees.splice(Math.floor(Math.random() * employees.length), 1)[0]);
	    }

		parent.find('.page-about-employee').each(function(index, item){

	    	if( index > 29 ) $(this).hide();

	    });

		// Setup Carousel for Bitly Values
		
		$("#page-about-values").carousel({
			
			speed							:	6000,
			class_active					:	'active',
			class_inactive					:	'inactive',
	        slide_animate_callback			:	function(){},
			navigation_option_previous		:	$('#page-about-values-navigation-previous'),
			navigation_option_next			:	$('#page-about-values-navigation-next'),
	        pagination						:	false,
	        pagination_navigation			:	false,
			child_selector					:	'.page-about-value'
	        
		});
		
		view_about_resize();
		
	}
	
	
	
	/* --------------------------------------------------
	Resize Event Handler: View (Careers)
	-------------------------------------------------- */
	
	function view_about_resize() {
		
		var min_width = 1000000;
		
		$('#page-about-employees .page-about-employee').each(function() {
			
			if($(this).width() < min_width) {
				
				min_width = $(this).width();
				
			}
			
		});
		
		$('#page-about-employees .page-about-employee').each(function() {
			
			$(this).height(min_width);
			
		});
		
		// Adjust Bitly Timline
		
		$("#page-about-timeline .page-about-timeline-events").removeClass('hide');
		
		var page_about_timeline_height = 0;
		var page_about_timeline_event_position_vertical = 0;
		var page_about_timeline_event_height = 0;
		var page_about_timeline_event_offset = 0;
		var page_about_timeline_event_marker_offset = 0;
		var page_about_timeline_events = $("#page-about-timeline .page-about-timeline-events .page-about-timeline-event");
		var page_about_timeline_events_index = 0;
		
		var page_about_timeline_event_above_1 = null;
		var page_about_timeline_event_above_1_year = false;
		var page_about_timeline_event_above_2 = null;
	    
	    var responsive_viewport = $(window).width() + $.bitly.scrollbar_width;
	    
	    if (responsive_viewport < 768) {
			
			page_about_timeline_events.each(function() {
				
				$(this).css({
					
					'top':	'auto'
					
				});
				
			});
			
			$("#page-about-timeline .page-about-timeline-events").css({
				
				'height':	'auto'
				
			});
			
		} else {
			
			page_about_timeline_events.each(function() {
				
				// Define Offsets
				
				page_about_timeline_event_offset = $(this).find(".page-about-timeline-event-marker").position().top;
				page_about_timeline_event_marker_offset = (2 * $(this).find(".page-about-timeline-event-marker").position().top) + $(this).find(".page-about-timeline-event-marker").outerHeight();
				
				// Define Element Height
				
				page_about_timeline_event_height = $(this).outerHeight();
				
				if (page_about_timeline_events_index == 0) {
					
					page_about_timeline_event_position_vertical = 0;
					page_about_timeline_event_above_1 = $(this);
					
				} else {
					
					if ($(this).hasClass("page-about-timeline-event-year")) {
						
						page_about_timeline_event_position_vertical = page_about_timeline_event_above_1.position().top + page_about_timeline_event_above_1.outerHeight();
						
						page_about_timeline_event_above_2 = null;
						page_about_timeline_event_above_1 = $(this);
						page_about_timeline_event_above_1_year = true;
						
					} else {
						
						if (page_about_timeline_event_above_1_year == true) {
							
							page_about_timeline_event_position_vertical = page_about_timeline_event_above_1.position().top + page_about_timeline_event_above_1.outerHeight() + parseInt(page_about_timeline_event_above_1.css('margin-top')) + parseInt(page_about_timeline_event_above_1.css('margin-bottom'));
							
							page_about_timeline_event_above_1_year = false;
							
						} else {
							
							page_about_timeline_event_position_vertical = page_about_timeline_event_position_vertical + page_about_timeline_event_marker_offset;
							
							if(page_about_timeline_event_above_2 != null) {
								
								var page_about_timeline_event_above_offset = page_about_timeline_event_above_2.position().top + page_about_timeline_event_above_2.outerHeight();
								
								if(page_about_timeline_event_above_offset > page_about_timeline_event_position_vertical) {
									
									page_about_timeline_event_position_vertical = page_about_timeline_event_above_offset + page_about_timeline_event_offset;
									
								}
								
							}
							
						}
							
						page_about_timeline_event_above_2 = page_about_timeline_event_above_1;
						page_about_timeline_event_above_1 = $(this);
						
					}
					
					
				}
				
				page_about_timeline_height = page_about_timeline_event_position_vertical + page_about_timeline_event_height;
				
				$(this).css({
					
					'top':	page_about_timeline_event_position_vertical
					
				});
				
				page_about_timeline_events_index += 1;
				
			});
			
			$("#page-about-timeline .page-about-timeline-events").height(page_about_timeline_height);
			
		}
		
	}
	
	
	
	/* --------------------------------------------------
	Initialize: View (Bitly Brand Tools Landing Page)
	-------------------------------------------------- */
	
	function view_get_started_with_bitly_brand_tools_init() {
		
		$(window).scroll(function () { 
			
		});
		
		$(window).resize(function () { 
			
		});
		
		// Setup Carousel for Bitly Values
		
		$("#page-home-trust-quotes").carousel({
			
			speed							:	8000,
			class_active					:	'active',
			class_inactive					:	'inactive',
	        slide_animate_callback			:	function(){},
			navigation_option_previous		:	null,
			navigation_option_next			:	null,
	        pagination						:	false,
	        pagination_navigation			:	false,
			child_selector					:	'.page-home-trust-quote'
	        
		});
		
	}
	
	
		
	/* --------------------------------------------------
	Initialize: View (Careers)
	-------------------------------------------------- */
	
	function view_careers_init() {
		
		$(window).scroll(function () { 
			
		});
		
		$(window).resize(function () { 
			
			view_careers_resize();
			
		});
		

		// bitly collection grid
		
		$('#page-careers-positions').collectionGrid({
			
			'filter' : '.career-filter',
			'item'   : '.page-careers-position-item',
			'type'   : 'data-department'
			
		});
		
		// Setup Carousel for Perks Grid
		
		$("#page-careers-benefits-photo-grid").carousel({
			
			speed							:	3000,
			class_active					:	'active',
			class_inactive					:	'inactive',
	        slide_animate_callback			:	function(){},
			navigation_option_previous		:	null,
			navigation_option_next			:	null,
	        pagination						:	false,
	        pagination_navigation			:	false,
			child_selector					:	'.page-careers-benefits-photo-grid-cell'
	        
		});
		
		view_careers_resize();
		
	}
	
	
	
	/* --------------------------------------------------
	Resize Event Handler: View (Careers)
	-------------------------------------------------- */
	
	function view_careers_resize() {
		
	}
	
	
		
	/* --------------------------------------------------
	Initialize: View (Contact)
	-------------------------------------------------- */
	
	function view_contact_init() {
		
		$(window).scroll(function () { 
			
		});
		
		$(window).resize(function () { 
			
			view_contact_resize();
			
		});
		
		view_contact_draw_map();
		
		view_contact_resize();
		
	}
	
	
	
	/* --------------------------------------------------
	View (Contact) Draw Map
	-------------------------------------------------- */
	
	function view_contact_draw_map() {
		
		// Initialize Google Maps
		
		var map_options = {
			
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			zoomControl: false,
			draggable: false,
			scrollwheel: false,
			styles: [
			    {
			        "featureType": "landscape",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "lightness": 65
			            },
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "lightness": 51
			            },
			            {
			                "visibility": "simplified"
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "visibility": "simplified"
			            }
			        ]
			    },
			    {
			        "featureType": "road.arterial",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "lightness": 30
			            },
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "road.local",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "lightness": 40
			            },
			            {
			                "visibility": "on"
			            }
			        ]
			    },
			    {
			        "featureType": "transit",
			        "stylers": [
			            {
			                "saturation": -100
			            },
			            {
			                "visibility": "simplified"
			            }
			        ]
			    },
			    {
			        "featureType": "administrative.province",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "lightness": -25
			            },
			            {
			                "saturation": -100
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "hue": "#ffff00"
			            },
			            {
			                "lightness": -0
			            },
			            {
			                "saturation": -97
			            }
			        ]
			    }
			]
			
		}
		
		// Draw New York Map
		
		//var new_york_pos = new google.maps.LatLng(40.7372676,-73.9920646);
		var new_york_pos = new google.maps.LatLng(40.7365034,-73.9924187);
		
		map_options.center = new_york_pos;
		
		var new_york_map = new google.maps.Map(document.getElementById("page-contact-location-map"), map_options);
		
		var new_york_map_window_content =
			"<div id='content'>"+
				"<h5 class='flush-top short'>Bitly's New York Office</h5>" +
				"<p class='flush-bottom'>" +
					"85 5th Avenue</br>" +
					"New York, NY 10003" +
				"</p>" +
			"</div>";
		
		var new_york_map_window = new google.maps.InfoWindow({
			
			content: new_york_map_window_content
			
		});
		
		google.maps.event.addDomListener(window, "resize", function() {
		    
		    var center = new_york_map.getCenter();
		    google.maps.event.trigger(new_york_map, "resize");
		    new_york_map.setCenter(center); 
		    
		});
		
	}
	
	
	
	/* --------------------------------------------------
	Resize Event Handler: View (Contact)
	-------------------------------------------------- */
	
	function view_contact_resize() {
		
	}
	
	
	
	/* --------------------------------------------------
	Initialize: View (Home)
	-------------------------------------------------- */
	
	function view_home_init() {
		
		$(window).scroll(function () { 
			
		});
		
		$(window).resize(function () { 
			
			view_home_resize();
			
		});

		// link the home page image
		$("#homepage-image").click(function(){
			window.location = "http://bitly.is/1FzYt6R";
		}).css("cursor","pointer");
		
		// Setup Carousel for Bitly Values
		
		$("#page-home-trust-quotes").carousel({
			
			speed							:	8000,
			class_active					:	'active',
			class_inactive					:	'inactive',
	        slide_animate_callback			:	function(){},
			navigation_option_previous		:	null,
			navigation_option_next			:	null,
	        pagination						:	false,
	        pagination_navigation			:	false,
			child_selector					:	'.page-home-trust-quote'
	        
		});
		
		// Setup Carousel for Bitly Tweets
		
		$("#page-home-twitter-stream").carousel({
			
			speed							:	12000,
			class_active					:	'active',
			class_inactive					:	'inactive',
	        slide_animate_callback			:	function(){},
			navigation_option_previous		:	$('#page-home-twitter-stream-navigation-previous'),
			navigation_option_next			:	$('#page-home-twitter-stream-navigation-next'),
	        pagination						:	false,
	        pagination_navigation			:	false,
			child_selector					:	'.page-home-twitter-stream-tweet'
	        
		});
		
		view_home_counter_init();
		
		view_home_resize();
		
	}
	
	function view_home_counter_init() {
		
		$('#page-home-link-shortener-counter').bitlyCount();
		
	}
	
	
	
	/* --------------------------------------------------
	Resize Event Handler: View (Home)
	-------------------------------------------------- */
	
	function view_home_resize() {
		
	}
	
	
	
	/* --------------------------------------------------
	Initialize: View (Partners)
	-------------------------------------------------- */
	
	function view_partners_init() {
		
		$(window).scroll(function () { 
			
		});
		
		$(window).resize(function () { 
			
			view_partners_resize();
			
		});
		
		// Setup Carousel for Bitly Values
		
		$(".page-partners-trust-quotes").carousel({
			
			speed							:	8000,
			class_active					:	'active',
			class_inactive					:	'inactive',
	        slide_animate_callback			:	function(){},
			navigation_option_previous		:	null,
			navigation_option_next			:	null,
	        pagination						:	false,
	        pagination_navigation			:	false,
			child_selector					:	'.page-partners-trust-quote'
	        
		});

		// bitly collection grid
		
		$('#page-partners-collection').collectionGrid({
			'filter' : '.partners-filter',
			'item'   : '.collection-grid-cell-partner'

		});
		
		view_partners_resize();
		
	}
	
	
	
	/* --------------------------------------------------
	Resize Event Handler: View (Partners)
	-------------------------------------------------- */
	
	function view_partners_resize() {
		
	}
	
	
	
	/* --------------------------------------------------
	Initialize: View (Resources)
	-------------------------------------------------- */
	
	function view_resources_init() {
		
		$(window).scroll(function () { 
			
		});
		
		$(window).resize(function () { 
			
			view_resources_resize();
			
		});

		$("a.resource-filter").click(filter_resources);

		function filter_resources(){

			var type = $(this).attr("data-type");
			var ajax = '/pages/ajax/resources/' + type;

			$("a.resource-filter").parent('li').removeClass('active');
			$("a.resource-filter[data-type='"+type+"']").parent('li').addClass('active');

			$.get( ajax , null , function(data){

				$('#resource-list').replaceWith(data);

				if (history.pushState) {
					var url = type?"/pages/resources/"+type:"/pages/resources";
					window.history.pushState(null, null, url);
				}

				init_backstretch('#resource-list .backstretch');

				$("#resource-list a.resource-filter").click(filter_resources);
		
			});	

			return false;

		}
		

		view_resources_resize();
		
	}
	
	
	/* --------------------------------------------------
	Resize Event Handler: View (Resources)
	-------------------------------------------------- */
	
	function view_resources_resize() {
		
	}
	
	/* ================================================== */
	/* Modals Resize                                      */
	/* ================================================== */
	
	function modal_resize() {
		
		$('.modal').each(function(index, value) { 
			
			// Add display:block for resizing calculations
			
			if($(this).hasClass('fade') && !$(this).hasClass('in')) {
				
				$(this).css({
					
					display:    'block'
					
				});
				
			}
			
			var modal_header = $(this).find('.modal-header');
			var modal_footer = $(this).find('.modal-footer');
			var modal_body = $(this).find('.modal-body');
			var modal_body_content = $(this).find('.modal-body-content');
			
			var window_height = $(window).height();
			var modal_header_height = modal_header.outerHeight();
			var modal_footer_height = modal_footer.outerHeight();
			var modal_body_height = modal_body.height();
			var modal_body_padding = modal_body.outerHeight() - modal_body_height;
			var modal_body_content_height = modal_body_content.outerHeight();
			var modal_total_height = modal_header_height + modal_body_padding + modal_body_content_height + modal_footer_height;
			var modal_margins = 15;
			
			if ((modal_total_height + (2 * modal_margins)) > window_height) {
				
				modal_body.css({
					
					'height'	:	window_height - modal_header_height - modal_body_padding - modal_footer_height - (2 * modal_margins)
					
				});
				
			} else {
				
				modal_body.css({
					
					'height'	:	modal_body_content_height
					
				});
				
			}
			
			$(this).css({
				
				'margin-top'	:	-1 * ($(this).outerHeight() / 2)
				
			});
			
			// Remove display:block for resizing calculations to avoid element covering screen
			
			if($(this).hasClass('fade') && !$(this).hasClass('in')) {
				
				$(this).css({
					
					display:    'none'
					
				});
				
			}
			
		});
		
	}

	window.modal_resize = modal_resize;

	/* --------------------------------------------------
	Resize Event Handler: Window
	-------------------------------------------------- */
	
	function window_resize() {
		
	    // Get Viewport width
	    
	    var responsive_viewport = $(window).width() + $.bitly.scrollbar_width;
	    
	    // If Viewport is below 481px
	    
	    if (responsive_viewport < 481) {
	    
	    }
	    
		// If Viewport is larger than 481px
	    
	    if (responsive_viewport > 481) {
	        
	    }
	    
	    // If Viewport is above or equal to 768px
	    
	    if (responsive_viewport < 768) {
	    	
	    	$("#link-shortener-url").removeClass("inverse");

	    }
	    
	    // If Viewport is above or equal to 768px

	    if( responsive_viewport >= 768 && responsive_viewport < 800 ){

	    	$("#form-header-link-shortener-url-input-group").css("width", 180 );
	    	
	    }else{

			$("#form-header-link-shortener-url-input-group").removeAttr("style");

	    }

	    if (responsive_viewport >= 768) {
	    	
	    	stage_sidebar_close();
			
		    // If Viewport is above or equal to 768px
		    
		    if ($("#header").hasClass("header-inverse")) {
		    	
		    	$("#link-shortener-url").addClass("inverse");
		    	
		    }
	    	
	    	$("#link-shortener-url").attr("placeholder", "Paste a link");

	    }
	    
	    // If Viewport is above or equal to 992px
	    
	    if (responsive_viewport > 992) {
	    	$("#link-shortener-url").attr("placeholder", "Paste a link to shorten it");
	    	
	    	
	    }
	    
	    // If Viewport is above or equal to 1160px
	    
	    if (responsive_viewport > 1400) {
	    	
	    	
	    }
	    
		/* --------------------------------------------------
		Adjust Stage Height for WP Admin Bar
		-------------------------------------------------- */
	    
	    var wordpress_admin_bar = $("#wpadminbar");
	    
	    if (wordpress_admin_bar != null) {
		   
		   var wordpress_admin_bar_height = wordpress_admin_bar.outerHeight();
		   
		   $("#stage").css({
			  
			  'margin-top'	:	wordpress_admin_bar_height
			   
		   });
		    
	    }
	    
		/* --------------------------------------------------
		Adjust Page Header Height
		-------------------------------------------------- */
	    
	    var page_header = $("#page-header");
	    var page_header_inner = $("#page-header-inner");
		
	    if (page_header.hasClass("page-header-fullscreen")) {
		    
		    var screen_height = $(window).height();
		    var page_header_height = 0;
		    
		    page_header_height = screen_height;
		    
		    if (wordpress_admin_bar != null) {
				
				page_header_height = page_header_height - wordpress_admin_bar_height;
				
			}
			
			if (page_header_height < page_header_inner.outerHeight()) {
				
				page_header_height = page_header_inner.outerHeight();
				
			}
			
			page_header.css({
				
				'height':	page_header_height
				
			});
		    
	    }
	    
		/* --------------------------------------------------
		Adjust Page Header Video Width
		-------------------------------------------------- */
	    
	    var page_header_background_video = $("#page-header-background-video");
	    var page_header_background_video_width = page_header_background_video.width();
	    var page_header_background_video_height = page_header_background_video.height();
	    
	    var page_header_background_video_player = $("#page-header-background-video video");
	    var page_header_background_video_player_width = 1280;
	    var page_header_background_video_player_height = 720;
	    
	    var page_header_background_video_player_width_new = page_header_background_video_width;
	    var page_header_background_video_player_height_new = (page_header_background_video_player_width_new / page_header_background_video_player_width) * page_header_background_video_player_height;
	    
	    if (page_header_background_video_player_height_new < page_header_background_video_height) {
		    
		    var page_header_background_video_player_height_new = page_header_background_video_height;
		    var page_header_background_video_player_width_new = (page_header_background_video_player_height_new / page_header_background_video_player_height) * page_header_background_video_player_width;
		    
	    }
	    
	    page_header_background_video_player.css({
		   
		   'width'			:	page_header_background_video_player_width_new,
		   'height'			:	page_header_background_video_player_height_new,
		   'position'		:	'absolute',
		   'top'			:	'50%',
		   'left'			:	'50%',
		   'margin-left'	:	(-1 * (page_header_background_video_player_width_new / 2)),
		   'margin-top'		:	(-1 * (page_header_background_video_player_height_new / 2))
		    
	    });
	    
		/* --------------------------------------------------
		Adjust Stage Sidebar Width
		-------------------------------------------------- */
		
		stage_sidebar_resize();
	    
		/* --------------------------------------------------
		Scroll
		-------------------------------------------------- */
		
		window_scroll();
	    		
		/* --------------------------------------------------
		Resize Modal
		-------------------------------------------------- */
		
		modal_resize();
		
		/* --------------------------------------------------
		Scroller
		-------------------------------------------------- */
		
		$('.container-scrollable').perfectScrollbar('update');

		/* --------------------------------------------------
		Adjust Dynamically Positioned Elements
		-------------------------------------------------- */
		
		$('.scale-to-fit').scaleToFit();
		$('.size-to-fit').sizeToFit();
		$('.fill-vertical').fillVertical();
		$('.center-vertical').centerVertical();
		$('.center-horizontal').centerHorizontal();
		$('.vertically-balanced').verticallyBalanced();

		/* --------------------------------------------------
		Resize Videos
		-------------------------------------------------- */
		
		adjust_fluid_videos();
		
	}
	
	window.window_resize = window_resize;
	
	/* --------------------------------------------------
	Scroll Event Handler: Window
	-------------------------------------------------- */
	
	function window_scroll() {
		
		var scroll_top = $(window).scrollTop() - $('#stage').offset().top;
		
	}
	
	
	
	/* --------------------------------------------------
	Stage Sidebar Toggle
	-------------------------------------------------- */
	
	function stage_sidebar_toggle() {
		
		if($('body').hasClass("stage-sidebar-open")) {
			
			stage_sidebar_close();
			
		} else {
			
			stage_sidebar_open();
			
		}
		
	}
	
	function stage_sidebar_open() {
		
		$('body').addClass("stage-sidebar-open");
		stage_sidebar_resize();
		
	}
	
	function stage_sidebar_close() {
		
		$('body').removeClass("stage-sidebar-open");
		stage_sidebar_resize();
		
	}
	
	function stage_sidebar_resize() {
		/*

		var stage = $("#stage");
		var stage_sidebar = $("#stage-sidebar");
		var header_inner_padding = $("#header-inner .container").css("margin-left");
		var header_mobile_menu_button_width = $("#header-mobile-menu-button").width();
		var window_total_width = $(window).width();// + $.bitly.scrollbar_width;
		var header_collapsed_total_width = (2 * parseInt(header_inner_padding)) + header_mobile_menu_button_width;
		var stage_sidebar_width = window_total_width - header_collapsed_total_width;
		
		stage_sidebar.width(stage_sidebar_width);
		
		if($('body').hasClass("stage-sidebar-open") == true) {
			
			//stage.css({"left": stage_sidebar_width});
			
		} else {
			
			//stage.css({"left": 0});
			
		}
		
*/
	}
	
	
	
	/* --------------------------------------------------
	Adjust Fluid Videos
	-------------------------------------------------- */
	
	function adjust_fluid_videos() {
		
		$("iframe[src*='player.vimeo.com'], iframe[src*='youtube.com'], object, embed").each(function() {
			
			var $video = $(this);
			var video_width_new = $video.parent().width();
			
			$video.width(video_width_new).height(video_width_new * $video.attr('data-aspectRatio'));
			
		});
		
	}
	
	window.adjust_fluid_videos = adjust_fluid_videos;
	
	/* --------------------------------------------------
	Initialize Backstretch
	-------------------------------------------------- */
	
	function init_backstretch(selector) {
		
		$(selector).each(function() {
			
			if($(this).data('backstretch-image')) {
				
				$(this).backstretch($(this).data('backstretch-image'));
				
				if($(this).data('backstretch-image-retina')) {
					
					$(this).find('img').retina('@2x');
					
				}
				
			}
			
		});
		
	}
	
	
	
	/* --------------------------------------------------
	Initialize Backstretch
	-------------------------------------------------- */
	
	function init_tooltips() {
		
		$('.has-tooltip').each(function() {
			
			if($(this).hasClass('tooltip-on-focus')) {
					
				$(this).tooltip({
					
					'html'		:	true,
					'trigger'	:	'focus',
					'container'	:	'#stage',
					'delay'		:	{
						
						show	:	200,
						hide	:	100
						
					}
					
				});
				
			} else {
					
				$(this).tooltip({
					
					'html'		: 	true,
					'trigger'	:	'hover',
					'container'	:	'#stage',
					'delay'		:	{
						
						show	:	200,
						hide	:	100
						
					}
					
				});
				
			}
				
		});
		
	}
	
	window.init_tooltips = init_tooltips;
	
	/* --------------------------------------------------
	Input Placeholder Browser Patch
	-------------------------------------------------- */
	
	function simulate_placeholders() {
		
		var input = document.createElement("input");
		
		if(('placeholder' in input) == false) {
			
			$('[placeholder]').focus(function() {
				
				var i = $(this);
				
				if(i.val() == i.attr('placeholder')) {
					
					i.val('').removeClass('placeholder');
					
					if(i.hasClass('password')) {
						
						i.removeClass('password');
						this.type='password';
						
					}
							
				}
				
			}).blur(function() {
				
				var i = $(this);	
				
				if(i.val() == '' || i.val() == i.attr('placeholder')) {
					
					if(this.type=='password') {
						
						i.addClass('password');
						this.type='text';
						
					}
					
					i.addClass('placeholder').val(i.attr('placeholder'));
					
				}
				
			}).blur().parents('form').submit(function() {
				
				$(this).find('[placeholder]').each(function() {
					
					var i = $(this);
					
					if(i.val() == i.attr('placeholder')) {
						
						i.val('');
						
					}
					
				})
				
			});
			
		}
				
	}
	
	
	
	/* --------------------------------------------------
	Get Browser Dimensions
	-------------------------------------------------- */
	
	function get_browser_dimensions() {
		
		var dimensions = {
			
			width: 0,
			height: 0
			
		};
		
		if ($(window)) {
			
			dimensions.width = $(window).width();
			dimensions.height = $(window).height();
			
		}
		
		return dimensions;
		
	}
	
	
	
	/* --------------------------------------------------
	Get Scrollbar Width
	-------------------------------------------------- */
	
	function get_scrollbar_width() {
		
	    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>'); 
	    $('body').append(div); 
	    var w1 = $('div', div).innerWidth(); 
	    div.css('overflow-y', 'auto'); 
	    var w2 = $('div', div).innerWidth(); 
	    $(div).remove(); 
	    return (w1 - w2);
	    
	}
	
	
	
	/* --------------------------------------------------
	Scale Images to Fit
	-------------------------------------------------- */
	
	$.fn.scaleToFit = function() {
		
		var page_header_navigation = $('#page-header-navigation');
		
		return this.each(function(i) {
			
			var image = $(this);
			var image_parent = $(this).parent();
			
			var image_width = image.data('original-width');
			var image_height = image.data('original-height');
			
			if ((image_width == null) || (image_height == null)) {
				
				image.data('original-width', parseInt(image.width()));
				image.data('original-height', parseInt(image.height()));
				image_width = image.data('original-width');
				image_height = image.data('original-height');
				
			}
			
			var image_width_new = image_parent.width();
			var image_height_new = (image_width_new / image_width) * image_height;
			
			if (image_height_new > image_parent.height()) {
				
				var image_height_new = image_parent.height();
				var image_width_new = (image_height_new / image_height) * image_width;
				
			}
			
			image_parent.css({
				
				'position'		:	'relative'
				
			});
			
			image.css({
				
				'width'			:	image_width_new,
				'height'		:	image_height_new,
				'position'		:	'absolute',
				'top'			:	'50%',
				'left'			:	'50%',
				'margin-left'	:	(-1 * (image_width_new / 2)),
				'margin-top'	:	(-1 * (image_height_new / 2)),
				
			});
			
		});
		
	}
	
	
	
	/* --------------------------------------------------
	Fill Elements Vertically
	-------------------------------------------------- */
	
	$.fn.fillVertical = function() {
		
		var page_header_navigation = $('#page-header-navigation');
		
		return this.each(function(i) {
			
			var innerHeight = $(this).height();
			var paddingHeight = $(this).outerHeight() - innerHeight;
			var contentHeight = $(this).find(".fit-content").height();
			var newHeight = $(window).height() - paddingHeight - page_header_navigation.outerHeight();
			var minHeight = $(this).data('fill-min-height');
			
			if (contentHeight > newHeight) {
				
				newHeight = contentHeight;
				
			}
			
			if (newHeight < minHeight) {
				
				newHeight = minHeight;
				
			}
			
			// Change height
			
			$(this).height(newHeight);
			
		});
		
	}
	
	
	
	/* --------------------------------------------------
	Center Elements Vertically
	-------------------------------------------------- */
	
	$.fn.centerVertical = function() {
		
		var responsive_viewport = $(window).width() + $.bitly.scrollbar_width;
		
		return this.each(function(i) {
		    
		    var center_vertical_screen_size_min = 0;
			var element_parent = $(this).parent();
		    
		    if($(this).data('center-vertical-screen-size-min')) {
		    	
		    	center_vertical_screen_size_min = $(this).data('center-vertical-screen-size-min');
		    	
		    }
			
			// If Viewport is less than vertically_balanced_screen_size_min
		    
		    if (responsive_viewport < center_vertical_screen_size_min) {
				
				$(this).css({
					
					"margin-top":	"auto",
					"top":			"auto",
					"position":		"relative"
					
				});
				
				element_parent.css({
					
					"position":		"relative"
					
				});
				
		    }
		    
		    // If Viewport is above or equal to vertically_balanced_screen_size_min
		    
		    if (responsive_viewport >= center_vertical_screen_size_min) {
				
				var element_height = $(this).height();
				var element_height_outer = $(this).outerHeight();
				var element_margin_top = (element_height + (element_height_outer - element_height)) / 2;
				
				if ($(this).data('size-to-fit-respect-padding')) {
					
					var element_padding_offset_top = parseInt(element_parent.css('padding-top')) / 2;
					var element_padding_offset_bottom = parseInt(element_parent.css('padding-bottom')) / 2;
					
					element_margin_top = element_margin_top - element_padding_offset_top + element_padding_offset_bottom;
					
				}
				
				$(this).css({
					
					"margin-top":	"-" + element_margin_top + "px",
					"top":			"50%",
					"position":		"absolute"
					
				});
				
				element_parent.css({
					
					"position":		"relative"
					
				});
				
			}
			
		});	
		
	};
	
	
	
	/* --------------------------------------------------
	Center Elements Horizontally
	-------------------------------------------------- */
	
	$.fn.centerHorizontal = function() {
		
		return this.each(function(i) {
			
			var parent = $(this).parent();
			var w = $(this).width();
			var ow = $(this).outerWidth();
			var ml = (w + (ow - w)) / 2;
			
			$(this).css({
				
				"margin-left":	"-" + ml + "px",
				"left":			"50%",
				"position":		"absolute"
				
			});
			
			parent.css({
				
				"position":		"relative"
				
			});
			
		});	
		
	};
	
	
	
	/* --------------------------------------------------
	Size Elements to Fit
	-------------------------------------------------- */
	
	$.fn.sizeToFit = function() {
		
		return this.each(function(i){
			
			var ratio = $(this).data('size-to-fit-ratio');
			
			switch ($(this).data('size-to-fit')) {
				
				case 'height':
					
					var padding_offset = 0;
					
					if ($(this).data('size-to-fit-respect-padding')) {
						
						padding_offset = $(this).parent().paddingTop() - $(this).parent().paddingBottom();
					}
					
					var new_height = $(this).parent().height() - padding_offset;
					var new_width = new_height * ratio;
					
					break;
						
				case 'width':
				default:
					
					var padding_offset = 0;
					
					if ($(this).data('size-to-fit-respect-padding')) {
						
						padding_offset = $(this).parent().paddingLeft() - $(this).parent().paddingRight();
					}
					
					var new_width = $(this).parent().width() - padding_offset;
					var new_height = new_width * ratio;
					
					break;
				
			};
			
			$(this).css("width", new_width);
			$(this).css("height", new_height);
			
		});	
		
	};
	
	
	
	/* --------------------------------------------------
	Vertically Balanced Columns
	-------------------------------------------------- */
	
	$.fn.verticallyBalanced = function() {
		
	    // Get Viewport width
	    
	    var responsive_viewport = $(window).width() + $.bitly.scrollbar_width;
		
		return this.each(function(i){
			
			var vertically_balanced_columns = $(this).find('.vertically-balanced-column');
		    
		    var vertically_balanced_screen_size_min = 0;
		    
		    if($(this).data('vertically-balanced-screen-size-min')) {
		    	
		    	vertically_balanced_screen_size_min = $(this).data('vertically-balanced-screen-size-min')
		    	
		    }
		    
			// If Viewport is less than 768px
		    
		    if (responsive_viewport < vertically_balanced_screen_size_min) {
				
				vertically_balanced_columns.each(function() {
					
					$(this).css({
						
						'height':	'auto'
						
					});
					
					if($(this).hasClass('vertically-balanced-column-center-vertical')) {
						
						var vertically_balanced_column_inner = $(this).find('.vertically-balanced-column-inner');
						
						vertically_balanced_column_inner.css({
							
							"margin-top":	"auto",
							"top":			"none",
							"position":		"relative"
							
						});
						
					}
					
				});
				
		    }
		    
		    // If Viewport is above or equal to vertically_balanced_screen_size_min
		    
		    if (responsive_viewport >= vertically_balanced_screen_size_min) {
		    	
				var vertically_balanced_columns_height_max = 0;
			    
				vertically_balanced_columns.each(function() {
					
					var vertically_balanced_column_inner = $(this).find('.vertically-balanced-column-inner');
					
					if (!vertically_balanced_column_inner.length) {
						
						$(this).wrapInner("<div class='vertically-balanced-column-inner'></div>");
						
						vertically_balanced_column_inner = $(this).find('.vertically-balanced-column-inner');
						
					}
					
					if (vertically_balanced_column_inner.height() > vertically_balanced_columns_height_max) {
						
						vertically_balanced_columns_height_max = vertically_balanced_column_inner.height();
						
					}
					
				});
				
				vertically_balanced_columns.each(function() {
					
					var offset_h = $(this).outerHeight() - $(this).height();
					
					$(this).css({
						
						'height':	vertically_balanced_columns_height_max + offset_h
						
					});
					
					if($(this).hasClass('vertically-balanced-column-center-vertical')) {
						
						var vertically_balanced_column_inner = $(this).find('.vertically-balanced-column-inner');
						
						var vertically_balanced_column_inner_height = vertically_balanced_column_inner.height();
						var vertically_balanced_column_inner_outer_height = vertically_balanced_column_inner.outerHeight();
						var vertically_balanced_column_inner_margin_top = (vertically_balanced_column_inner_height + (vertically_balanced_column_inner_outer_height - vertically_balanced_column_inner_height)) / 2;
						
						vertically_balanced_column_inner.css({
							
							"margin-top":	"-" + vertically_balanced_column_inner_margin_top + "px",
							"top":			"50%",
							"position":		"absolute",
							"width":		'100%'
							
						});
						
						$(this).css({
							
							"position":		"relative"
							
						});
						
					}
					
				});
		    	
		    }
			
		});
		
	};
	
	/* --------------------------------------------------
	Initialize youtube
	-------------------------------------------------- */
	
	window.initYouTubeVideos = function(){

		$(function(){

			$(".youtube-player[data-video]").each(function(){

				var video = $(this).data('video');
				var id = video + "-" + (1000*Math.random());
				$(this).attr('id', id);

				var player = new YT.Player(id,{
					
					videoId: video,          
					events: {
			            'onReady': onPlayerReady
			        }
					
				});

				adjust_fluid_videos();

				function onPlayerReady(){
					
					adjust_fluid_videos();
				}
				
			});
			
			$("iframe[src^='http://player.vimeo.com'], iframe[src^='https://www.youtube.com'], iframe[src^='http://www.youtube.com'], object, embed").each(function() {
				
				$(this).attr('data-aspectRatio', this.height / this.width).removeAttr('height').removeAttr('width');
				
			});
			
		});

	}

	window.onYouTubeIframeAPIReady = window.initYouTubeVideos;
	
	
	
} (window.jQuery)