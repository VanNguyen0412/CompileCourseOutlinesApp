import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Icon, Image } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import { MyDispatchContext, MyUserContext } from '../../configs/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UpdateInfo = () => {
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);

    // console.info(user);

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

    const handleUpdate = async (userId) => {
        if (!password || !avatar) {
            Alert.alert('Error', 'Please provide both a new password and an avatar.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }

        const formData = new FormData();
        formData.append('password', password);
        formData.append('avatar', {
            uri: avatar.uri,
            type: 'image/jpeg',
            name: 'avatar.jpg',
        });
        try {
            
            const res = await APIs.patch(endpoints['update-info'](userId), formData,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.info(res.data)
            if(res.status===200){
            Alert.alert('Success', 'Thông tin của bạn đã được cập nhập.');
            dispatch({type: "logout"})
            }else{
                Alert.alert("Error", 'Đã gặp lỗi')
            }
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'Failed to update information. Please try again.');
        }
    };

    return (
        <View style={styleUpdate.containerCO}>
            <View >
                <Text style={styleUpdate.headerCO}>CẬP NHẬP TÀI KHOẢN {user.username}</Text>
            </View>
            <View style={styleUpdate.fieldContainerCO}>
                <Text style={styleUpdate.labelCO}>Mật Khẩu</Text>
                <View style={styleUpdate.inputContainerCO}>
                    <TextInput
                        style={styleUpdate.inputCO}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Nhập Mật Khẩu"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <FontAwesome name={showPassword ? 'eye-slash' : 'eye'}  size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styleUpdate.fieldContainerCO}>
                <Text style={styleUpdate.labelCO}>Xác nhận mật khẩu</Text>
                <View style={styleUpdate.inputContainerCO}>
                    <TextInput
                        style={styleUpdate.inputCO}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Nhập Lại Mật Khẩu"
                        placeholderTextColor="#999"
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <FontAwesome name={showConfirmPassword ? 'eye-slash' : 'eye'}  size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={pickImage} style={{alignSelf: "center"}}>
                <Text style={styleUpdate.text}>{avatar===null ? "Chọn Avatar": "Chọn Lại Avatar"}</Text>
            </TouchableOpacity>
            {avatar && <Image source={{ uri: avatar.uri }} style={styleUpdate.avatar} />}
            
            <Button
                buttonStyle={styleUpdate.button}
                title='Cập Nhập'
                onPress={() => handleUpdate(user.account.id)}
                />
        </View>
    );
};

const styleUpdate = StyleSheet.create({
    containerCO: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    headerCO: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
        textTransform: 'uppercase',

    },
    fieldContainerCO: {
        marginBottom: 15,
    },
    labelCO: {
        fontSize: 16,
        marginBottom: 5,
        color: '#666',
    },
    inputContainerCO: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
    },
    inputCO: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    avatar: {
        width: 150,
        height: 150,
        // alignItems: "center",
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 100,
    },
    button: {
        backgroundColor: 'rgb(120, 69, 172)',
        // color:"#ffffff",
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        marginTop: 20,
    },
    text: {
        color:"#800080",
        fontWeight:"500",

    }
});
export default UpdateInfo;
