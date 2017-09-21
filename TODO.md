

# Keith

## P1
- replacing the html does not work well. The original page doesn't work properly when we transition back to it if we had removed the html previously. Instead, we need to modify the html to allow for an effect transition between the two pages
    - what would be awesome is if we could place the original page inside some react element that we've designed such that we can collapse and expand it really easily. If we collapse it, then we see the graph. --> try to wrap the entire html into some react html!

## P2
- there might be a shit ton of links on a page... need to just display some of them
    - which ones to show?
        - first group by base url, e.g. { www.wikipedia.com: [www.wikipedia.com/cool/beans, www.wikipedia.com/who/cares], ...}
        - then maybe prioritize those that appear the most, or try to select one or two from each base url group



## Design decisions...
- maybe it is simplest to represent the graph as a map
{
    core_url: Node(core_url, webpage_title, list_of_core_urls, is_leaf),
    core_url2: ...
}
Then we can create a node as soon as we've parsed its html. This works better since nodes don't hold direct references to their neighbors, so their neighbor nodes don't have to exist before they can exist. We create nodes as follows (createNode(url, level)):
    - we start with a url and we fetch the html for that url
    - we get the urls from the html and the title from the html
    - if this node is to be a leaf (level == 0), then we are done - we construct a new LeafNode(core_url, webpage_title, list_of_core_urls) and update the map with it
    - else, we construct a new Node(core_url, webpage_title, list_of_core_urls) and update the map with it
    - then, for each url in list_of_core_urls, we
        - check if the url is already in the map, in which case we don't do anything for this url - it is already being handled by someone else
        - else, add an entry <url, true> to the map, and recurse on this url
We kick off the node creation starting with the root node:
    - create it and add it to the map
    - for each url in its list of core_urls, we add an entry <url, true> to the map and call createNode(url, level) for the url
- the following two urls map to the same site, but are different as strings: www.google.com and google.com
    - we need to parse just the relevant part of the url (google.com) and make that the "id" of the node
    - this id is also what we should use when storing the node in the nodeMap - we call this the core url
- when getting the urls on a page, remove self-links (shouldn't have to do this with new graph structure)
