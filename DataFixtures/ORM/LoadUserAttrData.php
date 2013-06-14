<?php

namespace Pim\Bundle\DemoBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\Persistence\ObjectManager;

/**
 * Load demo user data (copy / paste from bap demo)
 *
 * @author    Nicolas Dupont <nicolas@akeneo.com>
 * @copyright 2013 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 *
 */
class LoadUserAttrData extends AbstractFixture implements OrderedFixtureInterface, ContainerAwareInterface
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * {@inheritDoc}
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * Load sample user group data
     *
     * @param \Doctrine\Common\Persistence\ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        return true;
        /**
         * @var Oro\Bundle\UserBundle\Entity\UserManager
         */
        $fm = $this->container->get('oro_user.manager');
        $sm = $fm->getStorageManager();

        $attr = $fm
            ->createAttribute('pim_product_text')
            ->setCode('company')
            ->setLabel('Company');

        $sm->persist($attr);

        $attr = $fm
            ->createAttribute('pim_product_money')
            ->setCode('salary')
            ->setLabel('Salary');

        $sm->persist($attr);

        $attr = $fm
            ->createAttribute('pim_product_textarea')
            ->setCode('address')
            ->setLabel('Address');

        $sm->persist($attr);

        $attr = $fm
            ->createAttribute('pim_product_text')
            ->setCode('middlename')
            ->setLabel('Middlename');

        $sm->persist($attr);

        $attr = $fm
            ->createAttribute('pim_product_simpleselect')
            ->setCode('gender')
            ->setLabel('Gender')
            ->addOption(
                $fm->createAttributeOption()->addOptionValue(
                    $fm->createAttributeOptionValue()->setValue('Male')
                )
            )
            ->addOption(
                $fm->createAttributeOption()->addOptionValue(
                    $fm->createAttributeOptionValue()->setValue('Female')
                )
            );

        $sm->persist($attr);
        $sm->flush();
    }

    /**
     * Get the order of this fixture
     *
     * @return integer
     */
    public function getOrder()
    {
        return 111;
    }
}
