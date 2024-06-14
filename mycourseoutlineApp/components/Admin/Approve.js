import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styleAdmin from './styleAdmin';
import APIs, { endpoints } from '../../configs/APIs';
import { Button } from 'react-native-paper';
import MyStyle from '../../styles/MyStyle';

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
            setLoading(false); }
    
    };

    return (
        <View style={[MyStyle.container, MyStyle.margin]} >
            <TextInput
                style={styleAdmin.input}
                value={first_name}
                onChangeText={setFirstName}
                placeholder="Họ sinh viên"
                placeholderTextColor="#666"
            />
            <TextInput
                style={styleAdmin.input}
                value={last_name}
                onChangeText={setLastName}
                placeholder="Tên sinh viên"
                placeholderTextColor="#666"
            />
            <TextInput
                style={[styleAdmin.input]}
                value={code}
                onChangeText={setCode}
                placeholder="Mã số sinh viên"
                placeholderTextColor="#666"
            />
            <Button style={MyStyle.margin} loading={loading} icon="account" mode="contained" onPress={submitRequest} >Gửi yêu cầu</Button>
                
        </View>
    );
};

export default Approve;