$(function(){
    chrome.storage.sync.get(['summary'], function(data){
        $('#summary').html(data.summary);
    });
});