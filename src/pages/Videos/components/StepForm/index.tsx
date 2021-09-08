import React, { useState } from 'react';
import { Message, Card, Form, Input, Icon, Loading, Field, Step, Button, Typography, Upload } from '@alifd/next';
import { useRequest } from 'ice';
import videoServices from '../../services/videoServices';
import { Item } from '@alifd/next/types/step';

import styles from './index.module.scss';

import storage from "../../../../firebase";

export interface DataSource {
  name?: string;
  category?: string;
  authority?: string;
  desc?: string;
}

export interface StepFormProps {
  dataSource?: DataSource;
  onSubmit?: (data: DataSource) => void;
  onCancel?: () => void;
  reset?: () => void;
}

export interface Video {
  genre?: string,
  type?: string,
  title?: string,
  desc?: string,
  img?: string,
  imgSm?: string,
  imgTitle?: string,
  video?: string,
}

const StepForm: React.FunctionComponent<StepFormProps> = (props: StepFormProps): JSX.Element => {

  const { onCancel } = props

  const [video, setVideo] = useState<Video>({});
  const [uploadedCount, setUploadedCount] = useState<number>(0)

  const { data, error: createError, loading: creating, request: createVideo } = useRequest(videoServices.createVideo);

  const formField = Field.useField({ values: {} });

  // const uploadedField = Field.useField({ values: {} })

  const [currentStep, setStep] = useState<number>(0);

  const steps = ['填写视频信息', '上传图片和视频', '提交信息'].map(
    (item, index): Item => (
      <Step.Item aria-current={index === currentStep ? 'step' : null} key={index} title={item} />
    ),
  );

  const goNext = async (): Promise<T> => {
    const { errors } = await formField.validatePromise();

    if (errors) {
      console.log('errors', errors);
      return;
    }
    setStep(currentStep + 1);
  };

  const goPrev = (): void => {
    setStep(currentStep - 1);
  };

  const goInitial = (): void => {
    setStep(0);
  };



  const fillInfo = async (): void => {
    const { errors } = await formField.validatePromise();
    console.log(formField);


    if (errors) {
      console.log('errors', errors);
      return;
    }
    const values = formField.getValues();
    console.log('values:', values);
    setVideo((prev) => {
      return { ...prev, ...values };
    })
    // onSubmit(values);

    setStep(currentStep + 1);
  };

  const uploadFile = async (items) => {

    const { errors } = await formField.validatePromise();

    if (errors) {
      console.log('errors', errors);
      return;
    }

    setUploadedCount((prev) => prev + 1)

    // for (let key in items) {
    //   const item = items[key][0]
    //   setUploadedCount((prev) => prev + 1)
    //   setVideo((prev) => {
    //     console.log({ ...prev, [key]: item.name });
    //     return { ...prev, [key]: item.name };
    //   });
    // }

    for (let key in items) {
      const item = items[key][0]
      const fileName = new Date().getTime() + item.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.originFileObj);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            console.log(url);
            setVideo((prev) => {
              console.log({ ...prev, [key]: url });
              return { ...prev, [key]: url };
            });
            setUploadedCount((prev) => prev + 1)
          });
        }
      );
    }

  };

  const submit = async () => {
    await createVideo(video)
    if (!createError) {
      Message.success("创建成功")
    } else {
      Message.error("创建失败")
    }
    goNext()
  }


  const onChange = (info) => {
    console.log(info);
  }

  let actions: JSX.Element;
  let mainbody: JSX.Element;
  switch (currentStep) {
    case 0:
      actions = (
        <>
          <Form.Submit type="primary" onClick={fillInfo} style={{ marginRight: '5px' }}>
            下一步
          </Form.Submit>
        </>
      );
      mainbody = (
        <>
          <Form
            field={formField}
            // isPreview={currentStep === 1}
            className={styles.form}
            responsive
            fullWidth
            labelAlign="top"
          >
            <Form.Item colSpan={12} label="Title" required>
              <Input.TextArea placeholder="请输入项目详细信息" name="title" />
            </Form.Item>

            <Form.Item colSpan={12} label="Description" required>
              <Input.TextArea placeholder="请输入项目详细信息" name="desc" />
            </Form.Item>

            <Form.Item colSpan={12} label="Type" required>
              <Input.TextArea placeholder="请输入项目详细信息" name="type" />
            </Form.Item>

            <Form.Item colSpan={12} label="Genre" required>
              <Input.TextArea placeholder="请输入项目详细信息" name="genre" />
            </Form.Item>

            <Form.Item colSpan={12}>{actions}</Form.Item>
          </Form>
        </>
      );
      break;
    case 1:
      actions = (
        <>
          <Button onClick={goPrev} disabled={uploadedCount === 0 ? false : true} style={{ marginRight: '5px' }}>
            上一步
          </Button>
          <Form.Submit type="primary" disabled={uploadedCount >= 1 ? true : false} onClick={uploadFile} validate>
            {uploadedCount === 0 ? "上传文件" : uploadedCount === 5 ? "上传完成" : "上传中"}
            {(creating || (uploadedCount <= 4 && uploadedCount >= 1)) && <Loading />}
          </Form.Submit>
          <Button disabled={uploadedCount === 5 ? false : true} onClick={goNext} style={{ marginRight: '5px' }}>
            下一步
          </Button>
        </>
      );

      mainbody = (
        <Form
          field={formField}
          isPreview={(creating || (uploadedCount <= 4 && uploadedCount >= 1))}
          className={styles.form}
          responsive
          fullWidth
          labelAlign="top"
        >
          <Form.Item colSpan={12} label="Image" required>
            <Upload limit={1} listType="image" shape="card" onChange={onChange} name="img" autoUpload={false} >Upload Image</Upload>
          </Form.Item>

          <Form.Item colSpan={12} label="Title image" required>
            <Upload limit={1} listType="image" shape="card" name="imgTitle" autoUpload={false}>Upload Image</Upload>
          </Form.Item>

          <Form.Item colSpan={12} label="Thumbnail image" required>
            <Upload limit={1} listType="image" shape="card" name="imgSm" autoUpload={false}>Upload Image</Upload>
          </Form.Item>

          <Form.Item colSpan={12} label="SourceVideo" required>
            <Upload limit={1} listType="image" shape="card" name="video" autoUpload={false} >Upload Video</Upload>
          </Form.Item>

          <Form.Item colSpan={12}>
            {actions}
          </Form.Item>
        </Form>

      );

      break;
    case 2:

      actions = (
        <>
          <Form.Submit type="primary" onClick={submit} style={{ marginRight: '5px' }}>
            提交{(creating || (uploadedCount <= 4 && uploadedCount >= 1)) && <Loading />}
          </Form.Submit>
        </>
      );
      mainbody = (
        <Form
          field={false}
          isPreview={true}
          className={styles.form}
          responsive
          fullWidth
          labelAlign="top"
        >
          <Form.Item colSpan={12} label="Title">
            <Input name="title" value={`${video.title}`} />
          </Form.Item>

          <Form.Item colSpan={12} label="Description">
            <Input name="desc" value={`${video.desc}`} />
          </Form.Item>

          <Form.Item colSpan={12} label="Type">
            <Input name="type" value={`${video.type}`} />
          </Form.Item>

          <Form.Item colSpan={12} label="Genre">
            <Input name="genre" value={`${video.genre}`} />
          </Form.Item>

          <Form.Item colSpan={12} label="Image">
            <Input name="img" value={`${video.img}`} />
          </Form.Item>

          <Form.Item colSpan={12} label="Title image">
            <Input name="imgTitle" value={`${video.imgTitle}`} />
          </Form.Item>

          <Form.Item colSpan={12} label="Thumbnail image">
            <Input name="imgSm" value={`${video.imgSm}`} />
          </Form.Item>

          <Form.Item colSpan={12} label="SourceVideo">
            <Input name="video" value={`${video.video}`} />
          </Form.Item>

          <Form.Item colSpan={12}>
            {actions}
          </Form.Item>
        </Form>
      );
      break;
    case 3:
      mainbody = (
        <>
          <div align="center">
            <Icon type="success-filling" size={72} className={styles.succesIcon} />
            <Typography.H1>提交成功</Typography.H1>
            {/* <Typography.Text>5s 后自动跳转至工单页</Typography.Text> */}
            <div margin={20} direction="row">
              <Button type="primary" style={{ marginRight: '5px' }} onClick={onCancel}>
                关闭表单
              </Button>
              <Button onClick={goInitial}>继续创建</Button>
            </div>
          </div>
        </>
      );
      break;
    default:
      break;
  }

  return (
    <div>

      <Card free>
        <Card.Content className={styles.StepForm}>
          <Step current={currentStep} shape="circle">
            {steps}
          </Step>
          {mainbody}
        </Card.Content>
      </Card>
    </div>
  );
};

export default StepForm;