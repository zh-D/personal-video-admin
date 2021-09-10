import React from 'react';
import { Dialog, Message } from '@alifd/next';
import StepForm from '../StepForm';
import { useAuth } from 'ice';

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
  const [auth] = useAuth()
  const {
    visible = false,
    setFormVisible = () => { },
    reset = () => { }
  } = props;

  const onOk = async () => {
    if (!auth.isAdmin) {
      Message.error("请点击取消...")
      return
    }

    setFormVisible();
    reset()
  };

  const onCancel = () => {
    setFormVisible();
  };

  return (
    <Dialog
      visible={visible}
      title="New Video"
      style={{ width: 720 }}
      onOk={onOk}
      onCancel={onCancel}
    >
      <StepForm onCancel={onCancel} reset={reset} />
    </Dialog>
  );
};

export default DialogForm;
