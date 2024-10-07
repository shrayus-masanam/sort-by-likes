
const _fetch = window.fetch;

let sortedComments;

function isSearchRequest(url) {
    // match https://*/api/graphql
    /*
    const pattern = /^https:\/\/[^\/]+\/api\/graphql$/;
    return pattern.test(url);
    */
    return url.endsWith("/api/graphql"); // probably fine
}

async function refresh_comments() {
    let clicked_times = 0;

    while (clicked_times < 2) {
        let button_span = document.getElementsByClassName("discussions-sort-button")[0];
        if (button_span != null) {
            button_span.children[0].click(); // "Sort" button on Canvas
            clicked_times++;
        }
        await new Promise(r => setTimeout(r, 500));
    }
}

async function fetchAllComments(...arguments) {
    let resource = arguments[0]
    let config = { ...arguments[1] };

    let body = JSON.parse(config.body);

    let discussionID = body.variables.discussionID;
    let rootEntries = body.variables.rootEntries;
    if (sortedComments == null && body != null && body.variables != null && discussionID != null && rootEntries == true) {
        body.variables = {
            discussionID: body.variables.discussionID,
            filter: "all",
            page: "MA==", // b64 encoded 0
            perPage: 100000, // fetch all comments
            rootEntries: true,
            searchTerm: "",
            sort: "desc",
            unreadBefore: ""
        }
        config.body = JSON.stringify(body);
        config.signal = null; // remove signal to prevent another script from aborting the request

        let animation;
        setTimeout(() => {
            try {
                if (sortedComments != null) return;

                let statusElement = document.getElementsByClassName("css-1vx9cwx-view--block")[0];
                statusElement.innerHTML += "<br><br><strong><span id=\"csbl-user-status\" style=\"color: blue;\">Sorting replies by likes</span></strong>";

                // animate the status text
                let dots = 0;
                animation = setInterval(async () => {
                    let indicator = document.getElementById("csbl-user-status");
                    if (indicator == null) {
                        clearInterval(animation);
                        return;
                    }
                    indicator.innerText = "Sorting replies by likes" + ".".repeat(dots);
                    dots = (dots + 1) % 4;
                }, 250);

            } catch(e) {
                console.log(e);
            }
        }, 4000);

        let req = await _fetch(resource, config);
        if (req.ok) {
            let res;
            try {
                res = await req.json();
            } catch (e) {}

            if (res == null || res.errors) return;
            if (res.data.legacyNode == null || res.data.legacyNode.discussionEntriesConnection == null) return;

            let comments = res.data.legacyNode.discussionEntriesConnection.nodes;

            // sort comments by likes, descenidng order
            comments.sort((a, b) => {
                return b.ratingSum - a.ratingSum;
            });

            sortedComments = comments; // sort is complete
            setTimeout(() => {
                refresh_comments();
            }, 2500);
            if (animation != null) clearInterval(animation);
        }
    }
}

async function getSortedComments(...arguments) {
    let config = { ...arguments[1] };

    let body = JSON.parse(config.body);
    if (body.variables?.searchTerm && body.variables?.searchTerm != "") return _fetch(...arguments);

    let page = body.variables?.page;
    let perPage = body.variables?.perPage;
    if (page == null || perPage == null) return _fetch(...arguments);
    page = parseInt(atob(page));

    let req = await _fetch(...arguments);
    if (req.ok) {
        let res;
        try {
            res = await req.clone().json();
        } catch (e) {}

        if (res == null || res.errors) return req;
        if (res.data.legacyNode == null || res.data.legacyNode.discussionEntriesConnection == null) return req;

        res.data.legacyNode.discussionEntriesConnection.nodes = sortedComments.slice(page * perPage, (page + 1) * perPage);
        return new Response(JSON.stringify(res), {
            status: req.status,
            statusText: req.statusText,
            headers: req.headers
        });
    }
}

window.fetch = async (...arguments) => {
    if (isSearchRequest(arguments[0])) {
        if (sortedComments == null) {
            try {
                fetchAllComments(...arguments);
            } catch (e) {
                console.log(e);
            }
        } else {
            // sorted comments already exist
            return await getSortedComments(...arguments);
        }
    }
    return _fetch(...arguments);
};