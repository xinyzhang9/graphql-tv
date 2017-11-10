import React, { Component } from 'react';
import MessageList from './MessageList';
import ChannelPreview from './ChannelPreview';
import NotFound from './NotFound';

import {
    gql,
    graphql,
} from 'react-apollo';

import AnimatedSky from './AnimatedSky';
import Universe from './Universe';

const messagesSubscription = gql`
  subscription messageAdded($channelId: ID!) {
    messageAdded(channelId: $channelId) {
      id
      text
    }
  }
`

class ChannelDetails extends Component {
  componentWillMount() {
    this.props.data.subscribeToMore({
      document: messagesSubscription,
      variables: {
        channelId: this.props.match.params.channelId,
      },
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newMessage = subscriptionData.data.messageAdded;
        if (!prev.channel.messages.find((msg) => msg.id === newMessage.id)) {
          return Object.assign({}, prev, {
            channel:Object.assign({}, prev.channel, {
              messages: [...prev.channel.messages, newMessage],
            })
          });
        } else {
          return prev;
        }
      }
    });
  }

  render(){
    const { data: {loading, error, channel }, match } = this.props;
    if (loading) {
      return <ChannelPreview channelId={match.params.channelId}/>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    if(channel === null){
      return <NotFound />
    }
    if(channel.name === 'Galaxy Alpha') {
      return (
        <div>
          <div className="channelName">
            {channel.name}
          </div>
          <MessageList messages={channel.messages.slice(channel.messages.length-6,channel.messages.length).reverse()}/>
          <Universe bgImage = "https://www.marcoguglie.it/Codepen/AnimatedHeaderBg/demo-1/img/demo-1-bg.jpg"/>
        </div>
      );
    } else if(channel.name === 'Galaxy Beta') {
      return (
        <div>
          <div className="channelName">
            {channel.name}
          </div>
          <MessageList messages={channel.messages.slice(channel.messages.length-6,channel.messages.length).reverse()}/>
          <Universe bgImage = "https://orig00.deviantart.net/5704/f/2014/053/6/5/free_space_galaxy_texture_by_lyshastra-d77gh18.jpg"/>
        </div>
      );
    } else if(channel.name === 'Galaxy Zero') {
      return (
        <div>
          <div className="channelName">
            {channel.name}
          </div>
          <MessageList messages={channel.messages.slice(channel.messages.length-6,channel.messages.length).reverse()}/>
          <Universe bgImage = "https://i1.wp.com/trendintech.com/wp-content/uploads/2017/02/black-hole-in-galaxy.jpg?fit=1920%2C1080"/>
        </div>
      );
    }else  {
      return (
        <div>
           <AnimatedSky />
          <div className="channelName">
            {channel.name}
          </div>
          <MessageList messages={channel.messages.slice(channel.messages.length-6,channel.messages.length).reverse()}/>
        </div>
      );
    }



  }
}


export const channelDetailsQuery = gql`
  query ChannelDetailsQuery($channelId : ID!) {
    channel(id: $channelId) {
      id
      name
      messages {
        id
        text
      }
    }
  }
`;

export default (graphql(channelDetailsQuery, {
  options: (props) => ({
    variables: { channelId: props.match.params.channelId },
  }),
})(ChannelDetails));
