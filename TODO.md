

# Keith
- write code to recursively create the graph! We need to maintain the graph in memory!
    - recurse to a given level, at which point we have leaf nodes whose neighbors are not other nodes but rather just urls that we can use to expand that node later on if the user desires

    // global hashmap of url to node
    var map = {};

    // we root the graph at the current url
    var level = 1;
    var neighbors = [];
    for (url in urls) {
        neighbors.push(getNode(url, level));
    }
    var root = new Node(url, neighbors);

    function getNode(url, level) {
        // see if the graph already contains a node corresponding to this url, and if so return that node
        // fetch the html for the url and, IN THE CALLBACK of the html fetcher, do the following
        // get the urls from the html
        if (level == 0) {
            // create and return a leaf node
            return new LeafNode(url, urls);
        } else {
            var neighbors = [];
            for (url in urls) {
                neighbors.push(getNode(url, level - 1));
            }
            return new Node(url, neighbors);
        }
    }

- ensure no duplicate nodes (i.e. if a.com has a link to b.com and b.com has a link to a.com, then the edge between a.com and b.com should represent this. there should not be another edge from b.com to a new a.com node)
    - a----b OK
    - a----b----a NOT OK
- there might be a shit ton of links on a page... need to just display some of them
    - which ones to show?
        - first group by base url, e.g. { www.wikipedia.com: [www.wikipedia.com/cool/beans, www.wikipedia.com/who/cares], ...}
        - then maybe prioritize those that appear the most, or try to select one or two from each base url group
