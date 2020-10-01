import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import { SearchBar, Text, Image, Avatar, Button, Card, Divider, Icon } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import * as Calendar from 'expo-calendar';
import { baseUrl } from '../shared/baseurl';
import { connect } from 'react-redux';
import { fetchPosts, fetchEvents, fetchComments, deletePost, deleteEvent, clearPosts } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        posts: state.posts,
        pages: state.pages,
        auth: state.auth,
        events: state.events
    }
}

const mapDispatchToProps = dispatch => ({
    clearPosts: () => dispatch(clearPosts()),
    fetchPosts: (offset) => dispatch(fetchPosts(offset)),
    fetchEvents: () => dispatch(fetchEvents()),
    fetchComments: () => dispatch(fetchComments()),
    deletePost: (postId) => dispatch(deletePost(postId)),
    deleteEvent: (eventId) => dispatch(deleteEvent(eventId))
})

async function getDefaultCalendarSource() {
    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
    return defaultCalendars[0].source;
}

async function createCalendar() {
    const defaultCalendarSource =
        Platform.OS === 'ios'
            ? await getDefaultCalendarSource()
            : { isLocalAccount: true, name: 'Expo Calendar' };
    const newCalendarID = await Calendar.createCalendarAsync({
        title: 'Expo Calendar',
        color: 'blue',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: 'internalCalendarName',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    console.log(`Your new calendar ID is: ${newCalendarID}`);
}

class Page extends Component {

    constructor(props) {
        super(props);

        this.state = {
            search: '',
            current_page: this.props.pages.pages.filter((page) => page.title === this.props.route.params.page)[0]
        };
    }

    renderEventCards = ({ item, index }) => {
        const handleEvent = () => {
            if (item.owner._id === this.props.auth.user._id) {
                Alert.alert(
                    "What do you want to do?",
                    "Delete Event",
                    [
                        {
                            text: "Cancel",
                            style: "cancel"
                        },
                        /*{
                            text: "Edit",
                            onPress: () => {}
                        },*/
                        {
                            text: "Delete",
                            onPress: () => this.props.deleteEvent(item._id),
                            style: "destructive"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else
                return
        }
        const calendarEvent = () => {
            Alert.alert(
                "Add Event to calendar?",
                "Add Event",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    /*{
                        text: "Edit",
                        onPress: () => {}
                    },*/
                    {
                        text: "Add",
                        onPress: () => createCalendar()
                    }
                ],
                { cancelable: false }
            );
        }
        return (
            <TouchableWithoutFeedback
                onPress={calendarEvent}
                onLongPress={handleEvent}
            >
                <Card
                    containerStyle={{ width: 200, height: 150, margin: 5, borderRadius: 5, overflow: 'hidden', backgroundColor: 'lightgrey', elevation: 5 }}
                    image={{ uri: baseUrl + item.src }}
                    featuredTitle={item.title}
                    featuredSubtitle={item.date + '\n' + item.location}
                />
            </TouchableWithoutFeedback>
        )
    }

    renderPost = ({ item, index }) => {
        var date = new Date(item.createdAt).toString();
        const handlePost = () => {
            if (item.owner._id === this.props.auth.user._id) {
                Alert.alert(
                    "What do you want to do?",
                    "Delete Post",
                    [
                        {
                            text: "Cancel",
                            style: "cancel"
                        },
                        /*{
                            text: "Edit",
                            onPress: () => {}
                        },*/
                        {
                            text: "Delete",
                            onPress: () => this.props.deletePost(item._id),
                            style: "destructive"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else
                return
        }

        return (
            <TouchableWithoutFeedback
                onLongPress={handlePost}
            >
                <Card containerStyle={{ marginHorizontal: 0, elevation: 5 }}>
                    <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                            <Avatar
                                rounded
                                source={{
                                    uri: baseUrl + item.avatar_url,
                                }}
                                size="small"
                            />
                        </View>
                        <View style={{ marginLeft: 10, width: 270 }}>
                            <Text style={{ fontSize: 14 }}>
                                <Text style={{ fontWeight: 'bold' }} >{item.title}</Text>
                            </Text>
                            <Text style={{ fontSize: 12, color: 'grey' }}>{date.substring(16, 21) + ', ' + date.substring(0, 15)}</Text>
                        </View>
                    </View>
                    <Divider />
                    <Text style={{ marginVertical: 10 }} numberOfLines={6}>
                        {item.details}
                    </Text>
                    <Button
                        title="Read Article"
                        buttonStyle={{ backgroundColor: '#00203FFF', height: 30 }}
                        titleStyle={{ color: '#ADEFD1FF', fontSize: 12, textAlignVertical: 'center' }}
                        containerStyle={{ width: 100 }}
                        raised
                        onPress={() => {
                            this.props.navigation.navigate('PostDetail', {
                                postId: item._id
                            })
                        }}
                    />
                </Card>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        const page = this.props.route.params.page;
        return (
            <View >
                <FlatList
                    ref={(ref) => { this.flatListRef = ref; }}
                    data={this.props.posts.posts
                        .filter((post) => post.title === this.props.route.params.page)
                        .filter((item) => {
                            //applying filter for the inserted text in search bar
                            const itemData = item.details ? item.details.toUpperCase() : ''.toUpperCase();
                            const textData = this.state.search.toUpperCase();
                            return itemData.indexOf(textData) > -1;
                        })
                    }
                    renderItem={this.renderPost}
                    keyExtractor={item => item._id}
                    onRefresh={() => {
                        this.props.clearPosts();
                        this.props.fetchPosts(0);
                        this.props.fetchEvents();
                        this.props.fetchComments();
                    }}
                    refreshing={this.props.posts.isLoading}
                    ListHeaderComponent={
                        <View>
                            <Card containerStyle={{ margin: 0, padding: 0, paddingBottom: 10, elevation: 5 }}>
                                <Image
                                    source={{ uri: baseUrl + this.state.current_page.cover_url }}
                                    style={{ height: 200 }}
                                    containerStyle={{ backgroundColor: '#000', borderBottomWidth: 0.5 }}
                                    resizeMode='cover'
                                />
                                <Avatar
                                    rounded
                                    source={{
                                        uri: baseUrl + this.state.current_page.src
                                    }}
                                    size={150}
                                    containerStyle={{ alignSelf: 'center', marginTop: -70, borderWidth: 0.5, backgroundColor: '#fff' }}
                                />
                            </Card>
                            <Card
                                title='EVENTS'
                                containerStyle={{ marginHorizontal: 0, paddingHorizontal: 0, elevation: 5 }}>
                                <FlatList
                                    horizontal
                                    data={this.props.events.events.filter((event) => this.state.current_page.src === event.src)}
                                    renderItem={this.renderEventCards}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={item => item._id}
                                />
                            </Card>
                            <Card containerStyle={{ marginHorizontal: 0, paddingHorizontal: 0, elevation: 5 }} title='NOTICE BOARD'>
                                <SearchBar
                                    placeholder={"Search in " + page + '...'}
                                    lightTheme={true}
                                    round
                                    containerStyle={{ backgroundColor: 'white', borderTopWidth: 0, borderBottomWidth: 0 }}
                                    inputContainerStyle={{ backgroundColor: 'lightgrey' }}
                                    inputStyle={{ fontSize: 16 }}
                                    onChangeText={text => this.setState({ search: text })}
                                    value={this.state.search}
                                />
                            </Card>
                        </View>
                    }
                    ListFooterComponent={
                        <Button
                            title="Load More"
                            type='clear'
                            onPress={() => this.props.fetchPosts(this.props.posts.offset)}
                            containerStyle={{ alignItems: 'center', justifyContent: 'center', marginVertical: 15 }}
                            buttonStyle={{ height: 25, width: 100 }}
                            titleStyle={{ fontSize: 12 }}
                        />
                    }
                />

                <ActionButton buttonColor="rgba(231,76,60,1)" >
                    {this.props.auth.isAuthenticated && (this.state.current_page.owner._id === this.props.auth.user._id) &&
                        <ActionButton.Item buttonColor='#9b59b6' title="New Post" onPress={() => {
                            this.props.navigation.navigate('Create Post', {
                                pageTitle: page
                            })
                        }}>
                            <Icon name="pencil" type='font-awesome' iconStyle={styles.actionButtonIcon} />
                        </ActionButton.Item>}
                    {this.props.auth.isAuthenticated && this.state.current_page.owner._id == this.props.auth.user._id &&
                        <ActionButton.Item buttonColor='#1abc9c' title="New Event" onPress={() => {
                            this.props.navigation.navigate('Create Event', {
                                pageTitle: page
                            })
                        }}>
                            <Icon name="calendar" type='font-awesome' iconStyle={styles.actionButtonIcon} />
                        </ActionButton.Item>}
                    <ActionButton.Item buttonColor='#3498db' title="Scroll to Top" onPress={() => { this.flatListRef.scrollToOffset({ animated: true, offset: 0 }) }}>
                        <Icon name="chevron-up" type='font-awesome' iconStyle={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            </View >
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});