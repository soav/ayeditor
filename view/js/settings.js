$(document).ready(function(){
    $('div.color-picker').ColorPicker({
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).find('input').first().val(hex);
			$(el).css("background-color","#"+hex).css("color","#"+hex);
			$(el).ColorPickerHide();
		},
		onBeforeShow: function () {
			$(this).ColorPickerSetColor($(this).find('input').first().val());
		}
	});
});



$(document).on('click', '.color-schemes', function() {
    showWaitbox();
    var colorShemesId = $(this).attr('data-shemes-id');
    $('input[name="settings[user_settings][colorShemeId]"]').val(colorShemesId);
    $('input[name="settings[color_shemes][color_shemes_name]"]').val($(this).attr('data-shemes-name'));
    if ($(this).attr('data-can-modify') == '1') {
        $('#color-cant-modify').css('display', 'none');
        $('input[name="settings[color_shemes][color_shemes_name]"]').removeAttr('disabled');
    } else {
        $('#color-cant-modify').css('display', 'block');
        $('input[name="settings[color_shemes][color_shemes_name]"]').attr('disabled','disabled');
    }
    
    $.post('/tracker/user/settingsGetColors/?color_shemes_id=' + colorShemesId, function(data) {
        var colors = $.parseJSON(data);
            $.each(colors, function(colorKey, colorVal){
                console.log(colorKey);
                console.log(colorVal);
                var elem = $('.color-' + colorKey);
                elem.css('background-color', '#' + colorVal);
                elem.find('input').first().val(colorVal);
            });
        
        $.popup.close();
    });
    
});

$(document).on('click', '#copy-solor-sheme', function() {
    $('#color-cant-modify').css('display', 'none');
    $('input[name="settings[color_shemes][color_shemes_name]"]').removeAttr('disabled');
    $('input[name="settings[color_shemes][color_shemes_name]"]').val($('input[name="settings[color_shemes][color_shemes_name]"]').val() + ' - new*');
    $('input[name="settings[user_settings][colorShemeId]"]').val(0);
    
})