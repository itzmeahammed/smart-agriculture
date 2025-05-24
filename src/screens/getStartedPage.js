import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GetStartedScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const handleLanguageChange = async value => {
    if (value) {
      await AsyncStorage.setItem('user-language', value);
      i18n.changeLanguage(value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('title')}</Text>
      <Text style={styles.description}>{t('description')}</Text>
      <Image
        source={{
          uri: 'https://img.freepik.com/free-vector/hand-drawn-flat-design-farmers-market-illustration_23-2149352856.jpg',
        }}
        size={150}
        style={styles.image}
      />

      {/* Language Picker */}
      <RNPickerSelect
        onValueChange={handleLanguageChange}
        items={[
          {label: 'English', value: 'en'},
          {label: 'தமிழ்', value: 'ta'},
          {label: 'hindi', value: 'hi'},
        ]}
        placeholder={{label: 'Select Language', value: null}}
        style={{
          inputIOS: styles.languagePicker,
          inputAndroid: styles.languagePicker,
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.buttonText}>{t('getStarted')}</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>{t('footer')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#eaf4f1',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
  },
  description: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  image: {
    marginBottom: 30,
    height: 200,
    width: 300,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  languagePicker: {
    fontSize: 16,
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    color: '#333',
  },
});

export default GetStartedScreen;
