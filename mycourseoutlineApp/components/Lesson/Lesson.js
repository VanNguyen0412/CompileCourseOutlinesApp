import {List, Appbar, Menu, Provider, Title, Paragraph, SegmentedButtons } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { useContext, useEffect, useState, useRef } from "react";
import moment from 'moment';
import 'moment/locale/vi';
import { SearchBar } from "react-native-elements";
import { View, Text, ActivityIndicator, ScrollView, 
    TouchableOpacity, Image, Platform, RefreshControl, Dimensions, Animated, Alert} from "react-native";
import { MyUserContext } from "../../configs/Context";
import { FontAwesome } from "@expo/vector-icons";
import { Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Lesson = ({navigation}) => {
    const [lessons, setLessons] = useState([]);
    const [hasOutline, setHasOutline] = useState([]);
    const [withoutOutline, setWithoutOutline] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
    const [visibleMenus, setVisibleMenus] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [details, setLessonDetails] = useState(null);
    const [outlines, setOutlines] = useState([]);
    const user = useContext(MyUserContext);
    const [value, setValue] = useState('no');

    // console.info(user.account.role)

    const openMenu = (index) => {
        setVisibleMenus({ ...visibleMenus, [index]: true });
    };

    const closeMenu = (index) => {
        setVisibleMenus({ ...visibleMenus, [index]: false })
    };

    const loadLessonHasOutline = async () => {
        setLoading(true);
        try {
            let res = await APIs.get(endpoints['lesson-hasoutline']);
            setHasOutline(res.data);   
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const loadLessonNoOutline = async () => {
        setLoading(true);
        try {
            let res = await APIs.get(endpoints['lesson-nooutline']);
            setWithoutOutline(res.data);   
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const loadLessonDetails = async (lessonId) => {
        try {
            let res = await APIs.get(endpoints['lesson-details'](lessonId));
            setLessonDetails(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadLessonOutline = async (lessonId) => {
        try {
            let res = await APIs.get(endpoints['lesson-outline'](lessonId));
            setOutlines(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleShowDetail = (lessonId) => {
        loadLessonDetails(lessonId);
        loadLessonOutline(lessonId)
        setIsModalVisible(true)
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        try {
            if (value === 'yes') {
                let res = await APIs.get(endpoints['lesson-hasoutline']);
                setHasOutline(res.data); 
            } else if (value === 'no') {
                let res = await APIs.get(endpoints['lesson-nooutline']);
                setWithoutOutline(res.data);
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
            setLoading(false);
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
        if (value === 'yes') {
            loadLessonHasOutline();
        } else if (value === 'no') {
            loadLessonNoOutline();
        }
    }, [value]);

    const { width } = Dimensions.get('window');
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);


    const banners = [
        { url: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032708/1.jpg' },
        { url: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032898/2.jpg' },
        { url: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032954/3.jpg' },
        { url: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721033011/4.jpg' },
        { url: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721033093/5.jpg' }
    ];


    const goToNextPage = () => {
        let nextIndex = Math.ceil(scrollX._value / width) + 1;
        if (nextIndex === banners.length) {
            nextIndex = 0; // Quay lại hình đầu tiên khi đến cuối
        }
        scrollViewRef.current?.scrollTo({
            x: nextIndex * width,
            animated: true,
        });
    };
    
    const goToPreviousPage = () => {
        scrollViewRef.current?.scrollTo({
            x: (Math.floor(scrollX._value / width) - 1) * width,
            animated: true,
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            goToNextPage();
        }, 5000); 
    
        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    const handleCreate = (lessonId) => {
        if (user.account.role == 'student'){
            Alert.alert("Thông báo", "Bạn không thể sử dụng dịch vụ này")
        }else if(user.account.role === 'lecturer'){
            navigation.navigate('CreateOutline', { 'lessonId': lessonId })
        }
    }

    return (
        <Provider>
            <View style={MyStyle.container}>
                {/* Hiển thị banner */}
                <View style={{ position: 'relative' }}>
                    <TouchableOpacity
                        style={MyStyle.leftArrow}
                        onPress={goToPreviousPage}>
                        <FontAwesome name='chevron-left' size={25} color="white" />
                    </TouchableOpacity>

                    <Animated.ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                    >
                        {banners.map((banner, index) => (
                            <View key={index} style={{ width }}>
                                <Image source={{ uri: banner.url }} style={MyStyle.imageBanner} />
                            </View>
                        ))}
                    </Animated.ScrollView>

                    <TouchableOpacity
                        style={MyStyle.rightArrow}
                        onPress={goToNextPage}>
                        <FontAwesome name='chevron-right' size={25} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={MyStyle.indicatorContainer}>
                    {banners.map((_, index) => {
                        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                        const scale = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.8, 1.4, 0.8],
                            extrapolate: 'clamp',
                        });
                        return <Animated.View key={index} style={[MyStyle.indicator, { transform: [{ scale }] }]} />;
                    })}
                </View>
                <Text style={MyStyle.title}>DANH SÁCH MÔN HỌC</Text>
                <SegmentedButtons style={MyStyle.margin}
                        value={value}
                        onValueChange={setValue}
                        buttons={[
                            {
                                value: 'yes',
                                label: 'Đã có đề cương',
                            },
                            {
                                value: 'no',
                                label: 'Chưa có đề cương',
                            }
                        ]}
                    />
                <ScrollView onScroll={loadMore} refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }>
                    {loading && <ActivityIndicator/>}
                    {value === 'yes' && hasOutline.map((l, index) => 
                    <TouchableOpacity key={l.id}  
                        onPress={() => handleShowDetail(l.id)} >
                        <List.Item 
                            title={l.subject} 
                            description={l.created_date?moment(l.created_date).format('Do MMMM, YYYY'):""}
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
                                    <Menu.Item onPress={() =>  handleShowDetail(l.id)} 
                                        title="Xem Chi Tiết" 
                                        leadingIcon="information-outline"
                                    />
                                    
                                </Menu> } />
                    </TouchableOpacity>)}
                    {value === 'no' && withoutOutline.map((l, index) => (
                    <TouchableOpacity key={l.id} onPress={() => handleShowDetail(l.id)}>
                        <List.Item 
                            title={l.subject} 
                            description={l.created_date ? moment(l.created_date).format('Do MMMM, YYYY') : ""}
                            right={() => (
                                <Menu
                                    visible={visibleMenus[index]}
                                    onDismiss={() => closeMenu(index)}
                                    anchor={
                                        <Appbar.Action 
                                            icon={MORE_ICON}
                                            onPress={() => openMenu(index)} 
                                        />
                                    }
                                >
                                    <Menu.Item 
                                        onPress={() => handleShowDetail(l.id)} 
                                        title="Xem Chi Tiết" 
                                        leadingIcon="information-outline"
                                    />
                                    <Menu.Item 
                                        onPress={() => { handleCreate(l.id) }} 
                                        title="Tạo Đề Cương" 
                                        leadingIcon="book-plus-multiple"
                                    />
                                </Menu>
                            )}
                        />
                    </TouchableOpacity> ))}
                    {details === null ? <ActivityIndicator /> : <>
                        <Modal key={details.id}
                            animationType="slide"
                            transparent={true}
                            visible={isModalVisible}
                            onRequestClose={() => {
                                setIsModalVisible(!isModalVisible);
                            }}
                        >
                            <View style={MyStyle.modalContainer}>
                                <View style={MyStyle.modalView}>
                                <TouchableOpacity
                                    style={MyStyle.closeButton}
                                    onPress={() => setIsModalVisible(!isModalVisible)}
                                >
                                    <FontAwesome name='close' size={23} color='black' />
                                </TouchableOpacity>
                                    <Text style={MyStyle.modalText}>Chi tiết môn học</Text>
                                    <Title style={MyStyle.title}>{details.subject}</Title>
                                    <Paragraph style={MyStyle.paragraph}>Thuộc: {details.category.name}</Paragraph>
                                    <View >
                                        {outlines.length > 0 ? (
                                            outlines.map((outline, index) => (
                                                <List.Item title={`${outline.name}`} key={outline.id} 
                                                    left={props => <List.Icon {...props} icon = "bookshelf" /> } />
                                                
                                            ))
                                        ) : (
                                            <Text>Không có đề cương nào</Text>
                                        )}
                                    </View>
                                    <Text style={MyStyle.date}>Ngày tạo: {moment(details.created_date).format('Do MMMM, YYYY')}</Text>
                                </View>
                            </View>
                        </Modal>
                    </>}
                </ScrollView>
            </View>
        </Provider>
    );
};
export default Lesson;
