import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import {useTranslation} from 'react-i18next';

const STATUS_OPTIONS = [
  {label: 'Pending', value: 'Pending'},
  {label: 'Packed', value: 'Packed'},
  {label: 'Out for Delivery', value: 'Out for Delivery'},
  {label: 'Completed', value: 'Completed'},
];

const DeliveryManDashboard = ({navigation}) => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [deliveryManData, setDeliveryManData] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);

  const {t} = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await AsyncStorage.getItem('@profileData');
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          setDeliveryManData(parsedProfile);

          const storedOrders = await AsyncStorage.getItem('@orders');
          if (storedOrders) {
            const orders = JSON.parse(storedOrders);
            const filtered = orders.filter(
              order => order.assignedTo === parsedProfile.username,
            );
            setAssignedOrders(filtered);
          }
        }
      } catch (error) {
        console.error('Error loading delivery data:', error);
      }
    };

    fetchData();
  }, []);

  const saveOrderStatus = async (orderId, newStatus) => {
    try {
      const storedOrders = await AsyncStorage.getItem('@orders');
      const parsedOrders = JSON.parse(storedOrders);

      const updatedOrders = parsedOrders.map(order =>
        order.code === orderId ? {...order, status: newStatus} : order,
      );

      await AsyncStorage.setItem('@orders', JSON.stringify(updatedOrders));

      const updatedAssigned = updatedOrders.filter(
        order => order.assignedTo === deliveryManData.username,
      );
      setAssignedOrders(updatedAssigned);
      setShowCodeModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', t('deliveryDashboard.statusError'));
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    if (newStatus === 'Completed') {
      const order = assignedOrders.find(order => order.code === orderId);
      setCurrentOrder(order);
      setShowCodeModal(true);
    } else {
      saveOrderStatus(orderId, newStatus);
    }
  };

  const renderOrder = ({item}) => (
    <View style={styles.orderCard}>
      <Text style={styles.label}>
        {t('deliveryDashboard.orderId')}:{' '}
        <Text style={styles.value}>{item.code}</Text>
      </Text>
      <Text style={styles.label}>
        {t('deliveryDashboard.customer')}:{' '}
        <Text style={styles.value}>{item.name}</Text>
      </Text>
      <Text style={styles.label}>
        {t('deliveryDashboard.address')}:{' '}
        <Text style={styles.value}>{item.address}</Text>
      </Text>
      <Text style={styles.label}>
        {t('deliveryDashboard.paymentCode')}:{' '}
        <Text style={styles.value}>{item.paymentCode}</Text>
      </Text>
      <Text style={styles.label}>
        {t('deliveryDashboard.cartItems')}:{' '}
        <Text style={styles.value}>{item.cart.length}</Text>
      </Text>
      <Text style={styles.label}>
        {t('deliveryDashboard.createdAt')}:{' '}
        <Text style={styles.value}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </Text>
      <Text style={styles.label}>
        {t('deliveryDashboard.total')}:{' '}
        <Text style={styles.value}>${item.totalPrice}</Text>
      </Text>

      <RNPickerSelect
        onValueChange={value => updateOrderStatus(item.code, value)}
        items={STATUS_OPTIONS}
        placeholder={{label: t('deliveryDashboard.updateStatus'), value: null}}
        value={item.status}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('deliveryDashboard.welcome', {
          name: deliveryManData?.name || t('deliveryDashboard.defaultName'),
        })}
      </Text>
      <Text style={styles.subtitle}>
        {t('deliveryDashboard.assignedOrders')}
      </Text>
      <FlatList
        data={assignedOrders}
        keyExtractor={item => item.code.toString()}
        renderItem={renderOrder}
      />

      {showCodeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {t('deliveryDashboard.enterCodeTitle')}
            </Text>
            <Text style={styles.modalHint}>
              {t('deliveryDashboard.codeHint')}
            </Text>
            <TextInput
              value={enteredCode}
              onChangeText={setEnteredCode}
              keyboardType="numeric"
              maxLength={5}
              style={styles.input}
              placeholder={t('deliveryDashboard.enterCodePlaceholder')}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                if (enteredCode === currentOrder?.randomCode) {
                  saveOrderStatus(currentOrder.code, 'Completed');
                  setShowCodeModal(false);
                  setEnteredCode('');
                  setCurrentOrder(null);
                } else {
                  Alert.alert(
                    t('deliveryDashboard.incorrectCodeTitle'),
                    t('deliveryDashboard.incorrectCodeMessage'),
                  );
                }
              }}>
              <Text style={styles.buttonText}>
                {t('deliveryDashboard.confirm')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowCodeModal(false);
                setEnteredCode('');
                setCurrentOrder(null);
              }}>
              <Text style={styles.cancelText}>
                {t('deliveryDashboard.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          AsyncStorage.removeItem('@profileData');
          navigation.navigate('LoginScreen');
        }}>
        <Text style={styles.buttonText}>{t('deliveryDashboard.logout')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#f7f7f7'},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 10},
  subtitle: {fontSize: 18, marginBottom: 15},
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderLeftColor: '#4CAF50',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {fontSize: 16, fontWeight: '600'},
  value: {fontWeight: 'normal', color: '#555'},
  picker: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 10,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalHint: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 5,
  },
  cancelText: {
    color: '#f44336',
    fontWeight: '600',
  },
});

export default DeliveryManDashboard;
