import { Modal, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import axios from 'axios';
import { useState, useEffect } from 'react';
import EditPageTextItems from './EditPageTextItems';
import PageForm from './PageForm';
import { Page, Property, TextItem, TextSection } from '../../../types/PageTypes';
import EditProperties from './Properties/EditProperties';
import EditTextSections from './TextSections/EditTextSections';
import ClickableIcon from '../../Shared/ClickableIcon';

interface EditPage {
  title: string;
}

interface EditPageProps {
  pageId: string;
}

function EditPage(props: EditPageProps) {
  const [page, setPage] = useState<Page|null>(null);
  const [isModelOpen, { open: openModel, close }] = useDisclosure(false);
  const [editModelInitialValues, setEditModelInitialValues] = useState<Page|undefined>(undefined);
  
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get<Page>(
          `http://localhost:3000/api/pages/raw/${props.pageId}`
        );
        console.log('Fetched page:', response.data);
        setPage(response.data);
      } catch (error) {
        console.error('Error fetching page:', error);
      }
    };
    fetchPage();
  }, [props.pageId]);

  const openEditModel = () => {
    setEditModelInitialValues(page ?? undefined);
    openModel();
  }

  const handleEditPage = (values: EditPage) => {
    const updatedPage = Object.assign({}, page, values);
    updatePage(updatedPage);

    close();
  };

  const updateProperties  = (updatedProperties: Property[]): Promise<void> => {
    const updatedPage = Object.assign({}, page);
    updatedPage.properties = updatedProperties;

    return updatePage(updatedPage);
  }

  const updateTextItems = (updatedTextItems: TextItem[][]): Promise<void> => {
    const updatedPage = Object.assign({}, page);
    updatedPage.text = updatedTextItems;

    return updatePage(updatedPage);
  }

  const updateTextSections = (updatedTextSections: TextSection[]): Promise<void> => {
    const updatedPage = Object.assign({}, page);
    updatedPage.textSections = updatedTextSections;

    return updatePage(updatedPage);
  }

  const updatePage = async (updatedPage: Page): Promise<void> => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/pages/${updatedPage._id}`,
        updatedPage
      );
      console.log('Updated Page:', response.data);

      setPage(updatedPage);
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  }

  return page && (
    <>
      <Modal opened={isModelOpen} onClose={close} title='Edit' centered>
        <PageForm initialValues={editModelInitialValues} handleSubmit={handleEditPage} />
      </Modal>
      <h1>
        { page.title }
        <ClickableIcon icon={IconEdit} color='orange' onClick={openEditModel} />
      </h1>
      <Link to={`/pages/$pageId`} params={{ pageId: page._id }}>Back to Page View</Link>

      <Tabs color='red' defaultValue='Properties'>
        <Tabs.List>
          <Tabs.Tab value='Properties'>Properties</Tabs.Tab>
          <Tabs.Tab value='Information'>Information</Tabs.Tab>
          <Tabs.Tab value='Text Sections'>Text Sections</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='Properties'>
          <EditProperties properties={page.properties} update={updateProperties} />
        </Tabs.Panel>
        <Tabs.Panel value='Information'>
          <EditPageTextItems textItems={page.text} update={updateTextItems} />
        </Tabs.Panel>
        <Tabs.Panel value='Text Sections'>
          <EditTextSections textSections={page.textSections} update={updateTextSections} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default EditPage;
