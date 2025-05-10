import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import ConfirmationModel from '../../../ConfirmationModel';
import TextItemForm from './TextItemForm';
import { TextItem } from '../../../../types/PageTypes';

interface EditPageTextItemVersionsProps {
  textItemVersions: TextItem[];
  update: (textItemVersionIndex: number, textItem: TextItem) => void;
  delete: (textItemVersionIndex: number) => void;
}

function EditPageTextItemVersions(props: EditPageTextItemVersionsProps) {
  const [isModelOpen, { open: openModel, close }] = useDisclosure(false);
  const [isConfirmationModelOpen, { open: openConfirmationModel, close: closeConfirmationModel }] = useDisclosure(false);
  const [currentTextItemVersionIndex, setCurrentTextItemVersionIndex] = useState<number>(-1);
  const [editModelInitialValues, setEditModelInitialValues] = useState<TextItem|undefined>(undefined);
    
  const openEditModel = (versionIndex: number) => {
    setCurrentTextItemVersionIndex(versionIndex);
    setEditModelInitialValues(props.textItemVersions[versionIndex]);
    openModel();
  }

  const submitAddEditTextItem = async (values: TextItem) => {
    const differentTextItemWithSameSeasonAndEpisode =
      props.textItemVersions.filter((textItem, index) => (
        index !== currentTextItemVersionIndex
        && textItem.season === values.season
        && textItem.episode === values.episode
      ));

    if (differentTextItemWithSameSeasonAndEpisode.length) {
      alert('There is already a text item with the same season and episode. Please change the season or episode.');
      return;
    }

    props.update(currentTextItemVersionIndex, values);

    closeModel();
  };

  const openDeleteModel = (versionIndex: number) => {
    setCurrentTextItemVersionIndex(versionIndex);
    openConfirmationModel();
  }

  const submitDelete = () => {
    props.delete(currentTextItemVersionIndex);

    closeConfirmationModel();
  }

  const closeModel = () => {
    setCurrentTextItemVersionIndex(-1);
    setEditModelInitialValues(undefined);
    close();
  }

  return (
    <>
      <ConfirmationModel isOpen={isConfirmationModelOpen} action='delete this text' confirmAction={submitDelete} cancelAction={closeConfirmationModel} />
      <Modal opened={isModelOpen} onClose={closeModel} title='Add Text Version' centered>
        <TextItemForm initialValues={editModelInitialValues} handleSubmit={submitAddEditTextItem} />
      </Modal>
      
      <div>
        <p>
          { props.textItemVersions
            .sort((a, b) => a.season - b.season || a.episode - b.episode)
            .map((textItem: TextItem, versionIndex: number) => (
            <Fragment key={versionIndex}>
              {textItem.text} (S{textItem.season} E{textItem.episode})
              <IconEdit color='orange' onClick={() => { openEditModel(versionIndex) }}/>
              <IconTrash color='salmon' onClick={() => { openDeleteModel(versionIndex) }}/>
              <br />
            </Fragment>
          )) }
        </p>
        <Button variant='filled' onClick={openModel}>Add Text Version</Button>   
        <hr />
      </div>
    </>
  );
}

export default EditPageTextItemVersions;