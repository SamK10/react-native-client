import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Avatar } from 'react-native-elements';
import { StatusBar } from 'react-native';
import About from './AboutComponent';
import Account from './AccountComponent';
import Saved from './SavedComponent';
import Feed from './FeedComponent';
import PostDetail from './PostdetailComponent';
import Page from './PageComponent';
import CreatePage from './Page';
import CreatePost from './Post';
import CreateEvent from './Event';
import { connect } from 'react-redux';
import { fetchPosts, fetchComments, fetchPages, fetchEvents, fetchSaves, clearPosts, /*getAuth*/ } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        posts: state.posts,
        comments: state.comments,
        pages: state.pages,
        events: state.events,
        saves: state.saves,
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    fetchEvents: () => dispatch(fetchEvents()),
    clearPosts: () => dispatch(clearPosts()),
    fetchPosts: (offset) => dispatch(fetchPosts(offset)),
    fetchComments: () => dispatch(fetchComments()),
    fetchPages: () => dispatch(fetchPages()),
    fetchSaves: () => dispatch(fetchSaves()),
    //getAuth: () => dispatch(getAuth())

})

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PostStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerTitleStyle: {
                    color: 'purple'
                }
            }}
        >
            <Stack.Screen
                name="Home"
                component={Feed}
                options={{
                    headerTitleAlign: 'center'
                }}
            />
            <Stack.Screen
                name="PostDetail"
                component={PostDetail}
                options={{
                    title: '',
                    headerTitleAlign: 'center'
                }}
            />
            <Stack.Screen
                name="Page"
                component={Page}
                options={({ route }) => ({
                    title: route.params.page,
                    headerTitleAlign: 'center'
                })}
            />
            <Stack.Screen
                name="Create Page"
                component={CreatePage}
                options={({ route }) => ({
                    headerTitleAlign: 'center'
                })}
            />
            <Stack.Screen
                name="Create Post"
                component={CreatePost}
                options={({ route }) => ({
                    headerTitleAlign: 'center'
                })}
            />

            <Stack.Screen
                name="Create Event"
                component={CreateEvent}
                options={({ route }) => ({
                    headerTitleAlign: 'center'
                })}
            />
            <Stack.Screen
                name="Saved"
                component={SavedStack}
                options={{
                    headerTitleAlign: 'center'
                }}
            />
        </Stack.Navigator>
    )
}
const SavedStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Saved'
            screenOptions={{
                headerTitleStyle: {
                    color: 'purple'
                }
            }}
        >
            <Stack.Screen
                name="Saved"
                component={Saved}
                options={{
                    headerTitleAlign: 'center'
                }}
            />
            <Stack.Screen
                name="PostDetail"
                component={PostDetail}
                options={{
                    title: '',
                    headerTitleAlign: 'center'
                }}
            />
        </Stack.Navigator>
    )
}
const AccountStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleStyle: {
                    color: 'purple'
                }
            }}
        >
            <Stack.Screen
                name="Account"
                component={Account}
                options={{
                    headerTitleAlign: 'center'
                }}
            />
        </Stack.Navigator>
    )
}
const AboutStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleStyle: {
                    color: 'purple'
                }
            }}
        >
            <Stack.Screen
                name="About"
                component={About}
                options={{
                    headerTitleAlign: 'center'
                }}
            />
        </Stack.Navigator>
    )
}

const MainView = () => {
    return (
        <NavigationContainer>
            <StatusBar translucent backgroundColor='transparent' barStyle='dark-content' />
            <Tab.Navigator
                initialRouteName='Home'
                backBehavior='initialRoute'
                tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'grey'
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={PostStack}
                    options={{
                        tabBarIcon: ({ color, size }) => <Icon name='home' type='font-awesome' color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={AccountStack}
                    options={{
                        tabBarIcon: ({ color, size }) => <Icon name='user' type='font-awesome' color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="About"
                    component={AboutStack}
                    options={{
                        tabBarIcon: ({ color, size }) => <Icon name='info' type='font-awesome' color={color} size={size} />
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

class Main extends Component {

    componentDidMount() {
        //this.props.getAuth();
        this.props.fetchPages();
        this.props.clearPosts();
        this.props.fetchPosts(0);
        this.props.fetchComments();
        this.props.fetchSaves();
        this.props.fetchEvents();
    }

    render() {
        return (
            <MainView />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);