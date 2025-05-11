import { Button, Modal } from '@mantine/core';

interface ConfirmationModelProps {
  isOpen: boolean;
  action: string;
  confirmAction: () => void;
  cancelAction: () => void;
}

function ConfirmationModel(props: ConfirmationModelProps) {
  return (
    <>
      <Modal opened={props.isOpen} onClose={props.cancelAction} title='Confirm' centered>
        <div>Are you sure you want to {props.action}?</div>
        <br />
        <Button onClick={props.cancelAction}>Cancel</Button>&nbsp;&nbsp;&nbsp;
        <Button onClick={props.confirmAction}>Confirm</Button>
      </Modal>
    </>
  )
}

export default ConfirmationModel;
