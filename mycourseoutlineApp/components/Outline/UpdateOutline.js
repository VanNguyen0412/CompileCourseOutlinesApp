import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UpdateOutline = ({ route }) => {
  const [formData, setFormData] = useState({
    name: '',
    credit: '',
    overview: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const nav = useNavigation();
  const { outlineId } = route.params;

  useEffect(() => {
    const loadOutlineDetails = async () => {
      try {
        const res = await APIs.get(endpoints['outline-details'](outlineId));
        setFormData({
          name: res.data.name,
          credit: res.data.credit,
          overview: res.data.overview,
        });
      } catch (err) {
        Alert.alert("Error", "Failed to load outline details.");
      } finally {
        setLoadingData(false);
      }
    };
    loadOutlineDetails();
  }, [outlineId]);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updateOutline = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found.");
        return;
      }
      const response = await authApi(token).patch(
        endpoints['outline-update'](outlineId),
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Outline updated successfully.");
        nav.navigate("Outline");
      } else if (response.status === 403) {
        Alert.alert("Error", "Only lecturers can update outlines.");
      } else {
        Alert.alert("Error", "Failed to update outline.");
      }
    } catch (ex) {
      Alert.alert("Error", "Network request failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.containerCO}>
      <Animatable.Text animation="fadeInDown" style={styles.headerCO}>
        Chỉnh Sửa Đề Cương
      </Animatable.Text>
      <Text style={styles.headerName}>{formData.name}</Text>
      <View style={styles.fieldContainerCO}>
        <Text style={styles.labelCO}>Tên đề cương</Text>
        <TextInput
          style={styles.inputCO}
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
          placeholder="Nhập tên đề cương"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.fieldContainerCO}>
        <Text style={styles.labelCO}>Số tín chỉ</Text>
        <TextInput
          style={styles.inputCO}
          value={formData.credit}
          onChangeText={(value) => handleInputChange('credit', value)}
          placeholder="Nhập số tín chỉ"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.fieldContainerCO}>
        <Text style={styles.labelCO}>Mô tả</Text>
        <TextInput
          style={[styles.inputCO, styles.textAreaCO]}
          value={formData.overview}
          onChangeText={(value) => handleInputChange('overview', value)}
          placeholder="Nhập mô tả"
          placeholderTextColor="#999"
          multiline={true}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          style={styles.saveButtonCO}
          onPress={updateOutline}
          disabled={loading}
        >
          <Text style={styles.saveButtonTextCO}>Lưu</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default UpdateOutline;
