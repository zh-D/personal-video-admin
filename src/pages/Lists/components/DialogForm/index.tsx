import React, { SFC, useState, useEffect } from 'react';
import { Dialog, Form, Field, Input, Select, Message } from '@alifd/next';

export interface DataSource {
  title?: string;
  type?: string;
  genre?: string;
  content?: string[];
}
export interface DialogFormProps {
  dataSource?: DataSource;
  visible?: boolean;
  onSubmit?: (data: DataSource) => void;
  setFormVisible: () => void,
  reset: () => void
}

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

const DialogForm: SFC<DialogFormProps> = (props) => {
  const {
    dataSource = {},
    visible = false,
    setFormVisible = () => { },
    reset
  } = props;

  const field = Field.useField({
    values: dataSource,
  });

  const onSubmit = async (values) => {
    console.log(values);

    values.content = values.content.map((item) => {
      return {
        title: item.slice(0, item.length - 24),
        _id: item.slice(item.length - 24)
      }
    })
    console.log('values:', values);
    try {
      await createList(values)
      Message.success('提交成功');
    } catch (err) {
      Message.error("提交失败")
      console.log("失败", err);
    }
  };

  const createList = async (data) => {

    const res = await fetch(`/api/lists`, {
      headers: {
        'Content-Type': 'application/json',
        token: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzBkN2NmNjc0YmEyM2QyNDBjMGZjYiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzMDg0MjAxNiwiZXhwIjoxNjMxMjc0MDE2fQ.SZUF1yu9FLF3ZBHsOsBxoElLleVqCk-eY52VbLLT96k",
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
    console.log(await res.json());
  }

  const submit = async () => {
    const { errors } = await field.validatePromise();
    console.log(errors);

    if (errors && errors.length > 0) {
      return
    }

    await onSubmit(field.getValues());
    setFormVisible();
    reset()
  };

  const close = () => {
    setFormVisible();
  };

  const [videos, setVideos] = useState<Video[]>([])
  useEffect(() => {
    if (visible) {
      (async () => {
        try {
          const res = await fetch(`/api/videos`, {
            headers: {
              token: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzBkN2NmNjc0YmEyM2QyNDBjMGZjYiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzMDg0MjAxNiwiZXhwIjoxNjMxMjc0MDE2fQ.SZUF1yu9FLF3ZBHsOsBxoElLleVqCk-eY52VbLLT96k",
            },
          })
          const data = await res.json()
          setVideos(data)
        } catch (err) {
          console.log(err)
        }
      })()
    }
  }, [visible])

  return (
    <Dialog
      visible={visible}
      title="New List"
      style={{ width: 720 }}
      onOk={submit}
      onCancel={close}
    >
      <Form field={field} fullWidth style={{ paddingLeft: 40, paddingRight: 40 }}>
        <Form.Item label="List Title:" required requiredMessage="必填">
          <Input placeholder="Please input your list title" name="title" />
        </Form.Item>
        <Form.Item label="List Type:" required requiredMessage="必填">
          <Input placeholder="Please input list type" name="type" />
        </Form.Item>
        <Form.Item label="List Genre" required requiredMessage="必填">
          <Input placeholder="Please input list genre" name="genre" />
        </Form.Item>
        <Form.Item label="List Content" required requiredMessage="必填">
          <Select mode="multiple" name="content" maxTagCount={15}>
            {videos.map(video => {
              return <option key={`${video._id}`} value={`${video.title}${video._id}`}>{`${video.title}${video._id}`}</option>
            })}
          </Select>
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default DialogForm;
