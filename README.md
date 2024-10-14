<h1 align="center">
  <sub>
    <img src="https://github.com/shrayus-masanam/sort-by-likes/blob/main/src/img/csbl_1024.png" height="38" width="38">
  </sub>
  Canvas #SortByLikes
</h1>
<h3 align="center">An unofficial re-implementation of Canvas's "sort by likes" feature in discussion posts.</h3>
<br>
<div align="center"><img width="250px" src="https://github.com/user-attachments/assets/a9096cfa-0692-4c4f-ba77-c1026ba6f44f" /></div>
<br>
<a href="https://chromewebstore.google.com/detail/canvas-sortbylikes/honbnimecgkgkdcdohbjpkkedlnkdafc"><p align="center"><img src="https://developer.chrome.com/static/docs/webstore/branding/image/206x58-chrome-web-bcb82d15b2486.png" /></p></a>
<br>
<p>
Sorting by likes allows comments to be shown in an order that is more relevant to readers, where the most liked comments on a discussion thread are shown at the top. This feature used to be present on the Canvas website and mobile app, but was removed during the redesign of discussion threads.

Canvas #SortByLikes (CSBL) returns this functionality to the website through a browser extension by fetching all comments to a discussion post, sorting the comments by like-count, then intercepting further network requests and serving a custom response based on pagination info, where the most-liked comments are shown in descending order.

CSBL allows granular control over which courses and which discussions should be automatically sorted by likes. Once a Canvas course is enabled in the extension’s menu, all discussions in that course will automatically be sorted by likes unless individually opted out. This ensures that other courses aren’t affected by the feature (unless opted in), and by default all discussions in opted-in courses are sorted by likes (unless opted out).

Please note that depending on how many users your LMS has, this could put a heavy load on the backend server.
</p>
