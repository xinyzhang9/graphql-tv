import React from 'react';

import AddMessage from './AddMessage';

const MessageList = ({ messages }) => {
  return (
    <div className="messagesList">
      <AddMessage />
      { messages.map( message =>
        (<div key={message.id} className={(message.id < 0 ? 'message optimistic' : 'message scroll-left')}>
            <p>{message.text}</p>
        </div>)
      )}
    </div>
  );
};
export default (MessageList);
