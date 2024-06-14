import { View, Text, Alert } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, Provider, TextInput  } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import styles from "../Outline/styles";
import style from "./style";

const CreateLesson = () => {
    const user = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const nav = useNavigation();
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);

    const fields = [{
        label: "Tên môn học",
        icon: "book-open-page-variant-outline",
        field: "subject"
        }];

    const loadCates = async () => {
        try {
            let res = await APIs.get(endpoints['categories']);
            const formattedCategories = res.data.map(cate => ({ label: cate.name, value: cate.id }));
            setCategories(formattedCategories);
        } catch (ex) {
            console.error(ex);
        }
    }

    
    const lesson = async (subject, category) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            // Dữ liệu lesson mới
            const lessonData = {
                subject: subject,
                category: category
            };
            // Gửi yêu cầu POST để tạo lesson mới
            const response = await authApi(token).post(endpoints['lesson-create'], lessonData);

            // Kiểm tra phản hồi từ server
            if (response.status === 201) {
                console.info("Lesson created successfully:", response.data);
                Alert.alert("Success", "Lesson created successfully.");
                setSubject('');
                setCategory(null);
            } else if (response.status === 403) {
                console.error("Error: Only lecturers can create lessons.");
                Alert.alert("Error: Only lecturers can create lessons.");
            } else {
                console.error("Error creating lesson:", response.errorData);
                Alert.alert("Error", "Error creating lesson");
            }
        }catch(ex){
            Alert.alert("Error", "Network request failed. Please check your connection.");
            console.error(ex);
            nav.navigate("Lesson");
        }finally{
            setLoading(false);
        }
    }

    const addLesson = () => {
        lesson(subject, category);
    };

    useEffect(() => {
        loadCates();
    }, []);

    return (
        <Provider>
            <View style={styles.container} >
                <Text style={[styles.text, MyStyle.margin]}>Thêm Môn Học Mới</Text>
                {fields.map(f => (
                        <TextInput 
                            key={f.field} 
                            style={[MyStyle.input]} 
                            label={f.label} 
                            value={f.field === 'subject' ? subject : category}
                            onChangeText={f.field === 'subject' ? setSubject : setCategory} 
                            right={<TextInput.Icon icon={f.icon} />} 
                        />
                    ))
                }

                <DropDownPicker
                    style={MyStyle.dropdownContainer}
                    open={open}
                    value={category}
                    items={categories}
                    setOpen={setOpen}
                    setValue={setCategory}
                    setItems={setCategories}
                    placeholder="Chọn danh mục"
                    containerStyle={{ marginVertical: 10 }}
                />
                <Button 
                    loading={loading}  
                    icon="pen-plus" 
                    mode="contained" 
                    onPress={addLesson}
                    style={MyStyle.button}
                    >Thêm</Button>
            </View>
            
        </Provider>
    );
}

export default CreateLesson;