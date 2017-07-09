function showWaitbox() {
    $.popup({'content':'<div class="waitbox"></div>'});
}

$(document).on('click', '.selector-item', function() {
    var selector = $(this).parents('.selector').first();
    selector.find('div').removeClass('selected');
    $(this).addClass('selected');
});

/*--- запрет перетаскивания ---*/
$(document).on('dragstart', '*', function(e){
    if (!$(this).hasClass('drag')) {
        e.preventDefault();
        return false;
    }
});
/*--- запрет выделения ---*/
$(document).on('selectstart', '*', function(e){
    var sender = e.target || e.srcElement;
    if (sender.tagName.match(/INPUT|TEXTAREA/i)) {
        return;
    }
	e.preventDefault();
    return false;
});