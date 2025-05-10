import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import axios from 'axios';
import { useState, useEffect } from 'react';
import EditPageTextItems from './EditPageTextItems';
import PageForm from './PageForm';
import { Page, Property, TextItem } from '../../../types/PageTypes';
import EditProperties from './Properties/EditProperties';

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

  const handleAddEditTextItem = (textItemIndex: number, textItemVersionIndex: number, textItem: TextItem) => {
    const updatedPage = Object.assign({}, page);
    if (!updatedPage.text[textItemIndex]) {
      updatedPage.text[textItemIndex] = [];
    }

    if (textItemVersionIndex === -1) {
      updatedPage.text[textItemIndex].push(textItem);
    } else {
      updatedPage.text[textItemIndex][textItemVersionIndex] = textItem;
    }

    updatePage(updatedPage);
  };

  const handleDeleteTextItemVersion = (textItemIndex: number, textItemVersionIndex: number) => {
    const updatedPage = Object.assign({}, page);
    updatedPage.text[textItemIndex].splice(textItemVersionIndex, 1);
    if (updatedPage.text[textItemIndex].length === 0) {
      updatedPage.text.splice(textItemIndex, 1);
    }
    
    updatePage(updatedPage);
  }

  const handleAddEditProperty = (propertyIndex: number, property: Property) => {
    const updatedPage = Object.assign({}, page);
    if (propertyIndex === -1) {
      updatedPage.properties.push(property);
    } else {
      updatedPage.properties[propertyIndex] = property;
    }

    updatePage(updatedPage);
  };

  const handleDeleteProperty = (propertyIndex: number) => {
    if (page?.properties[propertyIndex].value.length ?? 0 > 0) {
      alert('Cannot delete a property that has text');
      return;
    }

    const updatedPage = Object.assign({}, page);
    updatedPage.properties.splice(propertyIndex, 1);
    
    updatePage(updatedPage);
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
        <IconEdit color='orange' onClick={openEditModel} />
      </h1>
      <Link to={`/pages/$pageId`} params={{ pageId: page._id }}>Back to Page View</Link>
      <EditPageTextItems textItems={page.text} update={handleAddEditTextItem} delete={handleDeleteTextItemVersion} />
      <EditProperties properties={page.properties} update={handleAddEditProperty} delete={handleDeleteProperty} />
    </>
  );
}

export default EditPage;
