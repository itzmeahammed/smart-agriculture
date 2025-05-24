import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const getStatusStyle = status => {
  switch (status) {
    case 'Completed':
      return {backgroundColor: '#4CAF50'};
    case 'Out for Delivery':
      return {backgroundColor: '#2196F3'};
    case 'Packed':
      return {backgroundColor: '#FFC107'};
    case 'Pending':
    default:
      return {backgroundColor: '#FF5722'};
  }
};

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const {t} = useTranslation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const profileData = await AsyncStorage.getItem('@profileData');
        const storedOrders = await AsyncStorage.getItem('@orders');

        if (profileData && storedOrders) {
          const profile = JSON.parse(profileData);
          const orders = JSON.parse(storedOrders);

          const userOrders = orders.filter(
            order => order.username === profile.username,
          );

          setOrderHistory(userOrders);
        }
      } catch (error) {
        console.error('Error retrieving order history:', error);
      }
    };

    fetchOrders();
  }, []);

  const renderProducts = cart => {
    return cart.map((product, index) => (
      <View key={index} style={styles.productItem}>
        <Text style={styles.productText}>
          • {product.name} x{product.quantity}
        </Text>
      </View>
    ));
  };

  const renderOrder = ({item}) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{item.code}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>
            {t(
              `orderHistory.status.${item.status
                .toLowerCase()
                .replace(/\s/g, '')}`,
            )}
          </Text>
        </View>
      </View>
      <Text style={styles.orderLabel}>
        {t('orderHistory.totalAmount')}: ${item.totalPrice}
      </Text>
      <Text style={styles.orderLabel}>
        {t('orderHistory.orderedOn')}:{' '}
        {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.sectionTitle}>{t('orderHistory.products')}</Text>
      {renderProducts(item.cart)}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('orderHistory.title')}</Text>
      <FlatList
        data={orderHistory}
        renderItem={renderOrder}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t('orderHistory.noOrders')}</Text>
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  orderLabel: {
    fontSize: 15,
    color: '#555',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  productItem: {
    paddingLeft: 10,
  },
  productText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 3,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#888',
  },
});

export default OrderHistory;
