import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons'; // React Native Vector Icons

const FarmerDashboard = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const {t} = useTranslation();

  const fecth = true;

  const loadFarmerData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@profileData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUsername(parsedData.username); // Display correct username
        setEmail(parsedData.email); // Display correct email
      }

      // Load farmer's products
      const storedProducts = await AsyncStorage.getItem('@products');
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Could not load farmer data.');
    }
  };

  useEffect(() => {
    loadFarmerData(); // Initial data load
    const interval = setInterval(() => {
      loadFarmerData(); // Periodic data load every 5 seconds
    }, 5000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [navigation]);

  const handleEditProduct = product => {
    setEditedProduct(product);
    setModalVisible(true);
  };

  const handleDeleteProduct = async productId => {
    try {
      const filteredProducts = products.filter(item => item.id !== productId);
      await AsyncStorage.setItem('@products', JSON.stringify(filteredProducts));
      setProducts(filteredProducts);
      Alert.alert(t('alerts.success'), t('alerts.productDeleted'));
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.alert('Error', 'Could not delete the product.');
    }
  };

  const handleSaveProduct = async () => {
    try {
      const updatedProducts = products.map(item =>
        item.id === editedProduct.id ? editedProduct : item,
      );
      await AsyncStorage.setItem('@products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts); // Update state with edited product
      setModalVisible(false);
      Alert.alert('Success', 'Product updated successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'Could not save the product.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('farmerDashboard.title')}</Text>

      <View style={styles.profileCard}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/206/206865.png',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileTitle}>{t('farmerDashboard.profile')}</Text>
        <Text style={styles.profileText}>
          {t('common.username')}: {username}
        </Text>
        <Text style={styles.profileText}>
          {t('common.email')}: {email}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddProductScreen')}>
        <Text style={styles.buttonText}>{t('farmerDashboard.addProduct')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FarmerOrderHistory')}>
        <Text style={styles.buttonText}>
          {t('farmerDashboard.orderHistory')}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>{t('farmerDashboard.productList')}</Text>
      {products.length === 0 ? (
        <Text style={styles.noProductsText}>
          {t('farmerDashboard.noProducts')}
        </Text>
      ) : (
        <FlatList
          data={products}
          numColumns={2} // Grid layout with 2 columns
          renderItem={({item}) => (
            <View style={styles.productCard}>
              <Image source={{uri: item.image}} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEditProduct(item)}>
                    <Image
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/5996/5996708.png',
                      }}
                      style={styles.icon}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteProduct(item.id)}>
                    <Image
                      source={{
                        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj8xhwHfb-jxT03ZbJH7ykHj-REwanbHEoRg&s',
                      }}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}

      {/* Modal for editing product */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('farmerDashboard.editProduct')}
            </Text>
            <TextInput
              style={styles.input}
              value={editedProduct?.name}
              onChangeText={text =>
                setEditedProduct({...editedProduct, name: text})
              }
              placeholder={t('placeholders.productName')}
            />
            <TextInput
              style={styles.input}
              value={editedProduct?.description}
              onChangeText={text =>
                setEditedProduct({...editedProduct, description: text})
              }
              placeholder={t('placeholders.productDescription')}
            />
            <TextInput
              style={styles.input}
              value={editedProduct?.price}
              onChangeText={text =>
                setEditedProduct({...editedProduct, price: text})
              }
              placeholder={t('placeholders.productPrice')}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveProduct}>
              <Text style={styles.buttonText}>{t('common.save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileText: {
    fontSize: 16,
    color: '#555',
  },
  icon: {
    width: 24,
    height: 24,
    margin: 10,
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    marginBottom: 10,
  },
  noProductsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    maxWidth: '50%',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
});

export default FarmerDashboard;
