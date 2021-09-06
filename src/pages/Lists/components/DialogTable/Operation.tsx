import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Select, Form, Field, Input } from '@alifd/next';

const FormItem = Form.Item;

export type ActionType = 'add' | 'edit' | 'preview';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export interface OperaitionProps {
  /**
   * 操作类型, 以此来标识是添加、编辑、还是查看
   */
  actionType: ActionType;

  /**
   * 数据源
   */
  dataSource: any;
}

export interface OperationRef {
  getValues: (callback: (vals: Record<string, unknown>) => void) => void;
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

const Operation: React.ForwardRefRenderFunction<OperationRef, OperaitionProps> = (props, ref) => {
  const { actionType } = props;
  const dataSource = props.dataSource || {};
  const field = Field.useField([]);
  useEffect(() => {
    field.reset();
    if (dataSource) {
      const newValues = {
        _id: dataSource._id,
        title: dataSource.title,
        genre: dataSource.genre,
        type: dataSource.type,
        content: dataSource.content
      };
      field.setValues(newValues);
    }
  }, [field, dataSource]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/videos`, {
        headers: {
          token: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzBkN2NmNjc0YmEyM2QyNDBjMGZjYiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYzMDg0MjAxNiwiZXhwIjoxNjMxMjc0MDE2fQ.SZUF1yu9FLF3ZBHsOsBxoElLleVqCk-eY52VbLLT96k",
        },
      })
      const data = await res.json()
      setVideos(data)
    })()
  }, [])

  const [videos, setVideos] = useState<Video[]>([])

  useImperativeHandle<OperationRef, OperationRef>(
    ref,
    () => {
      return {
        getValues(callback: (vals: Record<string, unknown>) => void) {
          field.validate((errors, values): void => {
            if (errors) {
              return;
            }
            callback(values);
          });
        },
      };
    },
  );

  const isPreview = actionType === 'preview';

  return (
    <>
      <Form
        isPreview={isPreview}
        fullWidth
        labelAlign={isPreview ? 'left' : 'top'}
        field={field}
        {...formItemLayout}
      >
        <FormItem
          label="Id:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
            {...field.init('_id')}
          />
        </FormItem>
        <FormItem
          label="Title:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
            {...field.init('title')}
          />
        </FormItem>
        <FormItem
          label="Genre:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
            {...field.init('genre')}
          />
        </FormItem>
        <FormItem
          label="Type"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
            {...field.init('type')}
          />
        </FormItem>
        <FormItem
          label="Content"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Select defaultValue={field.getValue("content")} mode="multiple" name="content" maxTagCount={15}>
            {videos.map(video => {
              return <option key={`${video._id}`} value={`${video.title}${video._id}`}>{`${video.title}${video._id}`}</option>
            })}
          </Select>
        </FormItem>
      </Form>
    </>
  );
};

export default React.forwardRef(Operation);
