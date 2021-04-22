<?php
namespace FacetedBrowse\ControllerPlugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use Zend\ServiceManager\ServiceLocatorInterface;

class FacetedBrowse extends AbstractPlugin
{
    protected $services;

    public function __construct(ServiceLocatorInterface $services)
    {
        $this->services = $services;
    }

    public function getFacetTypes()
    {
        return $this->services->get('FacetedBrowse\FacetTypeManager');
    }

    public function getFacetType($facetType)
    {
        return $this->services->get('FacetedBrowse\FacetTypeManager')->get($facetType);
    }

    public function getPropertyLiteralValues($propertyId, array $query)
    {
        $api = $this->services->get('Omeka\ApiManager');
        $em = $this->services->get('Omeka\EntityManager');

        // Get the IDs of all items that satisfy the category query.
        $ids = $api->search('items', $query, ['returnScalar' => 'id'])->getContent();

        // Get all unique literal values of the specified property of the
        // specified items.
        $dql = '
        SELECT v.value value, COUNT(v.value) value_count
        FROM Omeka\Entity\Value v
        WHERE v.type = :type
        AND v.property = :propertyId
        AND v.resource IN (:ids)
        GROUP BY value
        ORDER BY value_count DESC, value ASC';
        $query = $em->createQuery($dql)
            ->setParameter('type', 'literal')
            ->setParameter('propertyId', $propertyId)
            ->setParameter('ids', $ids);
        return $query->getResult();
    }
}
