import React from 'react';
import Exception from './components/Exception';

export default function ServerError() {
  return (
    <Exception
      statusCode="500"
      image="https://img.alicdn.com/tfs/TB1RRSUoET1gK0jSZFrXXcNCXXa-200-200.png"
      description="这个页面还没开发哦~"
    />
  );
}
