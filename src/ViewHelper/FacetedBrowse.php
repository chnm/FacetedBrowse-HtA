<?php
namespace FacetedBrowse\ViewHelper;

use Laminas\ServiceManager\ServiceLocatorInterface;
use Laminas\View\Helper\AbstractHelper;

class FacetedBrowse extends AbstractHelper
{
    protected $services;

    public function __construct(ServiceLocatorInterface $services)
    {
        $this->services = $services;
    }

    public function getFacetType($facetType)
    {
        return $this->services->get('FacetedBrowse\FacetTypeManager')->get($facetType);
    }

    public function prepareDataForms()
    {
        $facetTypes = $this->services->get('FacetedBrowse\FacetTypeManager');
        foreach ($facetTypes->getRegisteredNames() as $facetTypeName) {
            $this->getFacetType($facetTypeName)->prepareDataForm($this->getView());
        }
    }
}
