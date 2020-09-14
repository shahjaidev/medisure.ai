// const openAIAPi = require("./index");

var contextMenuItem = {
  id: "summarize",
  title: "Summarize",
  contexts: ["selection"],
}

chrome.storage.sync.set({ summaryIn: "window", summaryOf: "text", tts: true })

chrome.contextMenus.create(contextMenuItem)

//When the context menu option is clicked
chrome.contextMenus.onClicked.addListener(function (clickData) {
  //Get user preferences from local storage
  chrome.storage.sync.get(["summaryIn", "summaryOf", "tts"], function (
    preferences
  ) {
      console.log(1);
    var summaryIn = preferences.summaryIn
    var summaryOf = preferences.summaryOf
    var tts = preferences.tts

    if (clickData.menuItemId == "summarize") {
        console.log(2);
      var summary
      console.log("Preferences", preferences);
      //when user preference is to get summary of whole page
      if (preferences.summaryOf == "page") {
          console.log(3)
        //get current tab id
        chrome.tabs.query(
          {
            active: true,
            lastFocusedWindow: true,
          },
          function (tabs) {
              console.log(4)
            var tab = tabs[0].id
            //send message to the curret tab to read all the text and store it in localstorage
            chrome.tabs.sendMessage(tab, "readAllText", function (response) {
              //get text all the text of current tab from the local storage
              chrome.storage.sync.get("allText", function (data) {
                  console.log("Inside")
                //summarize the text
                summarizeText(data.allText, function (summary) {
                  //show the summary
                  showSummary(summary, clickData, preferences)
                  console.log("test")
                  //if user has text to speech enabled
                  if (preferences.tts) {
                    chrome.tts.speak(summary);
                  }
                })
              })
            })
          }
        )
      } else {
          console.log("Pre summarization")
          console.log(clickData)
        //get the selectedData in summary
        summarizeText(clickData.selectionText, function (summary) {
          console.log("Summary", summary)
          showSummary(summary, clickData, preferences)
          //if user has text to speech enabled
          if (preferences.tts) {
            chrome.tts.speak(summary)
          }
        })
      }
    }
  })
})

function showSummary(summary, clickData, preferences) {
  //if the summarization is successful
  console.log(clickData);
  if (clickData.menuItemId == "summarize" && summary) {
    //user preference is show in new window
    if (preferences.summaryIn === "window") {
      var createData = {
        url: "summary.html",
        type: "popup",
        top: 5,
        left: 5,
        width: screen.availWidth / 2,
        height: parseInt(2 * (screen.availHeight / 3)),
      }
      //add summary to the local storage
      chrome.storage.sync.set({ summary: summary })
      //create the new overlay window
      chrome.windows.create(createData)
    } else {
      //user preference is show in a notification box
      //create the notification option
      var notifOptions = {
        type: "basic",
        iconUrl: chrome.runtime.getURL("images/sum24.svg"),
        title: "Summarized!",
        message: summary,
      }
      //create the notification
      chrome.notifications.create("summarizeNotif", notifOptions)
    }
  }
}

const prefix = `Text: An eligible individual’s enrollment or non-enrollment in a qualified health plan (QHP) is unintentional, inadvertent, or erroneous and as the result of the error, misrepresentation, or inaction of an officer,employee or agent of the state Marketplace, or of the Department of Health and Human Services (HHS), or its instrumentalities as determined by the Marketplace. In such cases, the Marketplace may take such action as may be necessary to correct or eliminate the effects of such error, misrepresentation or action and an individual may be allowed a special enrollment period.
Summary: If you are unenrolled from a health insurance plan unintentionally or by an employee error, you can be granted a special enrollment period.
Text:`

const suffix = "Summary:"

function summarizeText(text, callback) {
  console.log("Summarizing text")
  const req = new XMLHttpRequest()
  const baseUrl = "https://api.openai.com/v1/engines/davinci/completions"

  req.open("POST", baseUrl, true)
  req.setRequestHeader(
    "Authorization",
    "Bearer sk-0UnXMOC0I0KLxk3Qklf23BEov291dAAKhF106zk3"
  )
  req.setRequestHeader("Content-Type", "application/json")
  if (callback) {
    req.onloadend = function (e) {
      console.log(e);
      const response = JSON.parse(e.currentTarget.response)
      callback(response.choices[0].text)
    }
  }
  const jsonStr = JSON.stringify({
    prompt: prefix + text + "\n" + suffix,
    max_tokens: 100,
    temperature: 0.9,
    n: 1,
    stream: false,
    stop: ["\n", "testing"],
  });
  console.log("JSON:", jsonStr)
  req.send(jsonStr)
}

//Summarizes text
function _summarizeText(text) {
  //Summarization library used from https://github.com/wkallhof/js-summarize. Thanks to wkallhof!
  var summary = ""
  var summarizer = new JsSummarize({
    returnCount: 3,
  })
  var summaryArr = summarizer.summarize("", text)
  summaryArr.forEach(function (sentence) {
    summary += "<li>" + sentence + "</li>"
  })
  return summary
}
