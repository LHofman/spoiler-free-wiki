import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { Property, TextItem } from '../../../../types/PageTypes';
import EditPageTextItemVersions from '../TextItem/EditPageTextItemVersions';
import PropertyForm from './PropertyForm';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import ConfirmationModel from '../../../ConfirmationModel';

interface EditPropertiesProps {
  properties: Property[];
  update: (propertyIndex: number, property: Property) => void;
  delete: (propertyIndex: number) => void;
}

function EditProperties(props: EditPropertiesProps) {
  const [isModelOpen, { open: openModel, close }] = useDisclosure(false);
  const [isConfirmationModelOpen, { open: openConfirmationModel, close: closeConfirmationModel }] = useDisclosure(false);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState<number>(-1);
  const [editModelInitialValues, setEditModelInitialValues] = useState<Property|undefined>(undefined);
    
  const openAddNewPropertyModel = () => {
    setCurrentPropertyIndex(props.properties.length || 0);
    openModel();
  }
 
  const openEditModel = (propertyIndex: number) => {
    setCurrentPropertyIndex(propertyIndex);
    setEditModelInitialValues(props.properties[propertyIndex]);
    openModel();
  }

  const submitAddEditProperty = async (values: Property) => {
    props.update(currentPropertyIndex, values);

    closeModel();
  };

  const closeModel = () => {
    setCurrentPropertyIndex(-1);
    setEditModelInitialValues(undefined);
    close();
  }

  const openDeleteModel = (propertyIndex: number) => {
    setCurrentPropertyIndex(propertyIndex);
    openConfirmationModel();
  }

  const submitDelete = () => {
    props.delete(currentPropertyIndex);

    closeConfirmationModel();
  }

  const handleAddEditTextItemVersion = (propertyIndex: number, textItemVersionIndex: number, textItem: TextItem) => {
    const updatedProperty = Object.assign({}, props.properties[propertyIndex]);

    if (textItemVersionIndex === -1) {
      updatedProperty.value.push(textItem);
    } else {
      updatedProperty.value[textItemVersionIndex] = textItem;
    }

    props.update(propertyIndex, updatedProperty);
  };

  const handleDeleteTextItemVersion = (propertyIndex: number, textItemVersionIndex: number) => {
    const updatedProperty = Object.assign({}, props.properties[propertyIndex]);

    updatedProperty.value.splice(textItemVersionIndex, 1);
    
    props.update(propertyIndex, updatedProperty);
  }

  return (
    <>
      <ConfirmationModel isOpen={isConfirmationModelOpen} action='delete this property' confirmAction={submitDelete} cancelAction={closeConfirmationModel} />
      <Modal opened={isModelOpen} onClose={closeModel} title='Add Property' centered>
        <PropertyForm handleSubmit={submitAddEditProperty} initialValues={editModelInitialValues} />
      </Modal>

      <h2>Properties</h2>
      
      { props.properties.map((property: Property, propertyIndex: number) => (
        <>
          <h3>
            {property.property}
            <IconEdit color='orange' onClick={() => { openEditModel(propertyIndex) }}/>
            { property.value.length === 0 &&
              <IconTrash color='salmon' onClick={() => { openDeleteModel(propertyIndex) }}/>
            }
          </h3>
          <EditPageTextItemVersions
            key={propertyIndex}
            textItemVersions={property.value}
            update={ (versionIndex: number, textItem: TextItem) => handleAddEditTextItemVersion(propertyIndex, versionIndex, textItem) }
            delete={ (versionIndex: number) => handleDeleteTextItemVersion(propertyIndex, versionIndex) } />
        </>
      )) }
    <br /><br />
    <Button variant='filled' onClick={() => { openAddNewPropertyModel() }}>Add New Property</Button>
  </>
  );
}

export default EditProperties;