import { Button, Modal } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import ConfirmationModel from './Shared/ConfirmationModel';
import ClickableIcon from './Shared/ClickableIcon';
import { useAppSelector } from '../store/hooks';
import TextItemForm from './Page/EditPage/TextItem/TextItemForm';
import { TextItem } from '../types/PageTypes';

type PageList = {
  id: string;
  title: string;
  canDelete: boolean;
}[];

function PageList() {
  const progress = useAppSelector((state) => state.progress);
  const [isModelOpen, { open: openModel, close }] = useDisclosure(false);
  const [isConfirmationModelOpen, { open: openConfirmationModel, close: closeConfirmationModel }] = useDisclosure(false);
  const [currentPageId, setCurrentPageId] = useState<string|null>(null);
  const [pageList, setPageList] = useState<PageList|null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get<PageList>(`http://localhost:3000/api/pages/list/${progress.season}/${progress.episode}`);
        console.log("Fetched page list:", response.data);
        setPageList(response.data);
      } catch (error) {
        console.error("Error fetching page list:", error);
      }
    };
    fetchPage();
  }, [progress]);

  const openAddPageModel = () => {
    openModel();
  }

  const handleAddPage = async (values: TextItem) => {
    try {
      const response = await axios.post('http://localhost:3000/api/pages', values);
      console.log('Added Page:', response.data);

      setPageList([...(pageList ?? []), response.data]);
    } catch (error) {
      console.error('Error fetching page:', error);
    }

    close();
  };

  const openDeleteModel = (pageId: string) => {
    setCurrentPageId(pageId);
    openConfirmationModel();
  }

  const submitDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/pages/${currentPageId}`);
      console.log('Deleted Page:', response.data);

      setPageList((pageList ?? []).filter((page) => page.id !== currentPageId));
    } catch (error) {
      console.error('Error deleting page:', error);
    }

    close();

    setCurrentPageId(null);
    closeConfirmationModel();
  }

  return (
    <>
      <ConfirmationModel isOpen={isConfirmationModelOpen} action='delete this text' confirmAction={submitDelete} cancelAction={closeConfirmationModel} />
      <Modal opened={isModelOpen} onClose={close} title='Edit' centered>
        <TextItemForm handleSubmit={handleAddPage} />
      </Modal>
      { pageList && pageList.map((page) => (
        <Fragment key={page.id}>
          <Link to={`/pages/$pageId`} params={{ pageId: page.id }}>{ page.title }</Link>
          { page.canDelete && (
            <ClickableIcon icon={IconTrash} color='salmon' onClick={() => { openDeleteModel(page.id) }} />
          ) }
          <br />
        </Fragment>
      )) }
      <br /><br />
      <Button variant='filled' onClick={() => { openAddPageModel() }}>Add New Page</Button>
    </>
  )
}

export default PageList;
