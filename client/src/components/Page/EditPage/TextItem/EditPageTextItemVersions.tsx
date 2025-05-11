import TextItemForm from './TextItemForm';
import { TextItem } from '../../../../types/PageTypes';
import EditableList from '../../../Shared/Edit/EditableList';
import { Fragment, ReactNode } from 'react';

interface EditPageTextItemVersionsProps {
  textItemVersions: TextItem[];
  update: (textItemVersionIndex: number, textItem: TextItem) => void;
  canDelete?: (textItemVersion: TextItem) => boolean;
  delete: (textItemVersionIndex: number) => void;
}

function EditPageTextItemVersions(props: EditPageTextItemVersionsProps) {
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

  return (
    <>
      <EditableList<TextItem, typeof TextItemForm>
        itemName="Text Item"
        items={props.textItemVersions}
        renderItem={ (textItem: TextItem, index: number, icons: ReactNode) => (
          <Fragment key={index}>
            {textItem.text} (S{textItem.season} E{textItem.episode})
            {icons}
            <br />
          </Fragment>
        ) }
        formComponent={TextItemForm}
        update={ (index: number, updatedItem: TextItem) => submitAddEditTextItem(index, updatedItem) }
        canDelete={props.canDelete ?? undefined}
        delete={props.delete} />
    </>
  );
}

export default EditPageTextItemVersions;