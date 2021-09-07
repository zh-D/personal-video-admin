import React, { useRef, useCallback } from 'react';
import { Dialog } from '@alifd/next';
import { DialogProps } from '@alifd/next/types/dialog';

import Operation, { ActionType, OperaitionProps, OperationRef } from './Operation';

const getDialogTitle = (actionType: ActionType): string => {
  switch (actionType) {
    case 'add':
    default:
      return 'Add List';

    case 'edit':
      return 'Edit List';

    case 'preview':
      return 'Preview List';
  }
};

const DialogOperation: React.FC<OperaitionProps & DialogProps> = (props) => {
  const { actionType, dataSource, onOk = () => { }, ...lastProps } = props;
  const operationRef = useRef<OperationRef>(null);

  const updateVideo = async (newVideo) => {
    const res = await fetch(`/api/videos/${newVideo._id}`, {
      headers: {
        'Content-Type': 'application/json',
        token: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzBkN2NmNjc0YmEyM2QyNDBjMGZjYiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzMDg0MjAxNiwiZXhwIjoxNjMxMjc0MDE2fQ.SZUF1yu9FLF3ZBHsOsBxoElLleVqCk-eY52VbLLT96k",
      },
      method: 'PUT',
      body: JSON.stringify(newVideo)
    })
    console.log(await res.json());

  }

  const handleOk = useCallback(() => {
    if (actionType === 'preview') {
      return onOk(null);
    }
    operationRef.current.getValues(async (values) => {
      try {
        await updateVideo(values)
      } catch (err) {
        console.log(err);
      }

      onOk(values);
    });
  }, [actionType, onOk]);

  return (
    <Dialog
      shouldUpdatePosition
      isFullScreen
      title={getDialogTitle(actionType)}
      style={{ width: 600 }}
      footerAlign="center"
      {...lastProps}
      onOk={handleOk}
    >
      <Operation ref={operationRef} actionType={actionType} dataSource={dataSource} />
    </Dialog>
  );
};

export default DialogOperation;
