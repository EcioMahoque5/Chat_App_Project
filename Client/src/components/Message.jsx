import React from 'react';
import styled from 'styled-components';

const MessageWrapper = styled.div`
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 40px;
  max-width: 300px;
  position: relative;
  background: ${({ type }) => (type === 'incoming' ? '#8F8BE8' : '#e9eafd')};
  color: ${({ type }) => (type === 'incoming' ? '#fff' : '#333')};
  margin-left: ${({ type }) => (type === 'outgoing' ? 'auto' : 'initial')};
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

const MessageHeader = styled.h4`
  position: absolute;
  top: -20px;
  left: 0;
  color: #333;
  font-size: 14px;
`;

const MessageBody = styled.p`
  margin: 0;
`;

function Message({ msg, type }) {
  return (
    <MessageWrapper type={type}>
      <MessageHeader>{msg.user}</MessageHeader>
      <MessageBody>{msg.message}</MessageBody>
    </MessageWrapper>
  );
}

export default Message;
