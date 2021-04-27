FacetedBrowse.registerFacetAddEdit('property_literal', function() {
    $('#property-literal-property-id').chosen({
        allow_single_deselect: true,
    });
    $('#property-literal-query-type').chosen({
        disable_search: true,
    });
    $('#property-literal-select-type').chosen({
        disable_search: true,
    });
});
FacetedBrowse.registerFacetSet('property_literal', function() {
    const propertyId = $('#property-literal-property-id');
    const queryType = $('#property-literal-query-type');
    const selectType = $('#property-literal-select-type');
    if (!propertyId.val()) {
        alert(Omeka.jsTranslate('A facet must have a property.'));
    } else if (!queryType.val()) {
        alert(Omeka.jsTranslate('A facet must have a query type.'));
    } else if (!selectType.val()) {
        alert(Omeka.jsTranslate('A facet must have a select type.'));
    } else {
        return {
            property_id: propertyId.val(),
            query_type: queryType.val(),
            select_type: selectType.val(),
            values: $('#property-literal-values').val()
        };
    }
});
// Handle show all values.
$(document).on('click', '#property-literal-show-all-values', function(e) {
    const allValues = $('#property-literal-all-values');
    if (this.checked) {
        $.get(allValues.data('valuesUrl'), {
            property_id: $('#property-literal-property-id').val(),
            query: $('#category-query').val()
        }, function(data) {
            if (data.length) {
                data.forEach(value => {
                    allValues.append(`<tr><td style="width: 90%; padding: 0; border-bottom: 1px solid #dfdfdf;">${value.value}</td><td style="width: 10%; padding: 0; border-bottom: 1px solid #dfdfdf;">${value.value_count}</td></tr>`);
                });
            } else {
                allValues.append(`<tr><td>${Omeka.jsTranslate('There are no available values.')}</td></tr>`);
            }
        });
    } else {
        allValues.empty();
    }
});
// Handle property ID select.
$(document).on('change', '#property-literal-property-id', function(e) {
    $('#property-literal-show-all-values').prop('checked', false);
    $('#property-literal-all-values').empty();
});
