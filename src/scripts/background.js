importScripts('./globals.js', './dataUtils.js');

// patch fetch function
chrome.webNavigation.onCommitted.addListener(async (details) => {
    if (isDiscussionPage(details.url) && details.frameId === 0) {
        let courseId = details.url.split("/")[4];
        let discussionId = details.url.split("/")[6];
        if (await isEnabledCourse(courseId) && await isEnabledDiscussion(courseId, discussionId)) {
            chrome.scripting.executeScript({
                target: {
                    tabId: details.tabId
                },
                files: ['scripts/inject.js'],
                world: 'MAIN',
                injectImmediately: true
            });
        }
    }
});

// initialize persistent data storage
chrome.storage.sync.get("courses", (data) => {
    if (data.courses == null) {
        chrome.storage.sync.set({
            courses: {}
        });
    }
});
chrome.storage.sync.get("discussions", (data) => {
    if (data.discussions == null) {
        chrome.storage.sync.set({
            discussions: {}
        });
    }
});