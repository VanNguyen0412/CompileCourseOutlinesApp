import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#f8f8f8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        transform: [{ scale: 1 }],
        transitionProperty: 'transform',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease-in-out',
    }, 
    container1: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#fff',
        height: 200,
    }, 
    subject: {
        fontSize: 20,
        fontWeight: "bold",
        color: "blue"
    }, 
    row: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
    }, 
    wrap: {
        flexWrap: "wrap"
    }, 
    margin: {
        margin: 5,
        marginLeft: 10,
        marginRight: 10
    }, 
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 20
    }, 
    avatarContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center'
    }, 
    row1: {
        flexDirection: "row",
        // flexWrap: "wrap",
        justifyContent:'space-around'
    }, 
    card: {
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
        color: '#5f9ea0',
    },
    paragraph: {
        fontSize: 16,
        marginVertical: 8,
        color: '#555',
    },
    date: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    text: {
        textTransform: 'uppercase',
        color: '#808080'
    }, 
    outline: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    dropdown: {
        marginBottom: 16,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        width: 150
    },
    searchContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    inputContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2, // Shadow cho Android
    },
    input: {
        color: '#333',
        alignSelf: "center",
        width: "95%" // Màu của text input
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'rgb(233, 223, 235)',
        margin: 5,
        alignSelf: "center",
        width: "95%"
    }, 
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    gridItem: {
        width: '47%',
        marginBottom: 20,
        // marginLeft: 10
    },
    imageContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    image: {
        width: '100%',
        height: 60,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    selectedText: {
        color: 'yellow', // Change this to the desired color
        fontSize: 16,
    },
    button: {
        alignSelf:"center",
        width: '70%',
        marginTop: 10,
        paddingVertical: 2,
        // backgroundColor: '#007BFF',
    },
    hihi: {
        justifyContent:"center",
        alignSelf:"center",
        margin: 5, 
        color: '#808080',
        fontWeight: "bold"
    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
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
        borderRadius: 20,
        padding: 35,
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
    inputAC: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        width: '100%',
        paddingHorizontal: 10,
    },
    // button: {
    //     marginVertical: 10,
    //     width: '100%',
    // },
}); 