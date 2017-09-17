

# Keith
- Use a node library for async retrieval of webpage instead of jquery which fucking sucks
- refactor content.js to use new node package
- Uncomment code in node.js and content.js and make sure it compiles and runs

- Once code is working, see what the output is when running the extension on a webpage!

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
- to avoid
- content.js - figure out how to import ajax
- try to run and see if code runs without errors
- line 79 of content - get urls from html!!!
- verify that the graph has been created! Then you'll have to talk with harry about constructing the html from the graph!
- ensure no duplicate nodes (i.e. if a.com has a link to b.com and b.com has a link to a.com, then the edge between a.com and b.com should represent this. there should not be another edge from b.com to a new a.com node)
    - a----b OK
    - a----b----a NOT OK
- there might be a shit ton of links on a page... need to just display some of them
    - which ones to show?
        - first group by base url, e.g. { www.wikipedia.com: [www.wikipedia.com/cool/beans, www.wikipedia.com/who/cares], ...}
        - then maybe prioritize those that appear the most, or try to select one or two from each base url group
- figure out how to use npm with chrome extensions
- improve inefficiency associated with potentially constructing the same node twice... this roots from the fact that we decide to make a node if it does not already exist in the nodeMap when in fact we could already be in the process of constructing that node, and it has simply yet to be added. One solution would be to check that if the node is already being constructed (i.e. just its url is in the map) and listen for a node creation event that can be emitted with the node's url once it has been made.
