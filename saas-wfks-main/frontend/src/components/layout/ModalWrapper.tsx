import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import { ReactNode } from "react";

type Props = {
    isOpen: boolean,
    closeModal: any,
    children : ReactNode
  }

const ModalWrapper = (props : Props) => {
  return (
    <Modal open={props.isOpen} onClose={props.closeModal}>
      <Paper
        elevation={2}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          padding :"10px",
          borderRadius : '24px',
          transform: "translate(-50%, -50%)",
          width: 600,
          maxWidth: "100%",
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        {props.children}
      </Paper>
    </Modal>
  );
}

export default ModalWrapper;