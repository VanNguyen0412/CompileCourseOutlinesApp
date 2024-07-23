import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, Image, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TouchableRipple } from "react-native-paper";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import styles from "./styles";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const Register = () => { 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const change = (value, field) => {
        setUser(current => {
            return {...current, [field]: value}
        })
    }
    const nav = useNavigation()

    const fields = [{
        label: "Tên người dùng",
        icon: "align-left",
        field: "username"
    },{
        label: "Họ và tên lót",
        icon: "align-left",
        field: "first_name"
    },{
        label: "Tên",
        icon: "align-left",
        field: "last_name"
    },{
        label: "Email",
        icon: "envelope",
        field: "email"
    },{
        label: "Mã Giảng Viên",
        icon: "user",
        field: "code"
    }];

    const picker = async () =>{
        let {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("ĐĂNG KÝ", "Không tải được ảnh!");
        else {
            let res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!res.canceled)
                change(res.assets[0], 'avatar');
        }
    };

    const register = async () => {
        if (!user.avatar) {
            Alert.alert("ĐĂNG KÝ", "Vui lòng chọn ảnh đại diện");
            return;

        }

        if(password !== confirmPassword){
            Alert.alert("ĐĂNG KÝ", "Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);

        try{       
            const fromData = new FormData();
            fromData.append('username', user.username);
            fromData.append('first_name', user.first_name);
            fromData.append('last_name', user.last_name);
            fromData.append('email', user.email);
            fromData.append('code', user.code);
            fromData.append('password', password);
            fromData.append('avatar', {
                uri: user.avatar.uri,
                type: 'image/jpeg',  // or appropriate type
                name: 'avatar.jpg'
            });
            const response = await APIs.post(endpoints['account-lecturer'], fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status === 201){
                Alert.alert("ĐĂNG KÝ", "Đăng ký thành công, chờ xét duyệt");
                nav.navigate("Đăng nhập");
            }
        } catch (error) {
            if (error.response){
                console.error("Error response:", error.response);
                Alert.alert("ĐĂNG KÝ","Mã code hoặc Email không chính xác!");
            }else {
                console.error("Network error", error);
                Alert.alert("ĐĂNG KÝ", "Có lỗi xảy ra, vui lòng thử lại sau")
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground style={[MyStyle.container, MyStyle.margin]}
        source={require('./images/1.jpg')} >
            <ScrollView>
                <View style={[{marginTop: 20, alignItems: 'center', justifyContent: 'center', }]}>
                    <Image source={require('./images/2.png')} style={MyStyle.logo} />
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    
                    {fields.map(f => 
                    <View style={styles.fieldContainerCO}>
                        <View style={styles.inputContainerCO}>
                            <TextInput value={user[f.field]} 
                                    onChangeText={t => change(t, f.field)} 
                                    key={f.field} 
                                    style={styles.inputCO} 
                                    placeholder={f.label}
                                    placeholderTextColor="#999"
                                    secureTextEntry={f.secureTextEntry} 
                                    />
                                    <FontAwesome name={f.icon}  size={23} color="black" />
                        </View>
                    </View>
                    )}
                    <View style={styles.fieldContainerCO}>
                        <View style={styles.inputContainerCO}>
                            <TextInput
                                style={styles.inputCO}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Nhập Mật Khẩu"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <FontAwesome name={showPassword ? 'eye-slash' : 'eye'}  size={23} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.fieldContainerCO}>
                        <View style={styles.inputContainerCO}>
                            <TextInput
                                style={styles.inputCO}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Nhập Lại Mật Khẩu"
                                placeholderTextColor="#999"
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <FontAwesome name={showConfirmPassword ? 'eye-slash' : 'eye'}  size={23} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableRipple onPress={picker}>
                        <Text style={[MyStyle.margin, { color: 'blue' }]}>Chọn ảnh đại diện</Text>
                    </TouchableRipple>

                    {user.avatar && <Image source={{uri:user.avatar.uri}} style={MyStyle.avatar} />}

                    <Button 
                        icon="account" 
                        mode="contained" 
                        onPress={register} 
                        loading={loading} 
                        disabled={loading} 
                        style={MyStyle.margin}>
                            ĐĂNG KÝ
                    </Button>
                        
                </KeyboardAvoidingView>
            </ScrollView>
        </ImageBackground>
    )
}

export default Register;