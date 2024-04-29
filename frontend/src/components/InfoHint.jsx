import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const InfoHint = ({ text, onClose }) => {
  return (
    <Dialog open={true} fullWidth>
      <DialogTitle variant="h4">Info</DialogTitle>
      <DialogContent>
        <DialogContentText variant="h5">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="info">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoHint;
