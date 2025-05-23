import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { FC, ReactNode, useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import ConfirmationModel from '../ConfirmationModel';
import ClickableIcon from '../ClickableIcon';
import DragAndDropList from './DragAndDropList';

type ItemForm<I> = FC<{
  handleSubmit: (updatedItem: I) => void,
  initialValues?: I,
}>;

interface EditableListProps<I, IF extends ItemForm<I>> {
  itemName: string;
  items: I[];
  renderItem: (item: I, index: number, icons: ReactNode) => ReactNode;
  formComponent: IF;
  formComponentExtraProps?: Omit<React.ComponentProps<IF>, 'handleSubmit' | 'initialValues'>;
  update: (index: number, updatedItem: I) => Promise<boolean>;
  canDelete?: (item: I) => boolean;
  delete: (index: number) => void;
  itemChildren?: (item: I, index: number) => ReactNode;
  reorder?: (sourceIndex: number, destinationIndex: number) => void;
}

function EditableList<I, IF extends ItemForm<I>>(props: EditableListProps<I, IF>) {
  const [isModelOpen, { open: openModel, close }] = useDisclosure(false);
  const [isConfirmationModelOpen, { open: openConfirmationModel, close: closeConfirmationModel }] = useDisclosure(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [editModelInitialValues, setEditModelInitialValues] = useState<I|undefined>(undefined);
    
  const openAddNewItemModel = () => {
    setCurrentIndex(props.items.length || 0);
    openModel();
  }
 
  const openEditModel = (index: number) => {
    setCurrentIndex(index);
    setEditModelInitialValues(props.items[index]);
    openModel();
  }

  const submitAddEditItem = async (updatedItem: I) => {
    const success = await props.update(currentIndex, updatedItem);

    if (success) closeModel();
  };

  const closeModel = () => {
    setCurrentIndex(-1);
    setEditModelInitialValues(undefined);
    close();
  }

  const openDeleteModel = (index: number) => {
    setCurrentIndex(index);
    openConfirmationModel();
  }

  const submitDelete = () => {
    props.delete(currentIndex);

    closeConfirmationModel();
  }

  const renderItem = (item: I, index: number) => props.renderItem(item, index,
    <>
      <ClickableIcon icon={IconEdit} color='orange' onClick={() => { openEditModel(index) }} />
      { (!props.canDelete || props.canDelete(item)) &&
        <ClickableIcon icon={IconTrash} color='salmon' onClick={() => { openDeleteModel(index) }} />
      }
    </>
  );

  return (
    <>
      <ConfirmationModel
        isOpen={isConfirmationModelOpen}
        action={`delete this ${props.itemName}`}
        confirmAction={submitDelete}
        cancelAction={closeConfirmationModel} />

      <Modal opened={isModelOpen} onClose={closeModel} size='lg' title={`Add ${props.itemName}`} centered>
        { React.createElement(props.formComponent, {
          handleSubmit: submitAddEditItem,
          initialValues: editModelInitialValues,
          ...props.formComponentExtraProps,
        }) }
      </Modal>

      {
        props.reorder
          ? (
            <DragAndDropList<I>
              items={props.items}
              reorder={props.reorder}
              renderItem={renderItem} />
          )
          : props.items.map(renderItem)
      }

      <br />
      <Button variant='filled' onClick={() => { openAddNewItemModel() }}>Add New {props.itemName}</Button>
    </>
  );
}

export default EditableList;