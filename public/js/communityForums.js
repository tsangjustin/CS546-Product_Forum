(function($) {
    var searchTimeout = undefined;
    var searchInput = $("#searchBox");
    var communityForumsList = $("#community-forums");
    var searchParams = {};
    var fullCommunityForum = communityForumsList.html();

    searchInput.keyup(function(e) {
        console.log(e.target.value);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            var url = "/forums/search?";
            var queryString = ""
            var queryKeys = Object.keys(searchParams);
            for (q=0, lenKeys=queryKeys.length; q < lenKeys; ++q) {
                var currKey = queryKeys[q];
                queryString += currKey + "=" + encodeURIComponent(searchParams[currKey].join(" ")) + "&";
            }
            console.log(url);
            $.ajax({
                "url": url + queryString,
                "type": "GET",
                "dataType": 'html',
                "success": function(res) {
                    console.log(res);
                    communityForumsList.innerHTML(res);
                }
            });
        }, 1500);
    });
})(jQuery)
