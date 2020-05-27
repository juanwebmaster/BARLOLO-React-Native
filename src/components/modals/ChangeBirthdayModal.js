import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../../config';

export default class ChangeBirthdayModal extends React.Component {
  onExit = () => {
    this.props.onExit();
  }

  onDateChange = (date) => {
    this.props.setDate(date);
  }

  render() {
    const {date} = this.props;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
      }}>
        <View style={styles.container}>
          <View style={styles.body}>
            <View style={styles.header}>
              <Text style={styles.title}>{i18n.t('Change Birthday')}</Text>
              <TouchableOpacity onPress={this.onExit}>
                <FontAwesomeIcon name='close' size={dynamicSize(20)} color='white'/>
              </TouchableOpacity>
            </View>
            <View style={{padding: 10, alignItems: 'center'}}>
              <DatePicker
                date={date}
                mode='date'
                onDateChange={this.onDateChange}
              />
            </View>
            {/* <View style={styles.footer}>
              <TouchableOpacity style={styles.button} onPress={this.changePassword}>
                <Text style={styles.btnlabel}>{i18n.t('Update')}</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flexDirection: 'column',
    backgroundColor: '#000000A0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: dynamicSize(12),
    paddingHorizontal: dynamicSize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.red,
  },
  title: {
    fontSize: dynamicSize(16),
    color: 'white',
  },
  rowStyle: {
    paddingTop: dynamicSize(12),
    paddingHorizontal: dynamicSize(10),
  },
  label: {
    width: '100%',
    fontSize: dynamicSize(14),
    color: Colors.black,
  },
  errorslabel: {
    fontSize: dynamicSize(13),
    color: Colors.red,
  },
  requerSymbol: {
    color: Colors.red
  },
  inputContainer: {
    width: '100%',
    height: dynamicSize(50),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  textInput: {
    flex: 1,
    fontSize: dynamicSize(13),
    marginHorizontal: dynamicSize(10),
    height: dynamicSize(48),
    color: Colors.black,
  },
  footer: {
    marginTop: dynamicSize(20),
    padding: dynamicSize(12),
    borderTopWidth: 1,
    borderColor: '#E2E2E2AD',
  },
  button: {
    backgroundColor: Colors.red,
    padding: dynamicSize(10),
    alignSelf: 'flex-end',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'red',
  },
  btnlabel: {
    color: 'white',
    fontSize: dynamicSize(16),
  }
});
