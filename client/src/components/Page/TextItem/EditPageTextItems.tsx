import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import ConfirmationModel from '../../ConfirmationModel';
import TextItemForm from './TextItemForm';

interface TextItem {
  text: string;
  season: number;
  episode: number;
}
interface EditPageTextItemsProps {
  textItems: TextItem[][];
  update: (textItemIndex: number, textItemVersionIndex: number, textItem: TextItem) => void;
  delete: (TextItemIndex: number, textItemVersionIndex: number) => void;
}

function EditPageTextItems(props: EditPageTextItemsProps) {
  const [isModelOpen, { open: openModel, close }] = useDisclosure(false);
  const [isConfirmationModelOpen, { open: openConfirmationModel, close: closeConfirmationModel }] = useDisclosure(false);
  const [currentTextItemIndex, setCurrentTextItemIndex] = useState<number>(-1);
  const [currentTextItemVersionIndex, setCurrentTextItemVersionIndex] = useState<number>(-1);
  const [editModelInitialValues, setEditModelInitialValues] = useState<TextItem|undefined>(undefined);
    
  const openAddTextVersionModel = (index: number) => {
    setCurrentTextItemIndex(index);
    openModel();
  }

  const openAddNewTextModel = () => {
    setCurrentTextItemIndex(props.textItems.length || 0);
    openModel();
  }

  const openEditModel = (itemIndex: number, versionIndex: number) => {
    setCurrentTextItemIndex(itemIndex);
    setCurrentTextItemVersionIndex(versionIndex);
    setEditModelInitialValues(props.textItems[itemIndex][versionIndex]);
    openModel();
  }

  const submitAddEditTextItem = async (values: TextItem) => {
    const differentTextItemWithSameSeasonAndEpisode =
      (props.textItems[currentTextItemIndex] || [])
      .filter((textItem, index) => (
        index !== currentTextItemVersionIndex
        && textItem.season === values.season
        && textItem.episode === values.episode
      ));

    if (differentTextItemWithSameSeasonAndEpisode.length) {
      alert('There is already a text item with the same season and episode. Please change the season or episode.');
      return;
    }

    props.update(currentTextItemIndex, currentTextItemVersionIndex, values);

    closeModel();
  };

  const openDeleteModel = (itemIndex: number, versionIndex: number) => {
    setCurrentTextItemIndex(itemIndex);
    setCurrentTextItemVersionIndex(versionIndex);
    openConfirmationModel();
  }

  const submitDelete = () => {
    props.delete(currentTextItemIndex, currentTextItemVersionIndex);

    closeConfirmationModel();
  }

  const closeModel = () => {
    setCurrentTextItemIndex(-1);
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
      
      { props.textItems.map((textItemVersions: TextItem[], itemIndex: number) => (
        <div key={itemIndex}>
          <p>
            { textItemVersions
              .sort((a, b) => a.season - b.season || a.episode - b.episode)
              .map((textItem: TextItem, versionIndex: number) => (
              <Fragment key={versionIndex}>
                {textItem.text} (S{textItem.season} E{textItem.episode})
                <IconEdit color='orange' onClick={() => { openEditModel(itemIndex, versionIndex) }}/>
                <IconTrash color='salmon' onClick={() => { openDeleteModel(itemIndex, versionIndex) }}/>
                <br />
              </Fragment>
            )) }
          </p>
          <Button variant='filled' onClick={() => { openAddTextVersionModel(itemIndex) }}>Add Text Version</Button>   
          <hr />
        </div>
      ))
    }
    <br /><br />
    <Button variant='filled' onClick={() => { openAddNewTextModel() }}>Add New Text Item</Button>
  </>
  );
}

export default EditPageTextItems;