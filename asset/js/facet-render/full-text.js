$(document).ready(function() {

const container = $('#container');

container.on('input', '.full-text', function(e) {
    const thisFullText = $(this);
    const facet = thisFullText.closest('.facet');
    FacetedBrowse.setFacetQuery(
        facet.data('facetId'),
        `fulltext_search=${encodeURIComponent(thisFullText.val())}`
    );
});

});
