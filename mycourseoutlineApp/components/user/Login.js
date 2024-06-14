import { View, Text, TouchableOpacity, Alert } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext } from "../../configs/Context";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    
    const fields = [{
    label: "Tên đăng nhập",
    icon: "account",
    field: "username"
    }, {
    label: "Mật khẩu",
    icon: "eye",
    field: "password",
    secureTextEntry: true
    }];
    
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);

    const change = (value, field) => {
        setUser(current => {
            return {...current, [field]: value}
        })
    }

    const login = async () => {
        setLoading(true);
        try {
            let res = await APIs.post(endpoints['login'], {
                ...user, 
                'client_id': 'D3Tks2a5A3RdqoAssHWpMFv2AEBA8Fm5HQv2WIkf',
                'client_secret': 'PMwTczu8fMsZ7g2fqaXbYtBbXXZGcrRmisIuO0UuBTbAU75pyCGxNE0IeRhrfs8PvrWd8v57q3MAeuPOWqNaz8w7aOxbvqKdDGtX12MiUoWaYAChzkO2hTpD265ipVNe',
                'grant_type': 'password'
            });
            await AsyncStorage.setItem("token", res.data.access_token);
            console.info(res.data.access_token)
            setTimeout(async () => {
                let user = await authApi(res.data.access_token).get(endpoints['current-account']);
                console.info(user.data);

                dispatch({
                    "type": "login",
                    "payload": user.data
                })

                // nav.navigate("Môn học");
            }, 100);
        } catch (ex) {
            console.error(
                "Error response:",
                ex.response ? ex.response.data : ex.message
            );
              Alert.alert("Cảnh báo", "Tên đăng nhập hoặc mật khẩu không hợp lệ!!!", [
                {
                  text: "OK",
                  onPress: () => {},
                },
              ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[MyStyle.container, MyStyle.margin]}>
            {fields.map(f => 
                <TextInput 
                    value={user[f.field]} 
                    onChangeText={t => change(t, f.field)} 
                    key={f.field} style={MyStyle.margin} 
                    label={f.label} 
                    secureTextEntry={f.secureTextEntry} 
                    right={<TextInput.Icon icon={f.icon} />} />)}
                    
                <TouchableOpacity  onPress={() => nav.navigate("Đăng ký")}>
                    <Text style={[MyStyle.hihi]}>Chưa có tài khoản, hãy đăng ký!!!</Text>
                </TouchableOpacity>
                <Button style={MyStyle.margin} loading={loading} icon="account" mode="contained" onPress={login} >ĐĂNG NHẬP</Button>
        </View>
    );
}
export default Login;