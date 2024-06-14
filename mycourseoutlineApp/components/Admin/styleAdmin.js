import { StyleSheet } from "react-native";

export default StyleSheet.create({
    courseName: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    }, 
    commentContainer: {
        flexDirection: 'row',
        marginVertical: 7,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        marginLeft: 5,
        marginRight: 5,
    },
    avatarContainer: {
        marginRight: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    fullName: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    createdDate: {
        color: 'gray',
        fontSize: 12,
    },
    commentContent: {
        flex: 1,
        flexDirection: "row",
    },
    margin : {
        marginTop: 17,
    },
    button: {
        borderRadius: 5,
        alignSelf:"center",
        paddingVertical: 2,
    }, 
    containerLogin: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 50,
    },   
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainer: {
        marginBottom: 10, 
        paddingTop: 60
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    listContent: {
        paddingBottom: 16
    },
    itemContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginVertical: 5,
        borderRadius: 5,
    },
    accountInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    name: {
        fontSize: 18,
        marginBottom: 5,
    },
    code: {
        fontSize: 16,
        color: '#666',
    },
    input: {
        width: '94%',
        alignSelf: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    inputLogin: {
        flex: 1,
        height: 40,
    },
    // button: {
    //     backgroundColor: '#1E90FF',
    //     padding: 10,
    //     borderRadius: 5,
    //     alignItems: 'center',
    //     marginTop: 10,
    // },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    icon: {
        marginLeft: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    
});