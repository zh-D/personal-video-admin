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
        desc: dataSource.desc,
        type: dataSource.type,
        genre: dataSource.genre,
        img: dataSource.img,
        imgTitle: dataSource.imgTitle,
        imgSm: dataSource.imgSm,
        video: dataSource.video
      };
      field.setValues(newValues);
    }
  }, [field, dataSource]);

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
          label="Desc:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
            {...field.init('desc')}
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
          label="Genre:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
            {...field.init('genre')}
          />
        </FormItem>
        <FormItem
          label="Img:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
            {...field.init('img')}
          />
        </FormItem>
        <FormItem
          label="Title image:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
            {...field.init('imgTitle')}
          />
        </FormItem>
        <FormItem
          label="Thumbnail image:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
            {...field.init('imgSm')}
          />
        </FormItem>
        <FormItem
          label="Video:"
          required={!isPreview}
          requiredMessage="必填"
        >
          <Input
            {...field.init('video')}
          />
        </FormItem>
      </Form>
    </>
  );
};

export default React.forwardRef(Operation);
