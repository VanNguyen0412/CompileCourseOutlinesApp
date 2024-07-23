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
        width: 53,
        height: 53,
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
        // paddingVertical: 2,
        backgroundColor: '#79c7d9'
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
        width: '100%',
        alignSelf: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
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
    text: {
        fontSize: 17,
        color: '#808080',
        fontWeight: "500"
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e9ecef',
        borderRadius: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
    },
    horizontalLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#343a40',
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 15,
        marginBottom: 16,
    },
    inputContainer123: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        // padding: 10,
        backgroundColor: '#fff',
        marginLeft: 5,
        marginRight:5,
        margin: 10,

    },
    fieldContainerCO: {
        marginBottom: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 3,
        right: 7,
        padding: 10,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        // marginVertical: 8,
        color: '#5f9ea0',
        textAlign:"center"
    },
    paragraph: {
        fontSize: 16,
        marginVertical: 8,
        color: '#555',
        textAlign: "center"
    },
    date: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    provideButton: {
        padding: 2, 
        borderWidth: 0.5, 
        marginTop: 10, 
        borderRadius: 5, 
        width: 200, 
        backgroundColor: '#79c7d9' 
    },


    
});