import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const AddProductScreen = ({navigation}) => {
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);

  const {t} = useTranslation();

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorMessage) {
        console.error(response.errorMessage);
      } else {
        setProductImage(response.assets[0]);
      }
    });
  };

  const handleAddProduct = async () => {
    if (
      !productName ||
      !productQuantity ||
      !productPrice ||
      !productDescription ||
      !productImage
    ) {
      Alert.alert(t('addProduct.errorTitle'), t('addProduct.fillAllFields'));
      return;
    }

    const productId = `product_${Math.floor(Math.random() * 1000000)}`;

    const newProduct = {
      id: productId,
      name: productName,
      quantity: productQuantity,
      price: productPrice,
      description: productDescription,
      image: productImage.uri,
    };

    try {
      const storedProducts = await AsyncStorage.getItem('@products');
      let products = storedProducts ? JSON.parse(storedProducts) : [];

      products.push(newProduct);

      await AsyncStorage.setItem('@products', JSON.stringify(products));

      Alert.alert(t('addProduct.successTitle'), t('addProduct.successMessage'));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving product', error);
      Alert.alert(t('addProduct.errorTitle'), t('addProduct.saveError'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('addProduct.title')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('addProduct.namePlaceholder')}
        placeholderTextColor="#888"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder={t('addProduct.quantityPlaceholder')}
        placeholderTextColor="#888"
        value={productQuantity}
        keyboardType="numeric"
        onChangeText={setProductQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder={t('addProduct.pricePlaceholder')}
        placeholderTextColor="#888"
        value={productPrice}
        keyboardType="numeric"
        onChangeText={setProductPrice}
      />
      <TextInput
        style={styles.input}
        placeholder={t('addProduct.descriptionPlaceholder')}
        placeholderTextColor="#888"
        value={productDescription}
        onChangeText={setProductDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <Text style={styles.buttonText}>{t('addProduct.pickImage')}</Text>
      </TouchableOpacity>

      {productImage && (
        <Image source={{uri: productImage.uri}} style={styles.productImage} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>{t('addProduct.addButton')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E8B57',
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
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    backgroundColor: '#f4f4f4',
  },
});

export default AddProductScreen;
