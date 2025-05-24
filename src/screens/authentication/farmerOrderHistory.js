import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import {useTranslation} from 'react-i18next';

const FarmerOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const {t} = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('@orders');
        if (storedOrders) {
          const parsed = JSON.parse(storedOrders);
          const cleanedOrders = parsed.map(order => {
            if (order.assignedTo === null) {
              const {assignedTo, ...rest} = order;
              return rest;
            }
            return order;
          });
          setOrders(cleanedOrders);
        }

        const storedUsers = await AsyncStorage.getItem('@usersData');
        if (storedUsers) {
          const allUsers = JSON.parse(storedUsers);
          const deliveryUsers = allUsers.filter(
            user => user.role === 'deliveryMan',
          );
          setDeliveryMen(deliveryUsers);
        }
      } catch (error) {
        console.error('Error fetching orders or users:', error);
        Alert.alert('Error', 'Failed to load data');
      }
    };

    fetchData();
  }, []);

  const handleAssignDelivery = async (orderId, deliveryUsername) => {
    try {
      const targetOrder = orders.find(order => order.code === orderId);
      if (targetOrder?.assignedTo) return;

      const updatedOrders = orders.map(order =>
        order.code === orderId
          ? {...order, assignedTo: deliveryUsername}
          : order,
      );

      await AsyncStorage.setItem('@orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      Alert.alert(
        t('farmerOrderHistory.successTitle'),
        t('farmerOrderHistory.assignedMessage', {username: deliveryUsername}),
      );
    } catch (error) {
      console.error('Error assigning delivery:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('farmerOrderHistory.title')}</Text>
      <FlatList
        data={orders}
        renderItem={({item}) => (
          <View style={styles.orderItem}>
            <Text style={styles.heading}>
              {t('farmerOrderHistory.orderSummary')}
            </Text>
            <View
              style={[
                styles.statusBadge,
                styles[
                  `status_${item.status?.toLowerCase().replace(/\s/g, '')}`
                ],
              ]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Text>
              <Text style={styles.label}>
                {t('farmerOrderHistory.orderId')}:
              </Text>{' '}
              {item.code}
            </Text>
            <Text>
              <Text style={styles.label}>
                {t('farmerOrderHistory.randomCode')}:
              </Text>{' '}
              {item.randomCode}
            </Text>
            <Text>
              <Text style={styles.label}>{t('farmerOrderHistory.name')}:</Text>{' '}
              {item.name}
            </Text>
            <Text>
              <Text style={styles.label}>
                {t('farmerOrderHistory.username')}:
              </Text>{' '}
              {item.username}
            </Text>
            <Text>
              <Text style={styles.label}>
                {t('farmerOrderHistory.address')}:
              </Text>{' '}
              {item.address}
            </Text>
            <Text>
              <Text style={styles.label}>
                {t('farmerOrderHistory.paymentCode')}:
              </Text>{' '}
              {item.paymentCode}
            </Text>
            <Text>
              <Text style={styles.label}>
                {t('farmerOrderHistory.totalPrice')}:
              </Text>{' '}
              ${item.totalPrice}
            </Text>
            <Text>
              <Text style={styles.label}>
                {t('farmerOrderHistory.createdAt')}:
              </Text>{' '}
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            <Text style={[styles.label, {marginTop: 10}]}>
              {t('farmerOrderHistory.cartItems')}:
            </Text>
            {item.cart && item.cart.length > 0 ? (
              item.cart.map((cartItem, idx) => (
                <Text key={idx} style={styles.cartItem}>
                  - {cartItem.name} x {cartItem.quantity}
                </Text>
              ))
            ) : (
              <Text style={styles.cartItem}>
                {t('farmerOrderHistory.noCartItems')}
              </Text>
            )}

            <Text style={[styles.label, {marginTop: 10}]}>
              {t('farmerOrderHistory.assignedTo')}:
            </Text>
            <Text style={{color: item.assignedTo ? '#4CAF50' : '#f44336'}}>
              {item.assignedTo || t('farmerOrderHistory.notAssigned')}
            </Text>

            {!item.assignedTo && (
              <View style={{marginTop: 10}}>
                <RNPickerSelect
                  onValueChange={value =>
                    handleAssignDelivery(item.code, value)
                  }
                  items={deliveryMen.map(dm => ({
                    label: dm.username,
                    value: dm.username,
                  }))}
                  placeholder={{
                    label: t('farmerOrderHistory.assignTo'),
                    value: null,
                  }}
                  value={item.assignedTo || null}
                  disabled={!!item.assignedTo}
                  style={{
                    inputIOS: [
                      styles.picker,
                      item.assignedTo && {backgroundColor: '#eee'},
                    ],
                    inputAndroid: [
                      styles.picker,
                      item.assignedTo && {backgroundColor: '#eee'},
                    ],
                  }}
                />
              </View>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#f9f9f9'},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
    textAlign: 'center',
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#2E8B57',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  orderTotal: {
    fontSize: 16,
    marginTop: 5,
  },
  assignedTo: {
    fontSize: 16,
    marginTop: 5,
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E8B57',
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  cartItem: {
    fontSize: 14,
    marginLeft: 10,
    color: '#444',
  },
  picker: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    color: 'black',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'capitalize',
  },

  // Status-specific background colors
  status_pending: {
    backgroundColor: '#ff9800',
  },
  status_packed: {
    backgroundColor: '#2196f3',
  },
  status_outfordelivery: {
    backgroundColor: '#9c27b0',
  },
  status_completed: {
    backgroundColor: '#4caf50',
  },
});

export default FarmerOrderHistory;
