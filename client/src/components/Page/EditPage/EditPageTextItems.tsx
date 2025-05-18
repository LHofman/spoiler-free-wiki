import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import TextItemForm from './TextItem/TextItemForm';
import { TextItem } from '../../../types/PageTypes';
import EditPageTextItemVersions from './TextItem/EditPageTextItemVersions';
import DragAndDropList from '../../Shared/Edit/DragAndDropList';

interface EditPageTextItemsProps {
  textItems: TextItem[][];
  update: (updatedTextItems: TextItem[][]) => Promise<void>;
}

function EditPageTextItems(props: EditPageTextItemsProps) {
  const [isModelOpen, { open, close }] = useDisclosure(false);

  const updateTextItemVersions = async(itemIndex: number, updatedTextItemVersions: TextItem[]): Promise<void> => {
    const updatedTextItems = props.textItems;

    if (itemIndex === -1) {
      updatedTextItems.push(updatedTextItemVersions);
    } else {
      updatedTextItems[itemIndex] = updatedTextItemVersions;
    }

    props.update(updatedTextItems);
  };

  const deleteTextItemVersions = async (itemIndex: number): Promise<void> => {
    const updatedTextItems = props.textItems;
    updatedTextItems.splice(itemIndex, 1);
    props.update(updatedTextItems);
  }
    
  const submitAddNewTextItem = async (values: TextItem) => {
    updateTextItemVersions(-1, [values]);
    close();
  };

  const reorderTextItem = (sourceIndex: number, destinationIndex: number) => {
    const updatedTextItems = props.textItems;
    const [removed] = updatedTextItems.splice(sourceIndex, 1);
    updatedTextItems.splice(destinationIndex, 0, removed);

    props.update(updatedTextItems);
  }
   
  return (
    <>
      <Modal opened={isModelOpen} onClose={close} size='lg' title='Add Text Version' centered>
        <TextItemForm handleSubmit={submitAddNewTextItem} />
      </Modal>

      <h2>Text Items</h2>
      
      <DragAndDropList<TextItem[]>
        items={props.textItems}
        reorder={reorderTextItem}
        renderItem={(textItemVersions: TextItem[], itemIndex: number) => (
        <EditPageTextItemVersions
          key={itemIndex}
          textItemVersions={textItemVersions}
          update={ (updatedTextItemVersions: TextItem[]) => updateTextItemVersions(itemIndex, updatedTextItemVersions) }
          delete={ () => deleteTextItemVersions(itemIndex) } />
      )} />
    <br />
    <Button variant='filled' onClick={open}>Add New Text Item</Button>
  </>
  );
}

export default EditPageTextItems;