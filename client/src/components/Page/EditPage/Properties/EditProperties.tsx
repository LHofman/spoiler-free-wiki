import { Property, TextItem } from '../../../../types/PageTypes';
import EditPageTextItemVersions from '../TextItem/EditPageTextItemVersions';
import PropertyForm from './PropertyForm';
import EditableList from '../../../Shared/Edit/EditableList';
import { Fragment, ReactNode } from 'react';
import { sortTextItemsCompareFn } from '../../../../utils/textItemUtils';

interface EditPropertiesProps {
  properties: Property[];
  update: (propertyIndex: number, property: Property) => void;
  delete: (propertyIndex: number) => void;
}
function EditProperties(props: EditPropertiesProps) {    
  const handleAddEditTextItemVersion = (propertyIndex: number, textItemVersionIndex: number, textItem: TextItem) => {
    const updatedProperty = Object.assign({}, props.properties[propertyIndex]);

    if (textItemVersionIndex === -1) {
      updatedProperty.value.push(textItem);
    } else {
      updatedProperty.value[textItemVersionIndex] = textItem;
    }

    updatedProperty.value.sort(sortTextItemsCompareFn);

    props.update(propertyIndex, updatedProperty);
  };

  const handleDeleteTextItemVersion = (propertyIndex: number, textItemVersionIndex: number) => {
    const updatedProperty = Object.assign({}, props.properties[propertyIndex]);

    updatedProperty.value.splice(textItemVersionIndex, 1);
    
    props.update(propertyIndex, updatedProperty);
  }

  return (
    <>
      <h2>Properties</h2>
      <EditableList<Property, typeof PropertyForm>
        itemName="Property"
        items={props.properties}
        renderItem={ (property: Property, index: number, icons: ReactNode) => (
          <Fragment key={index}>
            <h2>
              {property.property}
              {icons}
            </h2>
            <EditPageTextItemVersions
              key={index}
              textItemVersions={property.value}
              update={ (versionIndex: number, textItem: TextItem) => handleAddEditTextItemVersion(index, versionIndex, textItem) }
              delete={ (versionIndex: number) => handleDeleteTextItemVersion(index, versionIndex) } />
          </Fragment>
        ) }
        formComponent={PropertyForm}
        update={props.update}
        canDelete={ (property: Property) => property.value.length === 0 }
        delete={props.delete} />
    </>
  );
}

export default EditProperties;