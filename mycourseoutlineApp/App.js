import { createStackNavigator } from "@react-navigation/stack";
import Lesson from "./components/Lesson/Lesson"
import { NavigationContainer } from "@react-navigation/native";
import LessonDetail from "./components/Lesson/LessonDetail";
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
import Approval from "./components/Admin/Approval";
import Approve from "./components/Admin/Approve";
import UpdateInfo from "./components/user/UpdateInfo";


const Stack = createStackNavigator();

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
                source={{ uri: user.avatar }}
                style={{ marginRight: 10 }}
              />
            )}
          </TouchableOpacity>
        )
    })}
    >
      <Stack.Screen name="Lesson" component={Lesson} options={{ headerTitleAlign: "center", title: "Môn Học"}}/>
      <Stack.Screen name="LessonDetail" component={LessonDetail} options={{title: "Chi tiết môn học"}} />
      <Stack.Screen name="CreateLesson" component={CreateLesson} options={{title: "Thêm mới môn học"}}/>
      <Stack.Screen name="OutlineDetail" component={OutlineDetail} options={{title: "Chi tiết đề cương"}} /> 
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
                source={{ uri: user.avatar }}
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
    </Stack.Navigator>
  );
}

const MyStackLogin = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator
      initialRouteName="Login">
      <Stack.Screen name="Đăng nhập" component={Login} options={{ headerTitleAlign: "center"}} />
      <Stack.Screen name="Đăng ký" component={Register} />
    </Stack.Navigator>
  );
}

const MyStackAdminOutline = () => {
  return (
    <Stack.Navigator
    initialRouteName="admin">
      <Stack.Screen name="OutlineApprove" component={ApproveOutline} options={{ headerTitleAlign: "center", title: "Danh Sách Đề Cương Cần Xét Duyệt"}} />
    
    </Stack.Navigator>
  );
}

const MyStackAdminAccount = () => {
  return (
    <Stack.Navigator
    initialRouteName="admin">
      <Stack.Screen name="Account" component={Account} options={{ headerTitleAlign: "center", title: "Tài Khoản Giảng Viên Cần Xét Duyệt"}} /> 
    
    </Stack.Navigator>
  );
}

const MyStackAdminApprove = () => {
  return (
    <Stack.Navigator
    initialRouteName="admin">
      <Stack.Screen name="Approval" component={Approval} options={{ headerTitleAlign: "center", title: "Danh Sách Phiếu Yêu Cầu"}} /> 
    
    </Stack.Navigator>
  );
}

const MyStackLoginSV = () => {
  return (
    <Stack.Navigator
    initialRouteName="admin">
      <Stack.Screen name="Register" component={Approve} options={{ headerTitleAlign: "center", title: "Yêu Cầu Xét Duyệt"}} /> 
    
    </Stack.Navigator>
  );
}

const MyStackProfile = () => {
  return (
    <Stack.Navigator
    initialRouteName="admin">
      <Stack.Screen name="Profile" component={Profile} options={{ headerTitleAlign: "center", title: "Thông Tin Tài Khoản"}} /> 
      <Stack.Screen name="Update" component={UpdateInfo} options={{ headerTitleAlign: "center", title: "Cập Nhập Tài Khoản"}} /> 

    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);
  return (
    <Tab.Navigator>

        

      {user===null ? <>
        <Tab.Screen name="Register" component={UpdateInfo}
          options={{title:'Yêu cầu tài khoản',
            tabBarIcon: () => <Icon source="account-group" size={30} color="gray"/>, headerShown: false}} />

        <Tab.Screen name="Login" component={MyStackLogin} 
            options={{title: "Đăng nhập, Đăng ký", 
            tabBarIcon: () => <Icon source="login" size={30}  color="gray" />, headerShown: false}} />

      </>: user.is_staff ? <>

        <Tab.Screen name="Admin" component={MyStackAdminOutline} 
          options={{title: "Đề cương", 
          tabBarIcon: () => <Icon source="bookshelf" size={30} color="gray" />,headerShown: false}} />

        <Tab.Screen name="Account" component={MyStackAdminAccount} 
          options={{ headerTitleAlign: "center", title: "Giảng Viên", 
          tabBarIcon: () => <Icon source="account" size={30} color="gray" />,headerShown: false}} />

        <Tab.Screen name="Approval" component={MyStackAdminApprove} 
          options={{ headerTitleAlign: "center", title: "Sinh Viên", 
          tabBarIcon: () => <Icon source="account-group" size={30} color="gray" />,headerShown: false}} />

        <Tab.Screen name="Profile" component={Profile} 
          options={{title: "Đăng xuất", 
          tabBarIcon: () => <Icon source="logout" size={30} color="gray" />,headerShown: false}} />

      </>: <>
        <Tab.Screen name="Home" component={MyStackLesson} 
          options={{title: "Danh mục môn học", 
          tabBarIcon: () => <Icon source="home" size={30} color="gray" />, headerShown: false}} />

        <Tab.Screen name="Outline" component={MyStackOutline} 
          options={{title: "Danh mục đề cương", 
          tabBarIcon: () => <Icon source="book-outline" size={30} color="gray" />,  headerShown: false}} />

        <Tab.Screen name="Profile" component={MyStackProfile} 
          options={{title: "Đăng xuất", 
          tabBarIcon: () => <Icon source="logout" size={30} color="gray" />,headerShown: false}} />

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