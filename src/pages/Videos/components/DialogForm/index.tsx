import React from 'react';
import { Dialog } from '@alifd/next';
import StepForm from '../StepForm';

export interface Video {
  _id: String,
  type: String,
  title: String,
  desc: String,
  img: String,
  imgSm: String,
  imgTitle: String,
  video: String,
  createAt: Date,
  updatedAt: Date
}

const DialogForm = (props) => {
  const {
    visible = false,
    setFormVisible = () => { },
    reset = () => {}
  } = props;

  const onOk = async () => {

    setFormVisible();
    reset()
  };

  const onCancel = () => {
    setFormVisible();
    reset()
  };

  return (
    <Dialog
      visible={visible}
      title="New List"
      style={{ width: 720 }}
      onOk={onOk}
      onCancel={onCancel}
    >
      <StepForm onCancel={onCancel} reset={reset} />
    </Dialog>
  );
};

export default DialogForm;
