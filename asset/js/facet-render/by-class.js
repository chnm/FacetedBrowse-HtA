$(document).ready(function() {

const container = $('#container');

container.on('click', '.by-class', function(e) {
    const thisClass = $(this);
    const facet = thisClass.closest('.facet');
    const queries = [];
    const state = [];
    facet.find('.by-class').not(thisClass).removeClass('selected');
    thisClass.prop('checked', !thisClass.hasClass('selected'));
    thisClass.toggleClass('selected');
    facet.find('.by-class.selected').each(function() {
        const id = $(this).data('classId');
        queries.push(`resource_class_id=${id}`);
        state.push(id);
    });
    FacetedBrowse.setFacetState(facet.data('facetId'), state, queries.join('&'));
    FacetedBrowse.triggerFacetStateChange();
});

});
