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
  position: relative;
  top: 0;
  left: 0;
  color: #000;
  font-size: 14px;
  font-weight: 900;
  margin-bottom: 8px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

const MessageBody = styled.p`
  margin: 0 0 5px 0;
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: ${({ type }) => (type === 'incoming' ? '#fff' : '#333')};
`;

function Message({ user, userFullName, type, text, timestamp}) {
  return (
    <MessageWrapper type={type}>
      <MessageHeader>{userFullName}</MessageHeader>
      <MessageBody>{text}</MessageBody>
      {timestamp && <Timestamp type={type}>{timestamp}</Timestamp>}
    </MessageWrapper>
  );
}

export default Message;
