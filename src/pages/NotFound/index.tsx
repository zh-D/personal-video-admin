import React, { Component } from 'react';
import ServerError from './components/ServerError';

export default function () {
  return (
    <div className="NotFound-page">
      {/* server error */}
      <ServerError />
    </div>
  );
}
