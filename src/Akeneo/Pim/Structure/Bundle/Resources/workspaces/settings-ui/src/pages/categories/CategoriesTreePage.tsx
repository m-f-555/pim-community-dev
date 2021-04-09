import React, {FC, useEffect, useState} from 'react';
import {FullScreenError, PageContent, PageHeader} from '@akeneo-pim-community/shared';
import {PimView, useRouter, useTranslate} from '@akeneo-pim-community/legacy-bridge';
import {Breadcrumb} from 'akeneo-design-system';
import {useParams} from 'react-router';
import {useCategoryTree} from '../../hooks';

const PageTitle = require('pim/page-title');

type Params = {
  treeId: string;
};

const CategoriesTreePage: FC = () => {
  let {treeId} = useParams<Params>();
  const router = useRouter();
  const translate = useTranslate();
  const {tree, status, load} = useCategoryTree(treeId);
  const [treeLabel, setTreeLabel] = useState(`[${treeId}]`);

  const followSettingsIndex = () => router.redirect(router.generate('pim_enrich_attribute_index'));
  const followCategoriesIndex = () => router.redirect(router.generate('pim_enrich_categorytree_index'));

  useEffect(() => {
    load();
  }, [treeId]);

  useEffect(() => {
    setTreeLabel(tree ? tree.label : `[${treeId}]`);
  }, [tree]);

  useEffect(() => {
    PageTitle.render('pim_enrich_categorytree_tree', {'category.label': treeLabel});
  }, [treeLabel]);

  if (status === 'error') {
    return (
      <FullScreenError
        title={translate('error.exception', {status_code: '404'})}
        message={translate('pim_enrich.entity.category.content.tree.not_found')}
        code={404}
      />
    );
  }

  return (
    <>
      <PageHeader showPlaceholder={status === 'idle' || status === 'fetching'}>
        <PageHeader.Breadcrumb>
          <Breadcrumb>
            <Breadcrumb.Step onClick={followSettingsIndex}>{translate('pim_menu.tab.settings')}</Breadcrumb.Step>
            <Breadcrumb.Step onClick={followCategoriesIndex}>
              {translate('pim_enrich.entity.category.plural_label')}
            </Breadcrumb.Step>
            <Breadcrumb.Step>Tree</Breadcrumb.Step>
          </Breadcrumb>
        </PageHeader.Breadcrumb>
        <PageHeader.UserActions>
          <PimView
            viewName="pim-menu-user-navigation"
            className="AknTitleContainer-userMenuContainer AknTitleContainer-userMenu"
          />
        </PageHeader.UserActions>
        <PageHeader.Title>{treeLabel}</PageHeader.Title>
      </PageHeader>
      <PageContent>Classify category tree: {treeLabel}</PageContent>
    </>
  );
};

export {CategoriesTreePage};
