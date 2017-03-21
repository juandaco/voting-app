import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Textfield,
} from 'react-mdl';
import dialogPolyfill from 'dialog-polyfill';

const PopUpDialog = (
  {
    open,
    cancel,
    type,
    confirmationText,
    createPoll,
    createOption,
  },
) => {
  // For registering the dialogs
  const dialogs = document.querySelector('dialog');
  dialogs && dialogPolyfill.registerDialog(dialogs);

  let content;
  let buttons;
  switch (type) {
    case 'confirm':
      // Prop needed to change value of the property being created
      content = <p>{confirmationText}</p>;
      buttons = (
        <Button type="button" onClick={cancel}>
          OK
        </Button>
      );
      break;
    case 'poll':
      content = (
        <div>
          <Textfield
            onChange={() => {}}
            label="Title"
            style={{ width: '150px' }}
          />
          <Textfield
            onChange={() => {}}
            label="Options (separated by Spaces)"
            rows={3}
            style={{ width: '250px' }}
          />
        </div>
      );
      buttons = (
        <div>
          <Button type="button" onClick={cancel}>
            Cancel
          </Button>
          <Button type="button" onClick={createPoll}>
            Create
          </Button>
        </div>
      );
      break;
    case 'newOption':
      content = (
        <Textfield
          onChange={() => {}}
          label="New Option"
          style={{ width: 200 }}
        />
      );
      buttons = (
        <div>
          <Button type="button" onClick={cancel}>
            Cancel
          </Button>
          <Button type="button" onClick={createOption}>
            New
          </Button>
        </div>
      );
      break;
    default:
      content = '';
      buttons = '';
  }

  return (
    <Dialog open={open} onCancel={cancel}>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        {buttons}
      </DialogActions>
    </Dialog>
  );
};

export default PopUpDialog;
