import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';

const channels = [{
  id: '1',
  name: 'Galaxy Zero',
  messages: [{
    id: '1',
    text: '好酷啊啊啊啊',
  }, {
    id: '2',
    text: '有人吗?',
  }]
}, {
  id: '2',
  name: 'Galaxy Alpha',
  messages: [{
    id: '3',
    text: '刚换台，感觉很不错',
  }, {
    id: '4',
    text: '前排占座',
  }]
},
{
  id: '3',
  name: 'Galaxy Beta',
  messages: [{
    id: '5',
    text: '这个好看',
  }, {
    id: '6',
    text: 'Yoohoo!',
  }]
},
];
let nextId = 4;
let nextMessageId = 7;

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (root, { id }) => {
      return channels.find(channel => channel.id === id);
    },
  },
  Mutation: {
    addChannel: (root, args) => {
      const newChannel = { id: String(nextId++), messages: [], name: args.name };
      channels.push(newChannel);
      return newChannel;
    },
    addMessage: (root, { message }) => {
      const channel = channels.find(channel => channel.id === message.channelId);
      if(!channel)
        throw new Error("Channel does not exist");

      const newMessage = { id: String(nextMessageId++), text: message.text };

      channel.messages.push(newMessage);
      // console.log(channel.messages.length);

      pubsub.publish('messageAdded', { messageAdded: newMessage, channelId: message.channelId });

      return newMessage;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('messageAdded'), (payload, variables) => {
        // The `messageAdded` channel includes events for all channels, so we filter to only
        // pass through events for the channel specified in the query
        return payload.channelId === variables.channelId;
      }),
    }
  },
};
