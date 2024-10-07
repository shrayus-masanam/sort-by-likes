// check if course is enabled
function isEnabledCourse(courseId) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("courses", (data) => {
            resolve(data.courses[courseId] == true);
        });
    });
}

function setEnabledCourse(courseId, enabled) {
    chrome.storage.sync.get("courses", (data) => {
        let courses = data.courses;
        if (enabled) {
            courses[courseId] = true;
        } else {
            delete courses[courseId];
        }

        chrome.storage.sync.set({ courses });
    });
}

// discussions are enabled by default, so we only need to store disabled discussions
// if a discussion is stored as true, it is disabled
function isEnabledDiscussion(courseId, discussionId) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("discussions", (data) => {
            resolve(data.discussions[`${courseId}-${discussionId}`] != true);
        });
    });
}

function setDisabledDiscussion(courseId, discussionId, disabled) {
    chrome.storage.sync.get("discussions", (data) => {
        let discussions = data.discussions;
        if (disabled) {
            discussions[`${courseId}-${discussionId}`] = true;
        } else {
            delete discussions[`${courseId}-${discussionId}`];
        }

        chrome.storage.sync.set({ discussions });
    });
}
