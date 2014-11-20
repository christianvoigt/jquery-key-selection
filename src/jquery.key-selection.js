;(function ( $, window, document, undefined ) {

		var pluginName = "keySelection",
				defaults = {
				exclusiveKeyListener: true,
				scrollToKeyHoverItem: true,
				scrollContainer: "html,body",
				scrollMargin: 10,
				selectionItemSelector:".selection-item",
				scrollAnimationDuration:150,
				keyActions:[ //use any and as many keys you want. available actions: select, up, down
					{keyCode:13, action:"select"}, //enter
					{keyCode:38, action:"up"}, //up
					{keyCode:40, action:"down"}, //down
					{keyCode:37, action:"up"}, //left
					{keyCode:39, action:"down"}, //right
					{keyCode:9, action:"down"}, //tab
					{keyCode:32, action:"select"} //space
				]
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
						$.each(that.options.keyActions,function(i, keyAction){
							if(keyAction.keyCode === e.which){
								switch(keyAction.action){
									case "up":
										that.up();
										noPropagation = true;
										break;
									case "down":
										that.down();
										noPropagation = true;
										break;
									case "select":
										that.select();
										noPropagation = true;
										break;
								}
								return false; //break out of each
							}
						});

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
				destroy : function(){
					this.stop();
					$.data(this.element, "plugin_" + pluginName, null);
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
