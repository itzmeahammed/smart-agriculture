import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import PopupAlert from '../../components/PopupAlert'; // Import the custom PopupAlert component
import {useTranslation} from 'react-i18next';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const {t} = useTranslation();

  const handleLogin = async () => {
    try {
      // Get the users data from local storage (array of users)
      const storedUsersData = await AsyncStorage.getItem('@usersData');
      if (storedUsersData) {
        const usersData = JSON.parse(storedUsersData);

        // Find a user matching the entered username and password
        const user = usersData.find(
          u => u.username === username && u.password === password,
        );

        if (user) {
          console.log('Login successful!');
          setAlertType('success');
          setAlertMessage('Login successful!');

          // Save the user profile data into AsyncStorage
          await AsyncStorage.setItem('@profileData', JSON.stringify(user));

          // Navigate based on the role
          switch (user.role) {
            case 'farmer':
              navigation.navigate('FarmerDashboard'); // Navigate to Farmer Dashboard
              break;
            case 'deliveryMan':
              navigation.navigate('DeliveryManDashboard'); // Navigate to Delivery Man Dashboard
              break;
            case 'wholesaler':
              navigation.navigate('WholesalerDashboard'); // Navigate to Wholesaler Dashboard
              break;
            default:
              navigation.navigate('Home'); // Default navigation
              break;
          }
        } else {
          console.log('Invalid credentials!');
          setAlertType('error');
          setAlertMessage('Invalid username or password!');
        }
      } else {
        console.log('No user found in local storage.');
        setAlertType('error');
        setAlertMessage('No user found, please sign up first!');
      }
    } catch (error) {
      console.error('Error retrieving data from local storage:', error);
      setAlertType('error');
      setAlertMessage('Error logging in!');
    } finally {
      // Show the alert
      setAlertVisible(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('GetStarted')}>
        <Text style={styles.backButtonText}>← {t('getStarted')}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{t('loginTitle')}</Text>
      <Text style={styles.subtitle}>{t('loginSubtitle')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('username')}
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder={t('password')}
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t('signIn')}</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        {t('noAccount')}{' '}
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate('SignUpScreen')}>
          {t('signUp')}
        </Text>
      </Text>

      {/* PopupAlert for showing messages */}
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
    backgroundColor: '#f7f7f7',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
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
  signupText: {
    fontSize: 14,
    color: '#777',
    marginTop: 20,
  },
  signupLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
