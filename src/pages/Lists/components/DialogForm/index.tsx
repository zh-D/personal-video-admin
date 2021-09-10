import React, { SFC, useState, useEffect } from 'react';
import { Dialog, Form, Field, Input, Select, Message, Loading } from '@alifd/next';
import store from '@/store';
import { useRequest } from 'ice';
import listServices from '../../services/listServices';
import { useAuth } from "ice"
import { logger } from 'ice';
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

  const [auth] = useAuth()
  const [userState, userDispatchers] = store.useModel('user');
  const { data, error: createError, loading: creating, request: createList } = useRequest(listServices.createList);

  const field = Field.useField({
    values: dataSource,
  });

  const onSubmit = async (values) => {

    logger.info(values);

    if (!auth.isAdmin) {
      Message.error("你没有权限新建 list，请联系管理员获取权限...")
      return
    }

    values.content = values.content.map((item) => {
      return {
        title: item.slice(0, item.length - 24),
        _id: item.slice(item.length - 24)
      }
    })
    logger.info('values:', values);

    await createList(values)

    if (!createError) {
      Message.success('提交成功');
    } else {
      Message.error("提交失败")
    }

  };

  const onOk = () => {
    if (!auth.isAdmin) {
      Message.error("请点击取消...")
      return
    }
    setFormVisible();
    reset()
  }

  const submit = async () => {
    const { errors } = await field.validatePromise();
    logger.info(errors);

    if (errors) {
      return
    }

    await onSubmit(field.getValues());
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
              token: "Bearer " + userState.accessToken
            },
          })
          const data = await res.json()
          setVideos(data)
        } catch (err) {
          logger.info(err)
        }
      })()
    }
  }, [visible])

  return (
    <Dialog
      visible={visible}
      title="New List"
      style={{ width: 720 }}
      onOk={onOk}
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
        <Form.Submit disabled={creating} type="primary" onClick={submit} style={{ marginRight: '5px' }}>
          提交{creating && <Loading />}
        </Form.Submit>
      </Form>
    </Dialog>
  );
};

export default DialogForm;
