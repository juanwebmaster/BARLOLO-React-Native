/* eslint-disable prettier/prettier */
import React from 'react';
import { ActivityIndicator, StyleSheet, View, Modal } from 'react-native';

export default class LoadingComponent extends React.Component {
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
      }}>
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000000A0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
