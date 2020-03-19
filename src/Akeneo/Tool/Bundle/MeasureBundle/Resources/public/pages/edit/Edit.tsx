import React, {useState, useContext} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import styled from 'styled-components';
import {useMeasurementFamily} from 'akeneomeasure/hooks/use-measurement-families';
import {TranslateContext} from 'akeneomeasure/context/translate-context';
import {UnitTab} from 'akeneomeasure/pages/edit/UnitTab';
import {PropertyTab} from 'akeneomeasure/pages/edit/PropertyTab';
import {PageHeader, PageHeaderPlaceholder} from 'akeneomeasure/shared/components/PageHeader';
import {PimView} from 'akeneomeasure/bridge/legacy/pim-view/PimView';
import {Breadcrumb} from 'akeneomeasure/shared/components/Breadcrumb';
import {BreadcrumbItem} from 'akeneomeasure/shared/components/BreadcrumbItem';
import {Button} from 'akeneomeasure/shared/components/Button';
import {getMeasurementFamilyLabel} from 'akeneomeasure/model/measurement-family';
import {UserContext} from 'akeneomeasure/context/user-context';
import {PageContent} from 'akeneomeasure/shared/components/PageContent';
import {
  SecondaryActionsDropdownButton,
  DropdownLink,
} from 'akeneomeasure/shared/components/SecondaryActionsDropdownButton';

enum Tab {
  Units = 'units',
  Properties = 'properties',
}

const Container = styled.div`
  height: calc(100% - 50px);
  display: flex;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.color.grey80};
`;

const TabSelector = styled.div<{isActive: boolean}>`
  width: 90px;
  padding: 13px 0;
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.big};
  color: ${props => (props.isActive ? props.theme.color.purple100 : 'inherit')};
  border-bottom: 3px solid ${props => (props.isActive ? props.theme.color.purple100 : 'transparent')};
`;

const Edit = () => {
  const __ = useContext(TranslateContext);
  const history = useHistory();
  const locale = useContext(UserContext)('uiLocale');
  const {measurementFamilyCode} = useParams() as {measurementFamilyCode: string};
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Units);
  const [measurementFamily, setMeasurementFamily] = useMeasurementFamily(measurementFamilyCode);

  if (undefined === measurementFamilyCode || null === measurementFamily) {
    return null;
  }

  return (
    <>
      <PageHeader
        userButtons={
          <PimView
            className="AknTitleContainer-userMenuContainer AknTitleContainer-userMenu"
            viewName="pim-measurements-user-navigation"
          />
        }
        buttons={[
          <SecondaryActionsDropdownButton title={__('pim_common.other_actions')} key={0}>
            <DropdownLink
              onClick={() => {
                //TODO delete measurement family
              }}
            >
              {__('measurements.family.delete')}
            </DropdownLink>
          </SecondaryActionsDropdownButton>,
          <Button
            color="blue"
            outline
            onClick={() => {
              //TODO add unit
            }}
          >
            {__('measurements.unit.add')}
          </Button>,
          <Button
            onClick={() => {
              //TODO save measurement family
            }}
          >
            {__('pim_common.save')}
          </Button>,
        ]}
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem>{__('pim_menu.tab.settings')}</BreadcrumbItem>
            <BreadcrumbItem onClick={() => history.push('/')}>{__('pim_menu.item.measurements')}</BreadcrumbItem>
          </Breadcrumb>
        }
      >
        {null === measurementFamily ? (
          <div className={`AknLoadingPlaceHolderContainer`}>
            <PageHeaderPlaceholder />
          </div>
        ) : (
          <div>{getMeasurementFamilyLabel(measurementFamily, locale)}</div>
        )}
      </PageHeader>

      <PageContent>
        <TabContainer>
          {Object.values(Tab).map((tab: Tab) => (
            <TabSelector key={tab} onClick={() => setCurrentTab(tab)} isActive={currentTab === tab}>
              {__(`measurements.family.tab.${tab}`)}
            </TabSelector>
          ))}
        </TabContainer>
        <Container>
          {currentTab === Tab.Units && (
            <UnitTab measurementFamily={measurementFamily} onMeasurementFamilyChange={setMeasurementFamily} />
          )}
          {currentTab === Tab.Properties && (
            <PropertyTab measurementFamily={measurementFamily} onMeasurementFamilyChange={setMeasurementFamily} />
          )}
        </Container>
      </PageContent>
    </>
  );
};

export {Edit};
