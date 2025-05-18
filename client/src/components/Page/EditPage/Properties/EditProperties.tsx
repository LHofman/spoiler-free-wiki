import { Property, TextItem } from '../../../../types/PageTypes';
import EditPageTextItemVersions from '../TextItem/EditPageTextItemVersions';
import PropertyForm from './PropertyForm';
import EditableList from '../../../Shared/Edit/EditableList';
import { ReactNode } from 'react';
import { Card, Group, Text } from '@mantine/core';

interface EditPropertiesProps {
  properties: Property[];
  update: (properties: Property[]) => Promise<void>;
}
function EditProperties(props: EditPropertiesProps) {   
  const handleAddEditProperty = async (propertyIndex: number, property: Property): Promise<boolean> => {
    const updatedProperties = props.properties;

    if (propertyIndex === -1) {
      updatedProperties.push(property);
    } else {
      updatedProperties[propertyIndex] = property;
    }

    await props.update(updatedProperties);
    return true;
  };

  const handleDeleteProperty = (propertyIndex: number) => {
    if (props.properties[propertyIndex].value.length ?? 0 > 0) {
      alert('Cannot delete a property that has text');
      return;
    }

    const updatedProperties = props.properties;
    updatedProperties.splice(propertyIndex, 1);
    
    props.update(updatedProperties);
  }

  const reorderProperty = (sourceIndex: number, destinationIndex: number) => {
    const updatedProperties = props.properties;
    const [removed] = updatedProperties.splice(sourceIndex, 1);
    updatedProperties.splice(destinationIndex, 0, removed);

    props.update(updatedProperties);
  }
    
  const handleAddEditTextItemVersion = async (
    propertyIndex: number,
    updatedTextItemVersions: TextItem[]
  ): Promise<void> => {
    const updatedProperty = Object.assign({}, props.properties[propertyIndex]);

    updatedProperty.value = updatedTextItemVersions;

    handleAddEditProperty(propertyIndex, updatedProperty);
  };

  return (
    <>
      <h2>Properties</h2>
      <EditableList<Property, typeof PropertyForm>
        itemName="Property"
        items={props.properties}
        renderItem={ (property: Property, index: number, icons: ReactNode) => (
          <Card radius='lg' style={{ marginBottom: '15px'}}>
            <Card.Section withBorder inheritPadding py="xs">
              <Group justify="center">
                <Text fw={500}>{property.property}</Text>
                <div>{icons}</div>
              </Group>
            </Card.Section>
            <Card.Section style={{marginBottom: '0px'}}>
              <EditPageTextItemVersions
                textItemVersions={property.value}
                update={ (updatedTextItemVersions) => handleAddEditTextItemVersion(index, updatedTextItemVersions) }
                allowLink={true} />
            </Card.Section>
          </Card>
        ) }
        formComponent={PropertyForm}
        update={handleAddEditProperty}
        canDelete={ (property: Property) => property.value.length === 0 }
        delete={handleDeleteProperty}
        reorder={reorderProperty} />
    </>
  );
}

export default EditProperties;