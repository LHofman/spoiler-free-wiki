import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import TextItemForm from './TextItem/TextItemForm';
import { TextItem } from '../../../types/PageTypes';
import EditPageTextItemVersions from './TextItem/EditPageTextItemVersions';

interface EditPageTextItemsProps {
  textItems: TextItem[][];
  update: (textItemIndex: number, textItemVersionIndex: number, textItem: TextItem) => void;
  delete: (textItemIndex: number, textItemVersionIndex: number) => void;
}

function EditPageTextItems(props: EditPageTextItemsProps) {
  const [isModelOpen, { open, close }] = useDisclosure(false);
    
  const submitAddNewTextItem = async (values: TextItem) => {
    props.update(props.textItems.length || 0, -1, values);
    close();
  };

  return (
    <>
      <Modal opened={isModelOpen} onClose={close} title='Add Text Version' centered>
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
    <Button variant='filled' onClick={open}>Add New Text Item</Button>
    <hr />
  </>
  );
}

export default EditPageTextItems;