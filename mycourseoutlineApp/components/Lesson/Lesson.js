import { Button, Card, Chip, Divider, List, Avatar, Appbar, Menu, Provider } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import APIs, { endpoints } from "../../configs/APIs";
import { useContext, useEffect, useState } from "react";
import moment from 'moment';
import 'moment/locale/vi';
import { SearchBar } from "react-native-elements";


import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image, Platform, RefreshControl } from "react-native";
import { MyUserContext } from "../../configs/Context";


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
    const userRole = user?.account.role;
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
                <View >
                    <View style={MyStyle.grid}>
                        <View style={MyStyle.gridItem}>
                            <TouchableOpacity onPress={() => search("", setCateId)} style={MyStyle.imageContainer}>
                                <Image style={MyStyle.image}  source={require('./images/category.jpg')} />
                                
                                <View style={MyStyle.overlay}>
                                    <Text style={[ MyStyle.name, selectedCategoryId === "" && MyStyle.selectedText]}>Tất cả</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {categories===null?<ActivityIndicator/>:<>
                            {categories.map(c => <View style={MyStyle.gridItem} key={c.id}>
                                <TouchableOpacity onPress={() => search(c.id, setCateId)} style={MyStyle.imageContainer}>
                                    <Image  style={MyStyle.image}
                                    source={require('./images/category.jpg')} />
                                    <View style={MyStyle.overlay}>
                                        <Text style={[MyStyle.name, selectedCategoryId === c.id && MyStyle.selectedText]}>{c.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>)}      
                        </>}

                        {userRole === 'lecturer'?(
                            <View style={MyStyle.gridItem}>
                                <TouchableOpacity onPress={() => {navigation.navigate('CreateLesson')}} style={MyStyle.imageContainer}>
                                    <Image style={MyStyle.image}  source={require('./images/category.jpg')} />
                                    <View style={MyStyle.overlay}>
                                        <Text style={ MyStyle.name}>Thêm</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ): null}
                        
                    </View>
                </View>
                <View >
                    <SearchBar placeholder="Nhập từ khóa..." onChangeText={(t) => search(t, setQ)} value={q}
                                containerStyle={MyStyle.searchContainer}
                                inputContainerStyle={MyStyle.inputContainer}
                                inputStyle={MyStyle.input}
                    />
                </View>

                
                <ScrollView onScroll={loadMore} refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
                    {loading && <ActivityIndicator/>}
                    {lessons.map((l, index) => 
                    <TouchableOpacity key={l.id}  
                        onPress={() => { navigation.navigate('LessonDetail', {'lessonId': l.id})}} >
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
                                    <Menu.Item onPress={() => { navigation.navigate('LessonDetail', {'lessonId': l.id})} } 
                                        title="View Details" 
                                        leadingIcon="information-outline"
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
