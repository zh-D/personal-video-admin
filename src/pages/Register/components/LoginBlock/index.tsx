/* eslint-disable @iceworks/best-practices/no-secret-info */
import React, { useState } from 'react';
import { useHistory } from 'ice';
import PropTypes from 'prop-types';
import { Input, Message, Form, Loading } from '@alifd/next';

import styles from './index.module.scss';
import { Link } from 'react-router-dom';

import { useRequest } from 'ice';
import userService from '@/services/user';
import { logger } from 'ice';

const { Item } = Form;

export interface RegisterProps {
  email: string;
  password: string;
  rePassword: string;
  username: string;
}

export default function RegisterBlock() {
  const { data, error, loading, request } = useRequest(userService.register);
  const history = useHistory()
  const [postData, setValue] = useState<RegisterProps>({
    email: '',
    password: '',
    rePassword: '',
    username: ''
  });


  const formChange = (value: RegisterProps) => {
    setValue(value);
  };

  const checkPass = (rule: any, values: string, callback: (errors?: string) => void) => {
    if (values && values !== postData.password) {
      return callback('密码不一致');
    } else {
      return callback();
    }
  };

  const handleSubmit = (values: RegisterProps, errors: []) => {
    if (errors) {
      logger.info('errors', errors);
      return;
    }

    Message.error("注册功能暂未开放,跳转到登录页...")
    history.push('/user/login');
    return

    request(values)
    if (!error) {
      Message.success("注册成功")
      history.push('/user/login');
    } else {
      Message.error('注册失败');
    }

  };

  return (
    <div className={styles.RegisterBlock}>
      <div className={styles.innerBlock}>
        <a href="#">
          <img
            className={styles.logo}
            src="https://img.alicdn.com/tfs/TB1KtN6mKH2gK0jSZJnXXaT1FXa-1014-200.png"
            alt="logo"
          />
        </a>
        <p className={styles.desc}>注册账号</p>

        <Form value={postData} onChange={formChange} size="large">
          <Item required requiredMessage="必填">
            <Input name="username" size="large" maxLength={10} placeholder="用户名" />
          </Item>
          <Item format="email" required requiredMessage="必填">
            <Input name="email" size="large" maxLength={20} placeholder="邮箱" />
          </Item>
          <Item required requiredMessage="必填">
            <Input.Password
              name="password"
              size="large"
              htmlType="password"
              placeholder="至少六位密码，区分大小写"
            />
          </Item>
          <Item required requiredTrigger="onFocus" requiredMessage="必填" validator={checkPass}>
            <Input.Password
              name="rePassword"
              size="large"
              htmlType="password"
              placeholder="确认密码"
            />
          </Item>
          <Item>
            <Form.Submit
              type="primary"
              onClick={handleSubmit}
              className={styles.submitBtn}
              validate
            >
              {loading ? <Loading /> : "注册账号"}
            </Form.Submit>
          </Item>
          <Item style={{ textAlign: 'center' }}>
            <Link to="/login" className={styles.link}>
              使用已有账号登录
            </Link>
          </Item>
        </Form>
      </div>
    </div>
  );
}

RegisterBlock.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  value: PropTypes.object,
};

RegisterBlock.defaultProps = {
  value: {},
};
