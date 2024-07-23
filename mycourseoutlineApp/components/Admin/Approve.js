import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import styleAdmin from './styleAdmin';
import APIs, { endpoints } from '../../configs/APIs';
import { ActivityIndicator, Button } from 'react-native-paper';
import MyStyle from '../../styles/MyStyle';
import { Image } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

const Approve = () => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const submitRequest = async () => {
        if (!first_name || !last_name ||!code) {
            Alert.alert('Lỗi', 'Vui lòng cung cấp đủ thông tin');
            return;
        }
        setLoading(true)

        try {
            const response = await APIs.post(endpoints['approve-student'], {
                first_name: first_name,
                last_name: last_name,
                code: code
            });

            Alert.alert('Thành Công', 'Gửi yêu cầu thành công');
            setFirstName('');
            setLastName('');
            setCode('');
        } catch (error) {
            console.error('Error sending request:', error);
            if (error.response && error.response.status === 400) {
                Alert.alert('Yêu cầu đang được xử lý, vui lòng chờ!');
            } else {
                Alert.alert('Lỗi', 'Mã sinh viên không tồn tại');
            }
        }finally {
            setLoading(false); 
        }
    
    };

    if (loading) {
        return (
            <View style={styleAdmin.loadingContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ImageBackground style={[MyStyle.container, MyStyle.margin]} source={require('./images/123.jpg')} >
            <View style={[{marginTop: 20, alignItems: 'center', justifyContent: 'center', }]}>
            <Image source={require('./images/2.png')} style={styleAdmin.logo} />
            </View>
            <View style={styleAdmin.fieldContainerCO}>
                <View style={styleAdmin.inputContainer123}>
                    <TextInput
                        style={styleAdmin.input}
                        value={first_name}
                        onChangeText={setFirstName}
                        placeholder="Họ sinh viên"
                        placeholderTextColor="#666"
                    />
                </View>
                <View style={styleAdmin.inputContainer123}>
                <TextInput
                    style={styleAdmin.input}
                    value={last_name}
                    onChangeText={setLastName}
                    placeholder="Tên sinh viên"
                    placeholderTextColor="#666"
                />
                </View>
                <View style={styleAdmin.inputContainer123}>
                <TextInput
                    style={[styleAdmin.input]}
                    value={code}
                    onChangeText={setCode}
                    placeholder="Mã số sinh viên"
                    placeholderTextColor="#666"
                />
                </View>
            </View>
            <Button style={MyStyle.margin} loading={loading} icon="account" mode="contained" onPress={submitRequest} >Gửi yêu cầu</Button>
                
        </ImageBackground>
    );
};

export default Approve;