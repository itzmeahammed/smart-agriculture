import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopupAlert from '../../components/PopupAlert';
import {useTranslation} from 'react-i18next'; // ✅ Import useTranslation

const SignUpScreen = ({navigation}) => {
  const {t} = useTranslation(); // ✅ Hook for translations

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleSignUp = async () => {
    if (
      !username ||
      !email ||
      !password ||
      !role ||
      (role !== 'wholesaler' && !secretCode)
    ) {
      setAlertType('error');
      setAlertMessage(t('signup.fillAllFields'));
      setAlertVisible(true);
      return;
    }

    if (role === 'farmer' && !/^farmer00[1-9]$|^farmer010$/.test(secretCode)) {
      setAlertType('error');
      setAlertMessage(t('signup.invalidFarmerCode'));
      setAlertVisible(true);
      return;
    }
    if (
      role === 'deliveryMan' &&
      !/^delivery00[1-9]$|^delivery010$/.test(secretCode)
    ) {
      setAlertType('error');
      setAlertMessage(t('signup.invalidDeliveryCode'));
      setAlertVisible(true);
      return;
    }

    try {
      const storedUsersData = await AsyncStorage.getItem('@usersData');
      let usersData = storedUsersData ? JSON.parse(storedUsersData) : [];

      const newUser = {username, email, password, role, secretCode};
      usersData.push(newUser);

      await AsyncStorage.setItem('@usersData', JSON.stringify(usersData));

      setAlertType('success');
      setAlertMessage(t('signup.success'));

      setTimeout(() => {
        navigation.navigate('LoginScreen');
      }, 1000);
    } catch (error) {
      console.error('Error saving data', error);
      setAlertType('error');
      setAlertMessage(t('signup.error'));
      setAlertVisible(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('signup.title')}</Text>
      <Text style={styles.subtitle}>{t('signup.subtitle')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('signup.username')}
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder={t('signup.email')}
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t('signup.password')}
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Picker
        selectedValue={role}
        style={styles.picker}
        onValueChange={itemValue => {
          setRole(itemValue);
          setSecretCode('');
        }}>
        <Picker.Item label={t('signup.selectRole')} value="" />
        <Picker.Item label={t('signup.farmer')} value="farmer" />
        <Picker.Item label={t('signup.deliveryMan')} value="deliveryMan" />
        <Picker.Item label={t('signup.wholesaler')} value="wholesaler" />
      </Picker>

      {(role === 'farmer' || role === 'deliveryMan') && (
        <TextInput
          style={styles.input}
          placeholder={t('signup.secretCodePlaceholder', {role})}
          placeholderTextColor="#aaa"
          value={secretCode}
          onChangeText={setSecretCode}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>{t('signup.signUp')}</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        {t('signup.alreadyHaveAccount')}{' '}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate('LoginScreen')}>
          {t('signup.login')}
        </Text>
      </Text>

      {alertVisible && (
        <PopupAlert
          type={alertType}
          message={alertMessage}
          onClose={handleCloseAlert}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    color: 'black',
  },
  picker: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 25,
    color: 'black',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 14,
    color: '#777',
    marginTop: 20,
    textAlign: 'center',
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
