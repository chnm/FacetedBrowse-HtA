<?php
namespace FacetedBrowse\ViewHelper;

use FacetedBrowse\Api\Representation\FacetedBrowseFacetRepresentation;
use FacetedBrowse\FacetType\FacetTypeInterface;
use FacetedBrowse\FacetType\Unknown;
use Laminas\ServiceManager\ServiceLocatorInterface;
use Laminas\View\Helper\AbstractHelper;

class FacetedBrowse extends AbstractHelper
{
    protected $services;

    public function __construct(ServiceLocatorInterface $services)
    {
        $this->services = $services;
    }

    /**
     * Get a facet type by name.
     *
     * @param string $facetType
     * @return FacetedBrowse\FacetType\FacetTypeInterface
     */
    public function getFacetType($facetType)
    {
        return $this->services->get('FacetedBrowse\FacetTypeManager')->get($facetType);
    }

    /**
     * Prepare the data forms for all facet types.
     */
    public function prepareDataForms()
    {
        $facetTypes = $this->services->get('FacetedBrowse\FacetTypeManager');
        foreach ($facetTypes->getRegisteredNames() as $facetTypeName) {
            $this->getFacetType($facetTypeName)->prepareDataForm($this->getView());
        }
    }

    /**
     * Is this facet type known?
     *
     * @param FacetTypeInterface $facetType
     * @return bool
     */
    public function facetTypeIsKnown(FacetTypeInterface $facetType)
    {
        return !($facetType instanceof Unknown);
    }

    /**
     * Prepare the facets for all facet types.
     */
    public function prepareFacets()
    {
        $facetTypes = $this->services->get('FacetedBrowse\FacetTypeManager');
        foreach ($facetTypes->getRegisteredNames() as $facetTypeName) {
            $this->getFacetType($facetTypeName)->prepareFacet($this->getView());
        }
    }

    /**
     * Render a facet.
     *
     * @param FacetedBrowseFacetRepresentation $facet
     * @return string
     */
    public function renderFacet(FacetedBrowseFacetRepresentation $facet)
    {
        $facetType = $this->getFacetType($facet->type());
        return $facetType->renderFacet($this->getView(), $facet);
    }
}
