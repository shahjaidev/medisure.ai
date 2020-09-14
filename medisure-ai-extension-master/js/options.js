$(function(){

    chrome.storage.sync.get(['summaryIn','summaryOf','tts'], function(preferences){
        $('#summaryIn').val(preferences.summaryIn);
        $('#summaryOf').val(preferences.summaryOf);
        if(preferences.tts){
            $('#tts').prop('checked', true);
        } else {
            $('#tts').prop('checked', false);
        }
    });

    $('#update').click(function(){
        var summaryIn = $('#summaryIn').val();
        var summaryOf = $('#summaryOf').val();
        var tts = $('#tts').is(":checked");
        if(summaryIn && summaryOf && tts !== undefined){
            chrome.storage.sync.set({'summaryIn':summaryIn, 'summaryOf':summaryOf, 'tts':tts}, function(){
                $('#exampleModalCenter').modal('show');
            });
        }
    });

    $('#close').click(function(){
        close();
    });

});