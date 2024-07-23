import { createStackNavigator } from "@react-navigation/stack";
import Lesson from "./components/Lesson/Lesson"
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Register from "./components/user/Register";
import Login from "./components/user/Login";
import { Appbar, Avatar, Drawer, Icon, View } from "react-native-paper";
import Outline from "./components/Outline/Outline";
import CreateLesson from "./components/Lesson/CreateLesson";
import { MyDispatchContext, MyUserContext } from "./configs/Context";
import { useContext, useReducer } from "react";
import MyUserReducer from "./configs/Recuder";
import Profile from "./components/user/Profile";
import { TouchableOpacity } from "react-native";
import OutlineDetail from "./components/Outline/OutlineDetail";
import CreateOutline from "./components/Outline/CreateOutline";
import ApproveOutline from "./components/Admin/ApproveOutline";
import Account from "./components/Admin/Accounts";
import Approve from "./components/Admin/Approve";
import UpdateInfo from "./components/user/UpdateInfo";
import UpdateOutline from "./components/Outline/UpdateOutline";
import UpdateAccount from "./components/user/UpdateAccount";
import LessonAdmin from "./components/Admin/LessonAdmin";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProvideAccount from "./components/Admin/ProvideAccount";


const Stack = createStackNavigator();

const MyStackLessonAdmin = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({navigation}) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => {
            if (!user) {
              navigation.navigate('Login'); // Chuyển đến màn hình đăng nhập nếu chưa đăng nhập
            }else{
              navigation.navigate('Profile');
            }
          }}>
            {user===null ? (
              <Avatar.Icon
              size={35}
              icon="login" // Icon đăng nhập
              style={{ marginRight: 10 }}
            />
            ) : user.is_staff ?(
              <Avatar.Image
                size={35}
                source={require('./images/2.png')}
                style={{ marginRight: 10 }}
                />
            ): (
              
              <Avatar.Image
                size={35}
                source={{ uri: user.account.avatar }}
                style={{ marginRight: 10 }}
              />
            )}
          </TouchableOpacity>
        )
    })}
    >
      <Stack.Screen name="Lesson" component={LessonAdmin} options={{ headerTitleAlign: "center", title: "Môn Học"}}/>
      <Stack.Screen name="CreateLesson" component={CreateLesson} options={{title: "Thêm mới môn học"}}/>
      <Stack.Screen name="Profile" component={Profile} options={{ headerTitleAlign: "center", title: "Thông Tin Tài Khoản"}} /> 
      <Stack.Screen name="UpdateAccount" component={UpdateAccount} options={{ headerTitleAlign: "center", title: "Cập Nhập Tài Khoản User"}} />
    </Stack.Navigator>
  );
}

const MyStackLesson = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({navigation}) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => {
            if (!user) {
              navigation.navigate('Login'); // Chuyển đến màn hình đăng nhập nếu chưa đăng nhập
            }else{
              navigation.navigate('Profile');
            }
          }}>
            {user===null ? (
              <Avatar.Icon
              size={35}
              icon="login" // Icon đăng nhập
              style={{ marginRight: 10 }}
            />
            ) : user.is_staff ?(
              <Avatar.Icon 
              size={35}
              icon="account"
              style={{ marginRight: 10 }}
              />
            ): (
              
              <Avatar.Image
                size={35}
                source={{ uri: user.account.avatar }}
                style={{ marginRight: 10 }}
              />
            )}
          </TouchableOpacity>
        )
    })}
    >
      <Stack.Screen name="Lesson" component={Lesson} options={{ headerTitleAlign: "center", title: "Môn Học"}}/>
      <Stack.Screen name="CreateLesson" component={CreateLesson} options={{title: "Thêm mới môn học"}}/>
      <Stack.Screen name="CreateOutline" component={CreateOutline} options={{title: "Thêm mới đề cương"}} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerTitleAlign: "center", title: "Thông Tin Tài Khoản"}} /> 
      <Stack.Screen name="UpdateAccount" component={UpdateAccount} options={{ headerTitleAlign: "center", title: "Cập Nhập Tài Khoản User"}} />
    </Stack.Navigator>
  );
}

const MyStackOutline = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator
      initialRouteName="Outline"
      screenOptions={({navigation}) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => {
            if (!user) {
              navigation.navigate('Login'); // Chuyển đến màn hình đăng nhập nếu chưa đăng nhập
            }else{
              navigation.navigate('Profile');
            }
          }}>
            {user===null ? (
              <Avatar.Icon
              size={35}
              icon="login" // Icon đăng nhập
              style={{ marginRight: 10 }}
            />
            ) : user.is_staff ?(
              <Avatar.Icon 
              size={35}
              icon="account"
              style={{ marginRight: 10 }}
              />
            ): (
              
              <Avatar.Image
                size={35}
                source={{ uri: user.account.avatar }}
                style={{ marginRight: 10 }}
              />
            )}
          </TouchableOpacity>
        )
    })}
    >
      <Stack.Screen name="Outline" component={Outline} options={{ headerTitleAlign: "center", title: "Đề Cương"}}/>
      <Stack.Screen name="OutlineDetail" component={OutlineDetail} options={{title: "Chi tiết đề cương"}} /> 
      <Stack.Screen name="CreateOutline" component={CreateOutline} options={{title: "Thêm mới đề cương"}} />
      <Stack.Screen name="UpdateOutline" component={UpdateOutline} options={{title: "Chỉnh sửa đề cương"}} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerTitleAlign: "center", title: "Thông Tin Tài Khoản"}} /> 
      <Stack.Screen name="UpdateAccount" component={UpdateAccount} options={{ headerTitleAlign: "center", title: "Cập Nhập Tài Khoản User"}} />
    </Stack.Navigator>
  );
}

const MyStackLogin = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator
      initialRouteName="Login">
      <Stack.Screen name="Trang chủ" component={HomeScreen} options={{ headerTitleAlign: "center", headerShown: false}} />
      <Stack.Screen name="Đăng nhập" component={Login} options={{ headerTitleAlign: "center"}} />
      <Stack.Screen name="Đăng ký" component={Register} options={{ headerTitleAlign: "center", title: "Đăng Ký Tài Khoản Giảng Viên"}} />
      <Stack.Screen name="Register" component={Approve} options={{ headerTitleAlign: "center", title: "Yêu Cầu Xét Duyệt TK Sinh Viên"}} />     
    </Stack.Navigator>
  );
}

const MyStackAdminOutline = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator
    initialRouteName="admin"
    screenOptions={({navigation}) => ({
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          if (user) {
            navigation.navigate('Profile'); // Chuyển đến màn hình profile
          }
        }}>
          {user.is_staff ?(
            <Avatar.Image
            size={35}
            source={require('./images/2.png')}
            style={{ marginRight: 10 }}
            />
          ): (
            <Avatar.Image
              size={35}
              source={{ uri: user.account.avatar }}
              style={{ marginRight: 10 }}
            />
          )}
        </TouchableOpacity>
      )
      })}>
      <Stack.Screen name="OutlineApprove" component={ApproveOutline} options={{ headerTitleAlign: "center", title: "Đề Cương Cần Xét Duyệt"}} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerTitleAlign: "center", title: "Thông Tin Tài Khoản"}} /> 
    </Stack.Navigator>
  );
}

const MyStackAdminAccount = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator
    initialRouteName="admin"
    screenOptions={({navigation}) => ({
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          if (user) {
            navigation.navigate('Profile'); // Chuyển đến màn hình profile
          }
        }}>
          { user.is_staff ?(
            <Avatar.Image
            size={35}
            source={require('./images/2.png')}
            style={{ marginRight: 10 }}
            />
          ): (
            <Avatar.Image
              size={35}
              source={{ uri: user.account.avatar }}
              style={{ marginRight: 10 }}
            />
          )}
        </TouchableOpacity>
      )
      })}
    >
      <Stack.Screen name="Account" component={Account} options={{ headerTitleAlign: "center", title: "Tài Khoản Cần Xét Duyệt"}} /> 
      <Stack.Screen name="Profile" component={Profile} options={{ headerTitleAlign: "center", title: "Thông Tin Tài Khoản"}} /> 
    </Stack.Navigator>
  );
}

const MyStackAdminProvide = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator
    initialRouteName="admin"
    screenOptions={({navigation}) => ({
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          if (user) {
            navigation.navigate('Profile'); // Chuyển đến màn hình profile
          }
        }}>
          { user.is_staff ?(
            <Avatar.Image
            size={35}
            source={require('./images/2.png')}
            style={{ marginRight: 10 }}
            />
          ): (
            <Avatar.Image
              size={35}
              source={{ uri: user.account.avatar }}
              style={{ marginRight: 10 }}
            />
          )}
        </TouchableOpacity>
      )
      })}
    >
      <Stack.Screen name="Provide" component={ProvideAccount} options={{ headerTitleAlign: "center", title: "Cung Cấp Tài Khoản"}} /> 
      <Stack.Screen name="Profile" component={Profile} options={{ headerTitleAlign: "center", title: "Thông Tin Tài Khoản"}} /> 
    </Stack.Navigator>
  );
}


const MyStackProfile = () => {
  return (
    <Stack.Navigator
    initialRouteName="admin">
      <Stack.Screen name="Update" component={UpdateInfo} options={{ headerTitleAlign: "center", title: "Cập Nhập TK Lần Đầu Đăng Nhập"}} /> 
      <Stack.Screen name="Profile" component={Profile} options={{ headerTitleAlign: "center", title: "Thông Tin Tài Khoản"}} /> 
      <Stack.Screen name="UpdateAccount" component={UpdateAccount} options={{ headerTitleAlign: "center", title: "Cập Nhập Tài Khoản User"}} /> 

    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);
  return (
    <Tab.Navigator >

      {user===null ? <>
        <Tab.Screen name="Login" component={MyStackLogin} 
            options={{title: "Trang Chủ", 
            tabBarIcon: () => <Icon source="home" size={30}  color="gray" />, headerShown: false}} />
            
      </>: user.is_staff ? <>
        <Tab.Screen name="Lesson" component={MyStackLessonAdmin} 
          options={{title: "Môn học", 
          tabBarIcon: () => <Icon source="book-open-variant" size={30} color="gray" />, headerShown: false}} />

        <Tab.Screen name="Admin" component={MyStackAdminOutline} 
          options={{title: "Đề cương", 
          tabBarIcon: () => <Icon source="bookshelf" size={30} color="gray" />,headerShown: false}} />

        <Tab.Screen name="Provide" component={MyStackAdminProvide} 
          options={{ headerTitleAlign: "center", title: "Cung Cấp", 
          tabBarIcon: () => <Icon source="account-multiple-plus" size={30} color="gray" />,headerShown: false}} />

        <Tab.Screen name="Account" component={MyStackAdminAccount} 
          options={{ headerTitleAlign: "center", title: "Xét Duyệt", 
          tabBarIcon: () => <Icon source="bell-alert" size={30} color="gray" />,headerShown: false}} />

      </>: user.avatar === null ? <>

        <Tab.Screen name="Update" component={MyStackProfile} 
          options={{title: "Cập Nhập", 
          tabBarIcon: () => <Icon source="update" size={30} color="gray" />,headerShown: false}} />

      </>: <>
      
      <Tab.Screen name="Home" component={MyStackLesson} 
          options={{title: "Danh mục môn học", 
          tabBarIcon: () => <Icon source="home" size={30} color="gray" />, headerShown: false}} />
          
        <Tab.Screen name="Outline" component={MyStackOutline} 
          options={{title: "Danh mục đề cương", 
          tabBarIcon: () => <Icon source="book-outline" size={30} color="gray" />,  headerShown: false}} />
      </>}
    </Tab.Navigator>
    
  );
}


const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
          <MyTab />
        </MyDispatchContext.Provider>
        </MyUserContext.Provider>
    </NavigationContainer>
  );
}


export default App;