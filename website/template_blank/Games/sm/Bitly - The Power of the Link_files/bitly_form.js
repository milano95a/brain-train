/* --------------------------------------------------
Wrapper class and jQuery Plugin for the marketo js library
-------------------------------------------------- */

/* --------------------------------------------------
jQuery Plugin
-------------------------------------------------- */
(function ( $ ) {

	//  Work around to prevent marketo from loading stylesheets 
	$('body').append(
		'<style>#mktoStyleLoaded {display:none;color:#123456;border-top-color:#123456;background-color:#123456}</style>' +
		'<div id="mktoStyleLoaded" class="hidden"><div id="mktoForms2BaseStyle"></div><div id="mktoForms2ThemeStyle"></div></div>'
	);

	var _newForm = MktoForms2.newForm;

	MktoForms2.newForm = function(formData, callback){
		formData.ThemeStyle = null;
		formData.ThemeStyleOverride = null;
		formData.FontUrl = null;
		_newForm(formData, callback);
	}

	// /Work around 

	// form plugin 
	jQuery.fn.loadForm = function( options ) {

		this.each(function(){

			if( !$(this).data('formid') ) return;

			var form = new BitlyForm("//app-ab01.marketo.com", "754-KBJ-733", options);

			var modal;

		    if( modal = $(this).data('modal') ){

		    	form.modalLoad( $(this), $(this).data('formid'), $(modal));

		    }else{

		   		form.load( $(this), $(this).data('formid'));

		    }

		});

	    return this;

	}

	/* --------------------------------------------------
	BitlyForm Class 
	-------------------------------------------------- */

	function BitlyForm( baseUrl, munchkinId, options ){

		var _baseUrl = baseUrl;
		var _munchkinId = munchkinId;
		var _this = this;
		var _opts = options;
		var _modal, _in_modal, _busy;

		/* --------------------------------------------------
		Render
		-------------------------------------------------- */
		this.render = function(form, element){

			element.hide();

			// remove old event listeners
			element.unbind();

			var form_element = form.render(element);

			_this.filter( element );

			element.show();

			window_resize();

			setTimeout(function(){
				window_resize();
			}, 250);
			
		}
		
		/* --------------------------------------------------
		Filter function cleans up Marketo markup
		-------------------------------------------------- */
		this.filter = function( e ){

			// classes to add
			// {target element}:{class to add}
			var add_classes = {

				".mktoForm"			:	"flush-bottom",
				".mktoFormRow"		:	"row",
				".mktoFormCol"		:	"col",
				".mktoFieldWrap"	:	"form-group",
				".mktoError"		:	"help-block",
				"input"				:	"input",
				".mktoButtonWrap"	:	"button-toolbar button-toolbar-centered flush-bottom",
				".mktoButton"		:	"button button-primary"
				
			};

			// elements to remove
			var remove_elements = [
				
				".mktoOffset",
				".mktoClear",
				".mktoGutter",
				".mktoAsterix"
				
			];
			
			// class ( careful with this one, may break forms)
			var remove_classes = [
				
				"mktoHasWidth",
				"mktoLayoutLeft",
				"mktoButton"
				
			];

			$(window).resize(function () { 
				
				// fix width
				setTimeout( function(){
					e.css('width','auto');
				},100);
				
			});

			e.css('width','auto');

			//add classes
			
			for( var c in add_classes ){
				e.find( c ).addClass( add_classes[c] );
			}
			
			//remove classes

			for( var c in remove_classes ){
				e.removeClass( remove_classes[c] );
				e.find( '.'+remove_classes[c] ).removeClass( remove_classes[c] );
			}

			//remove elements
			e.find(remove_elements.join(", ")).remove();

			// remove inline styles
			e.removeAttr("style");
			e.find("[style]").removeAttr("style");

			// create place holder text from labels
			e.find("textarea, select, input[type=text], input[type=email], input[type=tel]").each(function(){
				
				var placeholder = "";
				var label = $(this).parent().find("label");
				placeholder = label.text();
				
				if($(this).hasClass("mktoRequired")) {
					
					placeholder = placeholder + " (Required)";
					
				}
				
				placeholder = placeholder.replace("*", "");
				placeholder = placeholder.replace(":", "");
				
				if( $(this).is('select') ){

					$(this).find("option").first().html(placeholder);

				}else{

					$(this).attr("placeholder", placeholder);

				}
				
				label.addClass('hide')
				
			});

			// wrap selects
			e.find("select").wrap("<div class='select-wrapper'></div>");
			e.find("select").before("<div class='select-wrapper-inner'></div>");

			// all column classes based on the number of .cols in each .row
			e.find(".col").each(function(){
				var cols = $(this).siblings(".col").andSelf().length;
				if( cols ){
					$(this).addClass("col-small-" + (12/cols) );
				}
			});

			// checkboxes
			e.find(".mktoCheckboxList").each(function(){

				var checkboxes = $(this).find("input[type=checkbox]");

				checkboxes.each(function(index, element){

					var classes = ( index < (checkboxes.length-1) ) ? " flush-bottom" : "";

					$(this)
						.wrap("<div class='checkbox"+ classes +"'></div>")
						.after( e.find("label[for=" + $(this).attr("id") + "]") );

				});

			});

			// radio buttons
			e.find(".mktoRadioList").each(function(){

				var radios = $(this).find("input[type=radio]");

				radios.each(function(index, element){

					var classes = ( index < (radios.length-1) ) ? " flush-bottom" : "";

					$(this)
						.wrap("<div class='radio"+ classes +"'></div>")
						.after( e.find("label[for=" + $(this).attr("id") + "]") );

				});

			});

			// inverse form fields?
			e.parent(".bitly-form.inverse").find("input, .select-wrapper-inner, textarea").addClass("inverse");

			// ie9 placeholders
			setTimeout(function(){

				var ployfills = e.find(".mktoPlaceholderPolyfill");
				var placeholder;

				ployfills.each(function(){

					placeholder = e.find("label[for=" + $(this).attr("id") + "]");
					$(this).attr("placeholder", placeholder[0].childNodes[0].nodeValue.trim() );
					
				});

				if( ployfills.length ){

					window.simulate_placeholders();

				}
				
			}, 1000 );

		}

		this.getForm = function( id, callback){

			var form = MktoForms2.getForm(id);

			if( !form ){

				MktoForms2.loadForm( _baseUrl, _munchkinId, id, callback);

			}else{

				callback(form);
			}
		}

		/* --------------------------------------------------
		loadForm, wrapps MktoForms2.loadForm and applies 
		filter to incoming markup
		-------------------------------------------------- */
		this.load = function( element, id ){

			_this.getForm( id, function (form){

				_this.render(form, element.find("form") );

				form.onSuccess(function( values, followUpUrl ){

					_this.onSubmit( element.find("form") );

					return _this.finish( element, element, values, followUpUrl );

				});

			})

		}

		/* --------------------------------------------------
		loadForm, wrapps MktoForms2.loadForm and applies 
		filter to incoming markup
		-------------------------------------------------- */
		this.modalLoad = function( element, id, modal ){

			_modal = modal;

			element.click(function(){

				if( _busy ) return false;

				_busy = true;

				_this.cleanModal(modal);

				modal.find(".modal-title").html(element.data('form-title'));
				modal.find(".modal-subtitle").html(element.data('form-subtitle'));

				_this.getForm( id, function (form){

					_this.render(form, modal.find("form"));

					_in_modal = ( element.attr("thankyou-in-modal")=='true' );

					var target = _in_modal ? modal.find(".bitly-form.thankyou") : element;
		
					form.onSuccess(function( values, followUpUrl ){

						_this.onSubmit( modal.find("form") );

						return _this.finish( element, target, values, followUpUrl );

					});

					if( form.allFieldsFilled() ){

						modal.find("button").trigger('click');
						_busy = false;

					}else{

						modal
							.on('show.bs.modal', function (e) {

								modal_resize();

							})
							.on('hidden.bs.modal', function (e) {

								_this.cleanModal(modal);
								_busy = false;

							})
							.modal('show');

						modal.find("button")
							.click(_this.delayedModalResize);

						modal.find("input")
							.focus(_this.delayedModalResize)
							.blur(_this.delayedModalResize);

					}

				});

				return false;

			});

		}

		this.delayedModalResize = function(){

			setTimeout(function(){

				modal_resize();
				
			}, 100);

		}

		this.cleanModal = function(modal){

			modal
				.unbind('show.bs.modal')
				.unbind('hidden.bs.modal');

			modal.find(".modal-title").html('');
			modal.find("form").html('');
			modal.find(".thankyou").html('');
			modal.find('.form-submitting').remove();
		}

		this.finish = function( element, target, values, followUpUrl ){

			// if a success opt is provided, run it
			if( _opts && _opts.onSuccess ){

				return _opts.onSuccess.call(form.getFormElem(), form, values, followUpUrl);

			}else{

				// is marketo directing us reload the same page?
				// var stay_on_page = (window.location.pathname == followUpUrl.replace( window.location.origin, "").split("?")[0]);
				var stay_on_page = true;

				if( stay_on_page ){

					_this.loadThankyou( element, target );

					modal_resize();

					return false;

				}else{

					return true;
				}
				
			}

			_busy = false;

		}

		this.loadThankyou = function( element, target ){

			var pid = element.data('pid');
			var fid = element.data('formid');

			var ajax = '/pages/ajax/thankyou/'+pid+'/'+fid;

			$.get( ajax , null , function(data){

				if( _modal ){

					if( _in_modal ){

						_modal.find('.form-submitting').remove();

						target.html(data).show();

						modal_resize();

					}else{

						target.replaceWith(data).show();

						_modal.modal('hide');

					}

				}else{

					target.replaceWith(data).show();

				}

				initYouTubeVideos();
				init_tooltips();
				window_resize();

			});	
		}

		this.onSubmit = function( form ){

			form.hide().after(
				'<div class="form-submitting">Submitting ... </div>'
			);

		}

	}

}( jQuery ));