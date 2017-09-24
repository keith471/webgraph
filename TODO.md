

# Keith

## P1
- Option 1: open up a new window
    - get the html using the content script (only the content script can access the dom) and pass the html back to the background script (only the background script has access to chrome.windows)
    - run all logic in the background script for constructing the graph and displaying it
- Option 2: try to modify the html of the webpage before it loads
    - inject it into some react wrapper that allows for easy transition between the graph and the webpage
    - add a div container to the html for your react page
    - place all the other body html inside a div
    - so you have
    <body>
        <div>All the html for the page</div>
        <div>Your react container</div>
    </body>
    - when you toggle the webgraph, you simply show or hide either div
- use a window manager like in fast tab switcher

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
