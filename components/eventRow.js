import React from 'react';
import {
  Text,
} from 'react-native';

export default class MonoText extends React.Component {
  foo() {
    return this.bar;
  }

  render() {
    const {
      eventName,
      person: { first, last },
     } = this.props;

    return (
      <Text>
        {eventName} -
        {first} {last}
      </Text>
    );
  }
}
