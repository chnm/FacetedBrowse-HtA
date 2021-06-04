$(document).ready(function() {

const container = $('#container');
const sectionSidebar = $('#section-sidebar');
const sectionContent = $('#section-content');

const urlCategories = container.data('urlCategories');
const urlFacets = container.data('urlFacets');
const urlBrowse = container.data('urlBrowse');

/**
 * Callback that handles a browse request error.
 *
 * @param object data
 */
const failBrowse = function(data) {
    sectionContent.html(`${Omeka.jsTranslate('Error fetching browse markup.')} ${data.status} (${data.statusText})`);
};

/**
 * Callback that handles a facet request error.
 *
 * @param object data
 */
const failFacet = function(data) {
    sectionContent.html(`${Omeka.jsTranslate('Error fetching facet markup.')} ${data.status} (${data.statusText})`);
};

/**
 * Callback that handles a category request error.
 *
 * @param object data
 */
const failCategory = function(data) {
    sectionContent.html(`${Omeka.jsTranslate('Error fetching category markup.')} ${data.status} (${data.statusText})`);
};

/**
 * Apply a previous state to the page.
 */
const applyPreviousState = function() {
    $('.facet').each(function() {
        const thisFacet = $(this);
        FacetedBrowse.handleFacetApplyState(thisFacet.data('facetType'), thisFacet.data('facetId'), this);
    });
    FacetedBrowse.triggerStateChange();
};

/**
 * Render the categories of this page.
 */
const renderCategories = function() {
    $.get(urlCategories).done(function(html) {
        sectionSidebar.html(html);
        $.get(urlBrowse).done(function(html) {
            sectionContent.html(html);
        }).fail(failBrowse);
    }).fail(failCategory);
};

// First, initialize the state.
FacetedBrowse.initState();

// Then, set the state change handler.
FacetedBrowse.setStateChangeHandler(function(facetsQuery, sortBy, sortOrder, page) {
    const categoryQuery = $('#facets').data('categoryQuery');
    const sortingQueries = [];
    const paginationQueries = [];
    // Apply sorting state.
    if (null !== sortBy) {
        sortingQueries.push(`sort_by=${sortBy}`);
    }
    if (null !== sortOrder) {
        sortingQueries.push(`sort_order=${sortOrder}`);
    }
    // Apply pagination state.
    if (null !== page) {
        paginationQueries.push(`page=${page}`);
    }
    $.get(`${urlBrowse}?${categoryQuery}&${facetsQuery}&${sortingQueries.join('&')}&${paginationQueries.join('&')}`).done(function(html) {
        sectionContent.html(html)
    }).fail(failBrowse);
});

// Then, set up the page for first load.
if (FacetedBrowse.state.categoryId) {
    // This page has a previously saved category state.
    $.get(urlFacets, {category_id: FacetedBrowse.state.categoryId}).done(function(html) {
        sectionSidebar.html(html);
        applyPreviousState();
    }).fail(failFacet);
} else if (container.data('categoryId')) {
    // There is one category. Skip categories list and show facets list.
    $.get(urlFacets, {category_id: container.data('categoryId')}).done(function(html) {
        sectionSidebar.html(html);
        applyPreviousState();
        $('#categories-return').hide();
    }).fail(failFacet);
} else {
    // There is more than one category. Show category list.
    renderCategories();
}

// Handle category click.
container.on('click', '.category', function(e) {
    e.preventDefault();
    const thisCategory = $(this);
    FacetedBrowse.resetState(thisCategory.data('categoryId'), thisCategory.data('categoryQuery'));
    $.get(urlFacets, {category_id: thisCategory.data('categoryId')}).done(function(html) {
        sectionSidebar.html(html);
        $.get(`${urlBrowse}?${thisCategory.data('categoryQuery')}`).done(function(html) {
            sectionContent.html(html);
        }).fail(failBrowse);
    }).fail(failFacet);
});

// Handle a categories return click.
container.on('click', '#categories-return', function(e) {
    e.preventDefault();
    FacetedBrowse.resetState();
    renderCategories();
});

// Handle pagination next button.
container.on('click', '.next', function(e) {
    e.preventDefault();
    const thisButton = $(this);
    const form = thisButton.prevAll('form');
    if (!thisButton.hasClass('inactive')) {
        FacetedBrowse.setPaginationState(parseInt(form.find('input[name="page"]').val()) + 1);
        $.get(thisButton.prop('href'), function(html) {
            sectionContent.html(html);
        });
    }
});

// Handle pagination previous button.
container.on('click', '.previous', function(e) {
    e.preventDefault();
    const thisButton = $(this);
    const form = thisButton.prevAll('form');
    if (!thisButton.hasClass('inactive')) {
        FacetedBrowse.setPaginationState(parseInt(form.find('input[name="page"]').val()) - 1);
        $.get(thisButton.prop('href'), function(html) {
            sectionContent.html(html);
        });
    }
});
// Handle pagination form.
container.on('submit', '.pagination form', function(e) {
    e.preventDefault();
    const thisForm = $(this);
    FacetedBrowse.setPaginationState(thisForm.find('input[name="page"]').val());
    $.get(`${urlBrowse}?${$(this).serialize()}`, {}, function(html) {
        sectionContent.html(html);
    });
});
// Handle sort form.
container.on('submit', 'form.sorting', function(e) {
    e.preventDefault();
    const thisForm = $(this);
    FacetedBrowse.setSortingState(
        thisForm.find('select[name="sort_by"]').val(),
        thisForm.find('select[name="sort_order"]').val()
    );
    $.get(`${urlBrowse}?${$(this).serialize()}`, {}, function(html) {
        sectionContent.html(html);
    });
});

// Handle permalink.
container.on('focus', '.permalink', function(e) {
    this.select();
});

});
