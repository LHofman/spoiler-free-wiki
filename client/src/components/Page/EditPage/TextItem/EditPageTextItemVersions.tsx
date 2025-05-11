// import { Button, Modal } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import { IconEdit, IconTrash } from '@tabler/icons-react';
// import { Fragment, useState } from 'react';
// import ConfirmationModel from '../../../ConfirmationModel';
import TextItemForm from './TextItemForm';
import { TextItem } from '../../../../types/PageTypes';
import EditableList from '../../../Shared/Edit/EditableList';
import { ReactNode } from 'react';

interface EditPageTextItemVersionsProps {
  textItemVersions: TextItem[];
  update: (textItemVersionIndex: number, textItem: TextItem) => void;
  delete: (textItemVersionIndex: number) => void;
}

function EditPageTextItemVersions(props: EditPageTextItemVersionsProps) {
  // const [isModelOpen, { open: openModel, close }] = useDisclosure(false);
  // const [isConfirmationModelOpen, { open: openConfirmationModel, close: closeConfirmationModel }] = useDisclosure(false);
  // const [currentTextItemVersionIndex, setCurrentTextItemVersionIndex] = useState<number>(-1);
  // const [editModelInitialValues, setEditModelInitialValues] = useState<TextItem|undefined>(undefined);
    
  // const openEditModel = (versionIndex: number) => {
  //   setCurrentTextItemVersionIndex(versionIndex);
  //   setEditModelInitialValues(props.textItemVersions[versionIndex]);
  //   openModel();
  // }

  const submitAddEditTextItem = async (currentTextItemVersionIndex: number, values: TextItem) => {
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
  };

  // const openDeleteModel = (versionIndex: number) => {
  //   setCurrentTextItemVersionIndex(versionIndex);
  //   openConfirmationModel();
  // }

  // const submitDelete = () => {
  //   props.delete(currentTextItemVersionIndex);

  //   closeConfirmationModel();
  // }

  // const closeModel = () => {
  //   setCurrentTextItemVersionIndex(-1);
  //   setEditModelInitialValues(undefined);
  //   close();
  // }

  return (
    <>
      <EditableList<TextItem, typeof TextItemForm>
        itemName="Text Item"
        items={props.textItemVersions}
        renderItem={ (textItem: TextItem, _, icons: ReactNode) => (
          <>
            {textItem.text} (S{textItem.season} E{textItem.episode})
            {icons}
            <br />
          </>
        ) }
        formComponent={TextItemForm}
        update={ (index: number, updatedItem: TextItem) => submitAddEditTextItem(index, updatedItem) }
        delete={props.delete} />
    </>
  );
}

export default EditPageTextItemVersions;