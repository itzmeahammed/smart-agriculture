import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing icon for delete functionality
import RNPickerSelect from 'react-native-picker-select'; // Import the new picker
import {useTranslation} from 'react-i18next';

const Cart = ({handlePlaceOrder}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentCode, setPaymentCode] = useState('COD'); // Default payment method as COD
  const [username, setUsername] = useState('');
  const [cart, setCart] = useState([]); // State for storing cart data
  const {t} = useTranslation();

  useEffect(() => {
    // Fetch user profile from AsyncStorage to get the username
    const fetchUserProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem('@profileData');
        if (profileData) {
          const user = JSON.parse(profileData);
          setUsername(user.username); // Set the username of the logged-in user
        }
      } catch (error) {
        console.error(
          'Error retrieving user profile from AsyncStorage:',
          error,
        );
      }
    };

    const fetchCartData = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('@cart');

        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);

          // Filter out items that have isDeleted: true
          const filteredCart = parsedCart.filter(
            item => item.isDeleted !== true,
          );

          // Set the filtered cart state
          setCart(filteredCart);
        }
      } catch (error) {
        console.error('Error retrieving cart data from AsyncStorage:', error);
      }
    };

    fetchUserProfile();
    fetchCartData();
  }, []);

  const handleSubmitOrder = async () => {
    if (!name || !address || !paymentCode) {
      Alert.alert(t('fillAllFields'));
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    const orderCode = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit code

    const status = 'Pending'; // Default status
    const totalPrice = filteredCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const newOrder = {
      code: orderId,
      randomCode: orderCode,
      name,
      address,
      paymentCode,
      username,
      status,
      totalPrice,
      cart: filteredCart,
      createdAt: new Date().toISOString(),
    };

    try {
      // Get existing orders
      const storedOrders = await AsyncStorage.getItem('@orders');
      const parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];

      // Add new order
      parsedOrders.push(newOrder);

      // Save updated order list
      await AsyncStorage.setItem('@orders', JSON.stringify(parsedOrders));

      // Clear cart after placing order
      await clearCart();

      Alert.alert(t('orderSuccess'));
    } catch (error) {
      console.error('Error saving order:', error);
      Alert.alert(t('orderFail'));
    }

    handlePlaceOrder({name, address, paymentCode, username});
  };

  const handleDeleteItem = async itemId => {
    try {
      // Retrieve the current cart from AsyncStorage
      const storedCart = await AsyncStorage.getItem('@cart');
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];

      // Mark the item with the matching id as deleted (set isDeleted to true)
      const updatedCart = parsedCart.map(item =>
        item.id === itemId ? {...item, isDeleted: true} : item,
      );

      // Save the updated cart back to AsyncStorage
      await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));

      // Update the state to reflect the changes
      setCart(updatedCart);
    } catch (error) {
      console.error('Error marking item as deleted:', error);
    }
  };

  const handleIncreaseQuantity = async itemId => {
    // Increase quantity of item
    const updatedCart = cart.map(item =>
      item.id === itemId ? {...item, quantity: item.quantity + 1} : item,
    );

    // Update cart in AsyncStorage
    await AsyncStorage.setItem('@cart', JSON.stringify(updatedCart));

    // Update state
    setCart(updatedCart);
  };

  const clearCart = async () => {
    try {
      // Remove all cart data from AsyncStorage
      await AsyncStorage.removeItem('@cart');

      // Reset the cart state to empty
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart from AsyncStorage:', error);
    }
  };

  const filteredCart = cart.filter(item => item.username === username);

  // Calculate total price
  const totalAmount = filteredCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('cart.title')}</Text>

      <FlatList
        data={filteredCart}
        renderItem={({item}) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>
              {t('cart.quantity')}: {item.quantity}
            </Text>
            <Text style={styles.itemPrice}>
              {t('cart.price')}: ${item.price * item.quantity}
            </Text>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)}>
                <Text style={styles.actionText}>
                  {t('cart.increaseQuantity')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <TextInput
        style={styles.input}
        placeholder={t('cart.namePlaceholder')}
        value={name}
        onChangeText={setName}
        placeholderTextColor="#000"
      />
      <TextInput
        style={styles.input}
        placeholder={t('cart.addressPlaceholder')}
        value={address}
        onChangeText={setAddress}
        placeholderTextColor="#000"
      />

      <RNPickerSelect
        value={paymentCode}
        onValueChange={value => setPaymentCode(value)}
        items={[
          {label: t('cart.cod'), value: 'COD'},
          {label: t('cart.creditCard'), value: 'Credit Card'},
          {label: t('cart.debitCard'), value: 'Debit Card'},
        ]}
        style={pickerSelectStyles}
      />

      <Text style={styles.totalAmount}>
        {t('cart.total')}: ${totalAmount.toFixed(2)}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmitOrder}>
        <Text style={styles.buttonText}>{t('cart.placeOrder')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
        <Text style={styles.buttonText}>{t('cart.clearCart')}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Style for the Picker
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // To ensure the icon is aligned properly
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // To ensure the icon is aligned properly
  },
});

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
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#555',
  },
  itemPrice: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionText: {
    color: '#007BFF',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Cart;
