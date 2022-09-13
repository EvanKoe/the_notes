import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import React, { useEffect, useState } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SETTINGS_KEY } from '../globals';
import { eng, fr, langToText } from '../translations/translations';
import { SettingsStorage, Translations } from '../Types/types';

const Settings = ({ navigation }: any) => {
  const [lang, setLang] = useState<Translations>(eng);
  const [isModal, setIfModal] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((promise) => {
      console.log(promise === null ? "promise null" : "");
      if (promise === null) {
        return console.log('Null settings');
      }
      let a = JSON.parse(promise);
      console.log(langToText(a.language));
      setLang(a.language);
    });
  }, []);

  const onPressLang = (l: Translations) => {
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ language: l }));
    setIfModal(false);
    setLang(l);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />
      <TouchableOpacity
        onPress={() => navigation.navigate('main')}
        style={{ marginTop: 30 }}
      >
        <Ionicons name="arrow-back-outline" size={24} color='#ddd' />
      </TouchableOpacity>
      <Text style={styles.settingsTitle}>{lang.settingsTitle}</Text>
      {/* Flags button */}
      <TouchableOpacity onPress={() => setIfModal(e => !e)}>
        <Text style={styles.langText}>{lang.settingsLang}</Text>
        <Text style={styles.currLang}>{langToText(lang)}</Text>
      </TouchableOpacity>

      {isModal && (
        <TouchableOpacity style={styles.modalContainer} onPress={() => setIfModal(false)}>
          <View style={styles.modal}>
            <TouchableOpacity
              onPress={() => onPressLang(fr)}
              style={{ flexDirection: 'row', marginBottom: 10 }}
            >
              <Image source={require("../assets/fr.png")} style={styles.flag} />
              <Text style={styles.currLang}>Français</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressLang(eng)}
              style={{ flexDirection: 'row' }}
            >
              <Image source={require("../assets/eng.png")} style={styles.flag} />
              <Text style={styles.currLang}>English</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )
      }
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212121',
    flex: 1,
    paddingHorizontal: 15
  },
  modal: {
    borderRadius: 15,
    backgroundColor: '#313131',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: '#00000077',
    top: 0,
    left: 0,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width
  },
  flag: {
    width: 50,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginHorizontal: 5,
    marginRight: 20,
  },
  langText: {
    color: '#eee',
    fontSize: 30,
    marginRight: 'auto'
  },
  currLang: {
    color: '#bbb',
    fontSize: 22,
    textAlignVertical: 'center'
  },
  settingsTitle: {
    color: '#eee',
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 30,
  }
});

export default Settings;
