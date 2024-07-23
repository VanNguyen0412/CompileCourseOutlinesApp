import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const HomeScreen = () => {
  const nav = useNavigation();
  return (
    <ImageBackground style={styles.container} source={require('./images/1.jpg')}>
      <Image source={require('./images/2.png')} style={styles.logo} />
      <Text style={styles.title}>Biên Soạn Đề Cương</Text>
      <Text style={styles.subtitle}>Ứng dụng quản lý và biên soạn đề cương</Text>
      <Text style={styles.description}>
          Ứng dụng là công cụ hiện đại và tiện ích giúp giáo viên và học sinh dễ dàng tổ chức và 
          quản lý các kế hoạch học tập của mình, giúp tối ưu hóa quy trình dạy và 
          học.</Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => nav.navigate('Đăng nhập')}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.activateButton} onPress={() => nav.navigate('Register')}>
          <Text style={styles.activateButtonText}>Sinh Viên Đăng Ký Tài Khoản</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text>Email: <Text style={styles.hotlineText}>yanghara2611@gmail.com</Text></Text>
        <Text>By: <Text style={styles.hotlineText}>yanghara</Text></Text>
      </View>
      <View style={styles.footer}>
        <Text>Chính sách quyền riêng tư</Text>
        <Text>Phiên bản 2.1.7</Text>
      </View>
      
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 16,
  },
  title: {
    fontSize: 33,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#808080',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#b80000',
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  activateButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 16,
  },
  activateButtonText: {
    color: '#b80000',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    // paddingHorizontal: 16,
    marginTop: 16,
  },
  registerText: {
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  hotlineText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
    width: 80,
    alignItems: "center",
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
