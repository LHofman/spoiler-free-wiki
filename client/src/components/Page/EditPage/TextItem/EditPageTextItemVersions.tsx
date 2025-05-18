import TextItemForm from './TextItemForm';
import { TextItem } from '../../../../types/PageTypes';
import EditableList from '../../../Shared/Edit/EditableList';
import { Fragment, ReactNode } from 'react';
import { Card } from '@mantine/core';
import { sortTextItemsCompareFn } from '../../../../utils/textItemUtils';

interface EditPageTextItemVersionsProps {
  textItemVersions: TextItem[];
  update: (updatedTextItemVersions: TextItem[]) => Promise<void>;
  canDelete?: (textItemVersion: TextItem) => boolean;
  delete?: () => Promise<void>;
}

function EditPageTextItemVersions(props: EditPageTextItemVersionsProps) {
  const handleAddEditTextItem = async (index: number, textItem: TextItem): Promise<void> => {
    const updatedTextItemVersions = props.textItemVersions;
    
    if (index === -1) {
      updatedTextItemVersions.push(textItem);
    } else {
      updatedTextItemVersions[index] = textItem;
    }

    updatedTextItemVersions.sort(sortTextItemsCompareFn);

    props.update(updatedTextItemVersions);
  };

  const handleDeleteTextItemVersion = (index: number) => {
    const updatedTextItemVersions = props.textItemVersions;
    
    updatedTextItemVersions.splice(index, 1);
    if (updatedTextItemVersions.length === 0 && props.delete) {
      props.delete();
    } else {
      props.update(updatedTextItemVersions);
    }
  }

  const submitAddEditTextItem = async (currentTextItemVersionIndex: number, values: TextItem): Promise<boolean> => {
    const differentTextItemWithSameSeasonAndEpisode =
      props.textItemVersions.filter((textItem, index) => (
        index !== currentTextItemVersionIndex
        && textItem.season === values.season
        && textItem.episode === values.episode
      ));

    if (differentTextItemWithSameSeasonAndEpisode.length) {
      alert('There is already a text item with the same season and episode. Please change the season or episode.');
      return false;
    }

    await handleAddEditTextItem(currentTextItemVersionIndex, values);
    return true;
  };

  return (
    <Card radius='lg' style={{ margin: '15px'}}>
      <Card.Section style={{marginBottom: '0px'}}>
        <EditableList<TextItem, typeof TextItemForm>
          itemName="Text Item"
          items={props.textItemVersions}
          renderItem={ (textItem: TextItem, index: number, icons: ReactNode) => (
            <Fragment key={index}>
              {textItem.text} (S{textItem.season} E{textItem.episode})
              {icons}
              <br /><br />
            </Fragment>
          ) }
          formComponent={TextItemForm}
          update={ (index: number, updatedItem: TextItem) => submitAddEditTextItem(index, updatedItem) }
          canDelete={props.canDelete ?? undefined}
          delete={handleDeleteTextItemVersion} />
      </Card.Section>
    </Card>
  );
}

export default EditPageTextItemVersions;