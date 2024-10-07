
// elements in popup
let invalidSection = document.getElementById("invalidSection");
let courseSection = document.getElementById("courseSection");
let discussionSection = document.getElementById("discussionSection");

let courseToggleButton = courseSection.children[1];
let discussionToggleButton = discussionSection.children[1];


document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: getTabInfo,
        });
    });
});

// ran in the active tab
function getTabInfo() {
    let courseName = document.getElementsByClassName("ellipsible")[1]?.innerText;
    let discussionName = document.getElementsByClassName("ellipsible")[3]?.innerText;

    chrome.runtime.sendMessage({
        type: "iconClicked",
        data: {
            url: window.location.href,
            courseName,
            discussionName,
        }
    });
}


function setButtonState(enabled, button) {
    if (enabled) {
        button.classList.add("button-enabled");
        button.classList.remove("button-disabled");
        button.innerText = button.innerText.replace("Disabled", "Enabled");
    } else {
        button.classList.remove("button-enabled");
        button.classList.add("button-disabled");
        button.innerText = button.innerText.replace("Enabled", "Disabled");
    }
}

async function setDiscussionInfo(data, courseId) {
    let discussionId = data.url.split("/")[6];
    discussionSection.children[0].children[0].innerText = data.discussionName; // set discussion name in popup
    setButtonState(await isEnabledDiscussion(courseId, discussionId), discussionToggleButton);
    discussionSection.classList.remove("hidden");
}

function showReloadMessage() {
    document.getElementById("tooltipMessage").innerText = "Reload the page to apply changes!";
    document.getElementById("tooltipSection").classList.remove("hidden");
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type == "iconClicked") {
        let data = message.data;
        if (isCanvasPage(data.url) && data.courseName != null) {

            courseSection.children[0].children[0].innerText = data.courseName; // set course name in popup
            let courseId = data.url.split("/")[4]; // example: https://canvas.com/courses/000000/discussion_topics/111111, [4] is 000000

            if (await isEnabledCourse(courseId)) {
                setButtonState(true, courseToggleButton);

                // now check this specific discussion, if it is a discussion page
                if (isDiscussionPage(data.url) && data.discussionName != null) {
                    await setDiscussionInfo(data, courseId);
                }

            } else { // disabled for course
                setButtonState(false, courseToggleButton);
            }
            courseSection.classList.remove("hidden");
        

            // allow buttons to be clicked and toggled
            courseToggleButton.addEventListener("click", async () => {
                let buttonEnabled = courseToggleButton.classList.contains("button-enabled")
                setButtonState(!buttonEnabled, courseToggleButton);
                setEnabledCourse(courseId, !buttonEnabled);

                // enabled - now, if we're on a discussion page, show the discussion button
                // note that we have to use !buttonEnabled since the button was just toggled
                if (!buttonEnabled && isDiscussionPage(data.url) && data.discussionName != null) {
                    await setDiscussionInfo(data, courseId);
                } else {
                    discussionSection.classList.add("hidden");
                }

                showReloadMessage();
            });
            discussionToggleButton.addEventListener("click", () => {
                let discussionId = data.url.split("/")[6];
                let buttonEnabled = discussionToggleButton.classList.contains("button-enabled")
                setButtonState(!buttonEnabled, discussionToggleButton);
                setDisabledDiscussion(courseId, discussionId, buttonEnabled); // not !buttonEnabled since we store disabled discussions, not enabled discussions.

                showReloadMessage();
            });

        } else {
            invalidSection.classList.remove("hidden");
        }
    }
});
