chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    console.log(message);
    if (message === "readAllText") {
        var text = document.body.innerText;
        chrome.storage.sync.set({ 'allText': text });
    }
}