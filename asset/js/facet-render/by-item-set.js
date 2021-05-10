FacetedBrowse.registerFacetApplyStateHandler('by_item_set', function(facet, facetState) {
    const thisFacet = $(facet);
    facetState.forEach(function(itemSetId) {
        thisFacet.find(`input.by-item-set[data-item-set-id="${itemSetId}"]`)
            .prop('checked', true)
            .addClass('selected');
    });
});

$(document).ready(function() {

const container = $('#container');

container.on('click', '.by-item-set', function(e) {
    const thisItemSet = $(this);
    const facet = thisItemSet.closest('.facet');
    const queries = [];
    const state = [];
    facet.find('.by-item-set').not(thisItemSet).removeClass('selected');
    thisItemSet.prop('checked', !thisItemSet.hasClass('selected'));
    thisItemSet.toggleClass('selected');
    facet.find('.by-item-set.selected').each(function() {
        const id = $(this).data('itemSetId');
        queries.push(`item_set_id=${id}`);
        state.push(id);
    });
    FacetedBrowse.setFacetState(facet.data('facetId'), state, queries.join('&'));
    FacetedBrowse.triggerFacetStateChange();
});

});
