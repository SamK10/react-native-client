import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import ActionButton from 'react-native-action-button';
import { SearchBar, Text, Avatar, Card, Divider, Icon, Button } from 'react-native-elements';
import { baseUrl } from '../shared/baseurl';
import { connect } from 'react-redux';
import { fetchPosts, fetchPages, fetchComments, deletePage, deletePost } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        posts: state.posts,
        pages: state.pages,
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    fetchPosts: () => dispatch(fetchPosts()),
    fetchPages: () => dispatch(fetchPages()),
    fetchComments: () => dispatch(fetchComments()),
    deletePage: (pageId) => dispatch(deletePage(pageId)),
    deletePost: (postId) => dispatch(deletePost(postId))
})

class Feed extends Component {

    constructor(props) {
        super(props);

        this.state = {
            search: ''
        };
    }

    renderImageCards = ({ item, index }) => {
        const handlePage = () => {
            if (item.owner._id === this.props.auth.user._id) {
                Alert.alert(
                    "What do you want to do?",
                    "Delete Page",
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
                            onPress: () => this.props.deletePage(item._id),
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
                onPress={() => this.props.navigation.navigate('Page', { page: item.title })}
                onLongPress={handlePage}
            >
                <Card
                    featuredTitle={item.title}
                    featuredTitleStyle={{ fontSize: 15, textAlign: 'center' }}
                    image={{ uri: baseUrl + item.src }}
                    imageStyle={{ resizeMode: 'cover' }}
                    containerStyle={{ width: 120, height: 150, margin: 5, borderRadius: 10, overflow: 'hidden', elevation: 5 }}
                />
            </TouchableWithoutFeedback>
        )
    };

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
            <Card containerStyle={{ marginHorizontal: 0, elevation: 5 }}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.navigation.navigate('Page', {
                            page: item.title
                        })
                    }}
                >
                    <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center' }} >
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
                </TouchableWithoutFeedback>
                <Divider />
                <TouchableWithoutFeedback
                    onLongPress={handlePost}
                >
                    <Text style={{ marginVertical: 10 }} numberOfLines={6}>
                        {item.details}
                    </Text>
                </TouchableWithoutFeedback>
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
        );
    }

    render() {
        return (
            <>
                <FlatList
                    data={this.props.posts.posts
                        .filter((item) => {
                            //applying filter for the inserted text in search bar
                            const itemData = item.details ? item.details.toUpperCase() : ''.toUpperCase();
                            const textData = this.state.search.toUpperCase();
                            return itemData.indexOf(textData) > -1;
                        })
                    }
                    renderItem={this.renderPost}
                    style={{ paddingBottom: 50 }}
                    keyExtractor={item => item._id}
                    initialNumToRender={5}
                    onRefresh={() => {
                        this.props.fetchPages();
                        this.props.fetchPosts();
                        this.props.fetchComments();
                    }}
                    refreshing={this.props.posts.isLoading}
                    ListHeaderComponent={
                        <>
                            <Card
                                title='PAGES'
                                containerStyle={{ margin: 0, paddingHorizontal: 0, elevation: 5 }}>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={this.props.pages.pages}
                                    renderItem={this.renderImageCards}
                                    keyExtractor={item => item._id}
                                    initialNumToRender={3}
                                />
                            </Card>
                            <Card
                                containerStyle={{ marginHorizontal: 0, paddingHorizontal: 0, elevation: 5 }}
                                title='NOTICE BOARD'>
                                <SearchBar
                                    placeholder="Search..."
                                    lightTheme={false}
                                    round
                                    containerStyle={{ backgroundColor: 'white', borderTopWidth: 0, borderBottomWidth: 0 }}
                                    inputContainerStyle={{ backgroundColor: 'lightgrey' }}
                                    inputStyle={{ fontSize: 16 }}
                                    onChangeText={text => this.setState({ search: text })}
                                    value={this.state.search}
                                />
                            </Card>
                        </>
                    }
                />
                {this.props.auth.isAuthenticated &&
                    <ActionButton buttonColor="rgba(231,76,60,1)">
                        <ActionButton.Item buttonColor='#3498db' title="New Page" onPress={() => { this.props.navigation.navigate('Create Page') }}>
                            <Icon name="newspaper-plus" type='material-community' iconStyle={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#1abc9c' title="Saved" onPress={() => {
                            this.props.navigation.navigate('Saved')
                        }}>
                            <Icon name="bookmark" type='font-awesome' iconStyle={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                }
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});