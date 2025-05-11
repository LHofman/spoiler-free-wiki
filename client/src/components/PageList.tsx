import { Button, Modal } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import PageForm from './Page/EditPage/PageForm';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import ConfirmationModel from './Shared/ConfirmationModel';

type PageList = {
  _id: string;
  title: string;
  canDelete: boolean;
}[];
interface AddPage {
  title: string;
}

function PageList() {
  const [isModelOpen, { open: openModel, close }] = useDisclosure(false);
  const [isConfirmationModelOpen, { open: openConfirmationModel, close: closeConfirmationModel }] = useDisclosure(false);
  const [currentPageId, setCurrentPageId] = useState<string|null>(null);
  const [pageList, setPageList] = useState<PageList|null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get<PageList>('http://localhost:3000/api/pages');
        console.log("Fetched page list:", response.data);
        setPageList(response.data);
      } catch (error) {
        console.error("Error fetching page list:", error);
      }
    };
    fetchPage();
  }, []);

  const openAddPageModel = () => {
    openModel();
  }

  const handleAddPage = async (values: AddPage) => {
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

      setPageList((pageList ?? []).filter((page) => page._id !== currentPageId));
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
        <PageForm handleSubmit={handleAddPage} />
      </Modal>
      { pageList && pageList.map((page) => (
        <Fragment key={page._id}>
          <Link to={`/pages/$pageId`} params={{ pageId: page._id }}>{ page.title }</Link>
          { page.canDelete && <IconTrash color='salmon' onClick={() => { openDeleteModel(page._id) }}/> }
          <br />
        </Fragment>
      )) }
      <br /><br />
      <Button variant='filled' onClick={() => { openAddPageModel() }}>Add New Page</Button>
    </>
  )
}

export default PageList;
