import React, { useCallback, useState } from 'react';
import { Button, Field, Table, Card, Pagination, Message, Dialog, Icon } from '@alifd/next';
import { useFusionTable, useSetState } from 'ahooks';

import EmptyBlock from './EmptyBlock';
import ExceptionBlock from './ExceptionBlock';
import DialogOperation from './DialogOperation';
import { ActionType, OperaitionProps } from './Operation';

import styles from './index.module.scss';
import DialogForm from '../DialogForm';

import store from '@/store';
import { useAuth } from 'ice';

interface ColumnWidth {
  _id: number;
  title: number;
  genre: number;
  type: number;
  content: number;
  operation: number;
}

interface DialogState {
  columnWidth: ColumnWidth;
  optCol: any;
  actionType: ActionType;
  actionVisible: boolean;
}

const defaultColumnWidth: ColumnWidth = {
  _id: 140,
  title: 500,
  genre: 500,
  type: 500,
  content: 1000,
  operation: 500
};

interface DialogTableProps {
  // setFormVisible: () => void
}

const DialogTable: React.FC<DialogTableProps> = () => {
  const [auth] = useAuth();
  const [fromVisible, setFormVisible] = useState(false)
  const [state, setState] = useSetState<DialogState>({
    columnWidth: defaultColumnWidth,
    optCol: null,
    actionType: 'preview',
    actionVisible: false,
  });
  const { actionVisible, columnWidth, optCol } = state;
  const field = Field.useField([]);

  const [userState, userDispatchers] = store.useModel('user');

  const getTableData = (
    { current, pageSize }: { current: number; pageSize: number },
    formData: { status: 'normal' | 'empty' | 'exception' },
  ): Promise<any> => {
    if (!formData.status || formData.status === 'normal') {
      let query = `page=${current}&size=${pageSize}`;
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          query += `&${key}=${value}`;
        }
      });
      return fetch(`/api/lists?${query}`, {
        headers: {
          token: "Bearer " + userState.accessToken
        },
      }).then(res => res.json())
        .then(res => {
          console.log(res.results);

          return ({
            total: res.count,
            list: res.results.slice(0, 10).map((list) => {
              list.content = list.content.map((item) => { return item.title + item._id })
              return list
            }),
          })
        });
    }
    if (formData.status === 'empty') {
      return Promise.resolve([]);
    }
    if (formData.status === 'exception') {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('data exception'));
        }, 1000);
      });
    }

    return Promise.resolve([]);
  };
  const { paginationProps, tableProps, search, error, refresh } = useFusionTable(getTableData, {
    field,
  });
  const { reset } = search;

  const onResizeChange = (dataIndex: keyof typeof defaultColumnWidth, width: number) => {
    const newWidth = {
      ...columnWidth,
    };
    newWidth[dataIndex] += width;
    setState({ columnWidth: newWidth });
  };

  const operationCallback = useCallback(({ actionType, dataSource }: OperaitionProps): void => {
    setState({
      actionType,
      optCol: dataSource,
      actionVisible: true,
    });
  }, [setState]);

  const handleCancel = useCallback((): void => {
    setState({ actionVisible: false });
  }, [setState]);

  const handleOk = useCallback((): void => {
    const { actionType } = state;
    if (actionType === 'preview') {
      handleCancel();
      return;
    }
    Message.success(actionType === 'add' ? '添加成功!' : '编辑成功!');
    reset();
    handleCancel();
  }, [handleCancel, reset, state]);

  const deleteLists = async (id) => {
    const res = await fetch(`/api/lists/${id}`, {
      headers: {
        token: "Bearer " + userState.accessToken
      },
      method: 'DELETE',
    })
    console.log(res.json());

  }

  const popupCustomIcon = () => {
    Dialog.confirm({
      title: "Warning",
      content: '你没有权限操作，仍要继续？',
      messageProps: {
        type: "warning"
      },
      onOk: () => setFormVisible(!fromVisible),
      onCancel: () => console.log("cancel")
    });
  };


  const handleDelete = useCallback((data: any) => {
    if (!data) {
      return;
    }
    Dialog.confirm({
      title: '删除提醒',
      content: `确定删除 ${data.title} 吗`,
      async onOk() {
        try {
          await deleteLists(data._id)
        } catch (err) {
          console.log(err);
        }

        Message.success(`${data.title} 删除成功!`);
        reset();
      },
    });
  }, [reset]);

  const cellOperation = (...args: any[]): React.ReactNode => {
    const record = args[2];
    return (
      <div>
        <Button
          text
          type="primary"
          onClick={() => {
            if (auth.isAdmin) {
              operationCallback({ actionType: 'edit', dataSource: record })
            } else {
              Message.error("你没有权限编辑 list，请联系管理员获取权限...")
            }
          }}
        >
          Edit
        </Button>
        &nbsp;&nbsp;
        <Button
          text
          type="primary"
          onClick={() => {
            if (auth.isAdmin) {
              handleDelete(record)
            } else {
              Message.error("你没有权限删除 list，请联系管理员获取权限...")
            }
          }}
        >
          Delete
        </Button>
        &nbsp;&nbsp;
        <Button
          text
          type="primary"
          onClick={() => operationCallback({ actionType: 'preview', dataSource: record })}
        >
          Preview
        </Button>
      </div>
    );
  };

  const renderContent = titles => {
    return titles.map((title, index) => {
      return <li key={index}>{title}</li>
    })
  }

  return (
    <div className={styles.DialogTable}>
      <Card free>
        <Card.Content>
          <div className={styles.actionBar}>
            <div className={styles.buttonGroup}>
              <Button type="primary" onClick={() => {
                if (auth.isAdmin) {
                  setFormVisible(!fromVisible)
                } else {
                  popupCustomIcon()
                }

              }}>
                New List
              </Button>
            </div>
          </div>
          <Table
            {...tableProps}
            onResizeChange={onResizeChange}
            emptyContent={error ? <ExceptionBlock onRefresh={refresh} /> : <EmptyBlock />}
            primaryKey="_id"
          >
            <Table.Column title="Id" dataIndex="_id" resizable width={columnWidth._id} />
            <Table.Column title="Title" dataIndex="title" resizable width={columnWidth.title} />
            <Table.Column title="Type" dataIndex="type" resizable width={columnWidth.type} />
            <Table.Column title="Genre" dataIndex="genre" resizable width={columnWidth.genre} />
            <Table.Column title="Content" dataIndex="content" resizable width={columnWidth.content} cell={renderContent} />
            <Table.Column
              title="Operation"
              resizable
              width={columnWidth.operation}
              cell={cellOperation}
            />
          </Table>
          <Pagination
            style={{ marginTop: 16, textAlign: 'right' }}
            totalRender={(total) => (
              <>
                共{' '}
                <Button text type="primary">
                  {total}
                </Button>{' '}
                个记录
              </>
            )}
            {...paginationProps}
          />
        </Card.Content>
      </Card>
      <DialogOperation
        visible={actionVisible}
        actionType={state.actionType}
        dataSource={optCol}
        onOk={handleOk}
        onClose={handleCancel}
        onCancel={handleCancel}
      />
      <DialogForm
        visible={fromVisible}
        setFormVisible={
          (): void => {
            setFormVisible(!fromVisible);
          }}
        reset={reset}
      />
    </div>
  );
};

export default DialogTable;
