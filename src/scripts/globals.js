function isCanvasPage(url) {
    const pattern = /^https:\/\/[^\/]+\/courses\/.*$/;; // match https://*/courses/*
    return pattern.test(url);
}

function isDiscussionPage(url) {
    const pattern = /^https:\/\/[^\/]+\/courses\/[^\/]+\/discussion_topics\/[^\/]+$/; // match https://*/courses/*/discussion_topics/*
    return pattern.test(url);
}