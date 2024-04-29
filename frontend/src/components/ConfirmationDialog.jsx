import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ConfirmationDialog = ({ text, onClose, onConfirm }) => {
  return (
    <Dialog open={true} fullWidth>
      <DialogTitle variant="h4">Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText variant="h5">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="info">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="warning">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
