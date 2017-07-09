(function (window, document, Math, $, undefined) {

	var popup_main,
		popup_content,
		popup_shadow,
		options,
		popup_html = '\
			<div class="popup-shadow">&nbsp;</div>\
			<div class="popup">\
				<div class="popup-content"></div>\
				<div class="popup-close">&times;</div>\
			</div>';

	$.popup = function(user_options) {
		options = $.extend({}, {
			content: '',
			padding: '0px',
			showCloseButton: false,
			hideOnShadowClick: true,
			beforeClose: false,
			afterClose: false,
			beforeOpen: false,
			afterOpen: false,
		}, user_options);
		popup_main = $('div.popup');
		if (popup_main.length == 0) {
			$('body').append(popup_html);
			popup_main = $('div.popup');
			$(document).on('click', 'div.popup-shadow', function(){
				$.popup.close();
				return false;
			});
			$(document).on('click', '.popup-close', function(){
				$.popup.close();
				return false;
			});
			$(document).on('click', '.popup-cancel', function(){
				$.popup.close();
				return false;
			});
		}
		
		if (options.beforeOpen != false) {
			options.beforeOpen();
		}
		
		popup_main.css('opacity','0').css('top','0px').css('left','0px').css('padding', options.padding).css('display', 'block');
		if (options.showCloseButton) {
			popup_main.find('.popup-close').css('display', 'inline-block');
		} else {
			popup_main.find('.popup-close').css('display', 'none');
		}
		popup_content = $('div.popup-content');
		popup_shadow = $('div.popup-shadow');
		popup_content.html(options.content);
		var top = Math.round(($(window).height() - popup_main.height())/2);
		var left = Math.round(($(window).width() - popup_main.width())/2);
		if (top < 0) {
			top = 0;
		}
		if (left < 0) {
			left = 0;
		}
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
		popup_main.css('top', top + scrollTop).css('left', left + scrollLeft).css('opacity','1');
		popup_shadow.css('display','block');
		
		if (options.afterOpen != false) {
			options.afterOpen();
		}
		
		return this;
	};

	$.popup.close = function() {
		if (options.beforeClose != false) {
			options.beforeClose();
		}
		if (popup_main != undefined && popup_main.length != 0) {
			popup_main.css('display', 'none');
			popup_shadow.css('display', 'none');
			popup_content.html('');
		}
		if (options.afterClose != false) {
			options.afterClose();
		}
	};

	$.popup.is_opened = function() {
		if (popup_main == undefined || popup_main.length == 0) {
			return false;
		}
		return (popup_main.css('display') == 'block');
	};
}(window, document, Math, jQuery));