import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import styleAdmin from '../Admin/styleAdmin';
import { Button, Icon } from 'react-native-paper';
import styles from '../Outline/styles';
import { MyDispatchContext } from '../../configs/Context';
import MyStyle from '../../styles/MyStyle';
import { Image } from 'react-native-elements';

const UpdateInfo = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("Outline Course App", "Permissions Denied!");
        else {
            let res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!res.canceled) {
                setAvatar(res.assets[0]);
            }
        }
    };

    const handleUpdate = async () => {
        if (!password || !avatar) {
            Alert.alert('Error', 'Please provide both a new password and an avatar.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const formData = new FormData();
        formData.append('password', password);
        formData.append('avatar', {
            uri: avatar,
            type: 'image/jpeg',
            name: 'avatar.jpg',
        });

        try {
            await axios.patch('API_UPDATE_ENDPOINT', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert('Success', 'Your information has been updated successfully.');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'Failed to update information. Please try again.');
        }
    };

    return (
        <View style={styles.containerCO}>
            <View >
                <Text style={styles.headerCO}>CẬP NHẬP TÀI KHOẢN</Text>
            </View>
            <View style={styles.fieldContainerCO}>
                <Text style={styles.labelCO}>Mật Khẩu</Text>
                <TextInput
                    style={styles.inputCO}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Nhập Mật Khẩu"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    secureTextEntry={!showPassword}
                    right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} size={20} color="#999" />}
                />
            </View>
            <View style={styles.fieldContainerCO}>
                <Text style={styles.labelCO}>Xác nhận mật khẩu</Text>
                <TextInput
                    style={styles.inputCO}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    secureTextEntry={!showPassword}
                />
            </View>
            <Button onPress={pickImage}>Chọn Avatar</Button>
            {avatar && <Image source={{ uri: avatar.uri }} style={{ width: 200, height: 200 }} />}
            <Button onPress={handleUpdate} style={styleAdmin.button}>Cập Nhập</Button>
        </View>
    );
};

export default UpdateInfo;
