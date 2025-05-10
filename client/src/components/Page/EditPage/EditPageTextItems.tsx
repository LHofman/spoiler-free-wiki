import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import TextItemForm from './TextItem/TextItemForm';
import { TextItem } from '../../../types/PageTypes';
import EditPageTextItemVersions from './TextItem/EditPageTextItemVersions';

interface EditPageTextItemsProps {
  textItems: TextItem[][];
  update: (textItemIndex: number, textItemVersionIndex: number, textItem: TextItem) => void;
  delete: (textItemIndex: number, textItemVersionIndex: number) => void;
}

function EditPageTextItems(props: EditPageTextItemsProps) {
  const [isModelOpen, { open: openModel, close }] = useDisclosure(false);
  const [currentTextItemIndex, setCurrentTextItemIndex] = useState<number>(-1);
    
  const openAddNewTextModel = () => {
    setCurrentTextItemIndex(props.textItems.length || 0);
    openModel();
  }

  const submitAddNewTextItem = async (values: TextItem) => {
    props.update(currentTextItemIndex, -1, values);

    closeModel();
  };

  const closeModel = () => {
    setCurrentTextItemIndex(-1);
    close();
  }

  return (
    <>
      <Modal opened={isModelOpen} onClose={closeModel} title='Add Text Version' centered>
        <TextItemForm handleSubmit={submitAddNewTextItem} />
      </Modal>

      <h2>Text Items</h2>
      
      { props.textItems.map((textItemVersions: TextItem[], itemIndex: number) => (
        <EditPageTextItemVersions
          key={itemIndex}
          textItemVersions={textItemVersions}
          update={ (versionIndex: number, textItem: TextItem) => props.update(itemIndex, versionIndex, textItem) }
          delete={ (versionIndex: number) => props.delete(itemIndex, versionIndex) } />
      )) }
    <br /><br />
    <Button variant='filled' onClick={() => { openAddNewTextModel() }}>Add New Text Item</Button>
  </>
  );
}

export default EditPageTextItems;