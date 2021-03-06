import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  root: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function CustomDialog({ openDialog, onCloseDialog, title, details }) {
  return (
    <Dialog
      style={{ minWidth: "400" }}
      onClose={() => onCloseDialog()}
      aria-labelledby="customized-dialog-title"
      open={openDialog}
    >
      <DialogTitle id="customized-dialog-title" onClose={() => onCloseDialog()}>
        <Typography gutterBottom variant="h5">
          Tour Script
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom style={{ whiteSpace: "pre-line" }}>
          {details}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onCloseDialog()} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default CustomDialog;
