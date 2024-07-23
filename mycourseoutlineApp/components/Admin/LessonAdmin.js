import { Button, Card, Chip, Divider, List, Avatar, Appbar, Menu, Provider } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { useContext, useEffect, useState } from "react";
import moment from 'moment';
import 'moment/locale/vi';
import { SearchBar } from "react-native-elements";
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image, Platform, RefreshControl } from "react-native";
import { MyUserContext } from "../../configs/Context";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";


const Lesson = ({navigation, route}) => {
    const [categories, setCategories] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cateId, setCateId] = useState("");
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
    const [visibleMenus, setVisibleMenus] = useState({});
    const user = useContext(MyUserContext);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const openMenu = (index) => {
        setVisibleMenus({ ...visibleMenus, [index]: true });
    };

    const closeMenu = (index) => {
        setVisibleMenus({ ...visibleMenus, [index]: false })
    };

    const loadCates = async () => {
        try {
            let res = await APIs.get(endpoints['categories']);
            setCategories(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }


    const loadLesson = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endpoints['lessons']}?q=${q}&category_id=${cateId}&page=${page}`;
                
                let res = await APIs.get(url);
                if (res.data.next === null)
                    setPage(0);
    
                if (page === 1)
                    setLessons(res.data.results);
                else
                    setLessons(current => {
                        return [...current, ...res.data.results];
                    });                
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            let url = `${endpoints['lessons']}?q=${q}&category_id=${cateId}&page=${page}`;
            
            let res = await APIs.get(url);
            if (res.data.next === null)
                setPage(0);

            if (page === 1)
                setLessons(res.data.results);
            else
                setLessons(current => {
                    return [...current, ...res.data.results];
                });
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    };

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
    };

    const loadMore = ({nativeEvent}) => {
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
                setPage(page + 1);
        }
    }

    const deleteLesson = async (lessonId) => {
        setLoading(true);
        try{
            const token = await AsyncStorage.getItem("token");
        if (!token) {
            Alert.alert("Error", "No access token found.");
            return;
        }
        const res = await authApi(token).delete(endpoints['lesson-delete'](lessonId));
        if(res.status === 204){
            Alert.alert("Thông báo", "Đã xóa môn học thành công")
        }else if(res.status === 404){
            Alert.alert("Thông báo", "Không tìm thấy môn học")
        }
        }catch (err) {
            console.error('Response error:' + err)
            Alert.alert("Thông báo", "Xóa bình luận bị lỗi")
        }finally{
            setLoading(false)

        }
    }

    useEffect(() => {
        loadCates();
    }, []);

    useEffect(() => {
        loadLesson();
    }, [q, page, cateId]);

    const search = (value, callback) => {
        setPage(1);
        setSelectedCategoryId(value);
        callback(value);
    }
    return (
        <Provider>
            <View style={MyStyle.container}>
                <View style={[MyStyle.row, MyStyle.wrap]}>
                    <Chip mode={!cateId?"flat":"outlined"} onPress={() => search("", setCateId)} style={MyStyle.margin} icon="shape-plus">Tất cả</Chip>
                    {categories===null?<ActivityIndicator/>:<>
                        {categories.map(c => 
                            <Chip mode={c.id===cateId?"flat":"outlined"} key={c.id} onPress={() => search(c.id, setCateId)} style={MyStyle.margin} icon="shape-plus">{c.name}</Chip>
                            )}
                    </>}
                </View>
                <View style={MyStyle.grid}>
                    <SearchBar placeholder="Nhập từ khóa..." onChangeText={(t) => search(t, setQ)} value={q}
                            containerStyle={MyStyle.searchLessonContainer}
                            inputContainerStyle={MyStyle.inputContainer}
                            inputStyle={MyStyle.input} />
                    <View style={MyStyle.gridItem}>
                        <TouchableOpacity onPress={() => {navigation.navigate('CreateLesson')}} >
                            <FontAwesome name='plus'  size={23} color="#5f9ea0" />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={MyStyle.title}>DANH SÁCH MÔN HỌC</Text>
                <ScrollView onScroll={loadMore} refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }>
                    {loading && <ActivityIndicator/>}
                    {lessons.map((l, index) => 
                    <TouchableOpacity key={l.id}>
                        <List.Item 
                            title={l.subject} 
                            description={l.created_date?moment(l.created_date).fromNow('MMMM Do, YYYY'):""}
                            right={()=>
                                <Menu
                                    visible={visibleMenus[index]}
                                    onDismiss={() => closeMenu(index)}
                                    anchor={
                                        <Appbar.Action 
                                            icon={MORE_ICON}
                                            onPress={() => openMenu(index)} 
                                        />
                                    }>
                                    <Menu.Item onPress={() => deleteLesson(l.id)}
                                        title="Xóa Môn Học" 
                                        leadingIcon="delete"
                                    />
                                </Menu>
                            }
                        />
                    </TouchableOpacity>)}
                </ScrollView>
            </View>
        </Provider>
    );
};
export default Lesson;