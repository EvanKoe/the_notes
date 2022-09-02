import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import React, { useEffect, useState } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SETTINGS_KEY } from '../globals';
import { eng, fr } from '../translations/translations';
import { Translations } from '../Types/types';

const Settings = ({ navigation }: any) => {
  const [lang, setLang] = useState<Translations>(eng);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((promise) => {
      setLang(promise === null ? eng : JSON.parse(promise).language);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />
      <Text>{lang.settingsTitle}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.langText}>{lang.settingsLang} : </Text>
        <Image source={require("../assets/fr.png")} style={styles.flag} />
        <Image source={require("../assets/eng.png")} style={styles.flag} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212121',
    flex: 1
  },
  flag: {
    width: 50,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginHorizontal: 5
  }
});

export default Settings;