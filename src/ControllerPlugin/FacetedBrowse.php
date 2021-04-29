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

    /**
     * Get the facet type manager.
     *
     * @return FacetedBrowse\FacetType\Manager
     */
    public function getFacetTypes()
    {
        return $this->services->get('FacetedBrowse\FacetTypeManager');
    }

    /**
     * Get all available values and their counts of a property.
     *
     * @param int $propertyId
     * @param string $queryType
     * @param array $categoryQuery
     * @return array
     */
    public function getValueLiteralValues($propertyId, $queryType, array $categoryQuery)
    {
        $api = $this->services->get('Omeka\ApiManager');
        $em = $this->services->get('Omeka\EntityManager');

        // Get the IDs of all items that satisfy the category query.
        $ids = $api->search('items', $categoryQuery, ['returnScalar' => 'id'])->getContent();

        $qb = $em->createQueryBuilder();
        $qb->from('Omeka\Entity\Value', 'v')
            ->andWhere('v.type = :type')
            ->andWhere($qb->expr()->in('v.resource', $ids))
            ->groupBy('value')
            ->orderBy('value_count', 'DESC')
            ->addOrderBy('value', 'ASC');
        if ('res' === $queryType) {
            $qb->select("CONCAT(vr.id, ' ', vr.title) value", 'COUNT(v) value_count')
                ->join('v.valueResource', 'vr')
                ->setParameter('type', 'resource');
        } else {
            $qb->select('v.value value', 'COUNT(v.value) value_count')
                ->setParameter('type', 'literal');
        }
        if ($propertyId) {
            $qb->andWhere('v.property = :propertyId')
                ->setParameter('propertyId', $propertyId);
        }
        return $qb->getQuery()->getResult();
    }

    /**
     * Get all available classes and their counts.
     *
     * @param arry $query
     * @return array
     */
    public function getResourceClassClasses(array $query)
    {
        $api = $this->services->get('Omeka\ApiManager');
        $em = $this->services->get('Omeka\EntityManager');

        // Get the IDs of all items that satisfy the category query.
        $itemIds = $api->search('items', $query, ['returnScalar' => 'id'])->getContent();

        $dql = '
        SELECT CONCAT(v.label, \': \', rc.label) label, COUNT(i.id) item_count
        FROM Omeka\Entity\Item i
        JOIN i.resourceClass rc
        JOIN rc.vocabulary v
        WHERE i.id IN (:itemIds)
        GROUP BY rc.id
        ORDER BY item_count DESC';
        $query = $em->createQuery($dql)
            ->setParameter('itemIds', $itemIds);
        return $query->getResult();
    }
}
