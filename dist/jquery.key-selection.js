/*
 *  jQuery Key Selection - v1.0
 *  Cycle throught arbitrary elements with your arrow keys and select them with enter or your mouse.
 *  
 *
 *  Made by Christian Voigt
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

		var pluginName = "keySelection",
				defaults = {
				exclusiveKeyListener: true,
				scrollToKeyHoverItem: true,
				scrollContainer: "html,body",
				scrollMargin: 10,
				selectionItemSelector:".selection-item",
				scrollAnimationDuration:150
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.options = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;

				this.init();
		}

		Plugin.prototype = {
				keys :{enter:13, up: 38, down: 40, left:37, right:39, tab:9, space:32},
				init: function () {

					var that = this;
					this.keydownHandler = function(e){
						var noPropagation = false;
						switch(e.which){
							case that.keys.left:
							case that.keys.up:
								that.up();
								noPropagation = true;
								break;
							case that.keys.right:
							case that.keys.down:
								that.down();
								noPropagation = true;
								break;
							case that.keys.space:
							case that.keys.enter:
								that.select();
								noPropagation = true;
							}
							if(noPropagation && that.options.exclusiveKeyListener){
								return false;
							}
					};
					$(document).on("keydown",this.keydownHandler);
					this.clickHandler = function(){
						that.select($(this));
					};
					$(this.element).on("click",this.options.selectionItemSelector,this.clickHandler);

				},
				down: function () {
						if(this.stopped){ return;}
						var $items = $(this.element).find(this.options.selectionItemSelector),
						$keyHover = $items.filter(".key-hover"),
						index = $items.index($keyHover);
						$keyHover.removeClass("key-hover");
						if($items.length > index+1){
							$keyHover = $($items[index+1]).addClass("key-hover");
						}else{
							$keyHover = $($items[0]).addClass("key-hover");
						}
						if(this.options.scrollToKeyHoverItem){
							this.scrollTo($keyHover);
						}
						$(this.element).trigger({
											  type:"keySelection.keyHover",
											  keyHoverElement:$keyHover.get(0)
											});

				},
				up: function () {
						if(this.stopped){ return;}
						var $items = $(this.element).find(this.options.selectionItemSelector),
						$keyHover = $items.filter(".key-hover"),
						index = $items.index($keyHover);
						$keyHover.removeClass("key-hover");
						if(index > 0){
							$keyHover = $($items[index-1]).addClass("key-hover");
						}else{
							$keyHover = $($items[$items.length-1]).addClass("key-hover");
						}
						if(this.options.scrollToKeyHoverItem){
							this.scrollTo($keyHover);
						}
						$(this.element).trigger({
											  type:"keySelection.keyHover",
											  keyHoverElement:$keyHover.get(0)
											});
				},
				select: function($el){
					if(this.stopped){ return;}
					var $selected = $(this.element).find(this.options.selectionItemSelector+".selected");
					$selected.removeClass("selected");
					if((!$el && $selected.hasClass("key-hover")) || ($el && $selected.get(0) === $el.get(0))){
						return;
					}
					if(!$el || !$el.is(this.options.selectionItemSelector)){
						$selected = $(this.element).find(this.options.selectionItemSelector+".key-hover").addClass("selected");
					}else{
						$(this.element).find(this.options.selectionItemSelector+".key-hover").removeClass("key-hover");
						$selected = $el.addClass("selected");
						$selected.addClass("key-hover");
					}
					$(this.element).trigger({
										  type:"keySelection.selection",
										  selectedElement:$selected.get(0)
										});
				},
				scrollTo: function($el){
					$(this.options.scrollContainer).animate({scrollTop: $el.offset().top - this.options.scrollMargin},this.options.scrollAnimationDuration);
				},
				start : function(){
					if(!this.stopped){ return;}
					this.init();
					this.stopped = false;
				},
				stop: function(){
					if(this.stopped){ return;}

					$(document).off("keydown",this.keydownHandler);
					$(this.element).off("click",this.options.selectionItemSelector,this.clickHandler);
					this.stopped = true;
				},
				destroy: function() {
				 
				    this.stop();
				 
				    // Remove data
				    $(this.element).removeData("plugin_" + pluginName);
				}				

		};

		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {

						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
						if((typeof options === "string" || options instanceof String) && (/stop|up|down|select|stop|start|destroy/).test(options)){
							var plugin =$.data( this, "plugin_" + pluginName);
							plugin[options].call(plugin);
						}
				});
		};

})( jQuery, window, document );
