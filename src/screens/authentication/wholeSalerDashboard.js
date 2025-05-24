import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductList from './productList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PopupAlert from '../../components/PopupAlert';
import {useTranslation} from 'react-i18next';

const WholesalerDashboard = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      const storedProducts = await AsyncStorage.getItem('@products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }

      const storedCart = await AsyncStorage.getItem('@cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };

    loadData();
  }, []);

  const handleAddToCart = async (product, quantity) => {
    try {
      const profileData = await AsyncStorage.getItem('@profileData');
      const user = profileData ? JSON.parse(profileData) : null;

      if (user) {
        const storedCart = await AsyncStorage.getItem('@cart');
        let updatedCart = storedCart ? JSON.parse(storedCart) : [];
        updatedCart = updatedCart.filter(item => item.isDeleted !== true);
        const existingProductIndex = updatedCart.findIndex(
          item => item.id === product.id && item.username === user.username,
        );

        if (existingProductIndex >= 0) {
          updatedCart[existingProductIndex].quantity += quantity;
        } else {
          updatedCart.push({...product, quantity, username: user.username});
        }

        await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));

        setCart(updatedCart);

        setAlertType('success');
        setAlertMessage(
          `${product.name} ${t('wholesalerDashboard.addedToCart')}`,
        );
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('wholesalerDashboard.title')}</Text>

      {/* Header with Cart and Order History icons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.freepik.com/512/487/487932.png',
            }}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/12457/12457658.png',
            }}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Product List Section */}
      <ProductList products={products} handleAddToCart={handleAddToCart} />

      {/* Show alert */}
      {alertVisible && (
        <PopupAlert
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    margin: 10,
  },
});

export default WholesalerDashboard;
