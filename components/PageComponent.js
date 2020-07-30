import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import { SearchBar, Text, Image, Avatar, Button, Card, Divider, Icon } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import { baseUrl } from '../shared/baseurl';
import { connect } from 'react-redux';
import { fetchPosts, fetchEvents, fetchComments, deletePost, deleteEvent } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        posts: state.posts,
        pages: state.pages,
        auth: state.auth,
        events: state.events
    }
}

const mapDispatchToProps = dispatch => ({
    fetchPosts: () => dispatch(fetchPosts()),
    fetchEvents: () => dispatch(fetchEvents()),
    fetchComments: () => dispatch(fetchComments()),
    deletePost: (postId) => dispatch(deletePost(postId)),
    deleteEvent: (eventId) => dispatch(deleteEvent(eventId))
})

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
        return (
            <TouchableWithoutFeedback
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
                    style={{ marginBottom: 10 }}
                    keyExtractor={item => item._id}
                    initialNumToRender={5}
                    onRefresh={() => { this.props.fetchPosts(); this.props.fetchEvents(); this.props.fetchComments(); }}
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
                />
                {
                    this.props.auth.isAuthenticated && this.state.current_page.owner._id === this.props.auth.user._id &&
                    < ActionButton buttonColor="rgba(231,76,60,1)" >
                        <ActionButton.Item buttonColor='#9b59b6' title="New Post" onPress={() => {
                            this.props.navigation.navigate('Create Post', {
                                pageTitle: page
                            })
                        }}>
                            <Icon name="pencil" type='font-awesome' iconStyle={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#1abc9c' title="New Event" onPress={() => {
                            this.props.navigation.navigate('Create Event', {
                                pageTitle: page
                            })
                        }}>
                            <Icon name="calendar" type='font-awesome' iconStyle={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                }
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