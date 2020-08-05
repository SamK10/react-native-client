import React, { Component } from 'react';
import { ScrollView, View, Share, FlatList, Alert, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Text, Input, Icon, Button, Avatar, Badge, Card, Divider, Overlay } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import { connect } from 'react-redux';
import { postSave, deleteSave, postComment, deleteComment, fetchComments } from '../redux/ActionCreators';
import { baseUrl } from '../shared/baseurl';

const mapStateToProps = state => {
    return {
        auth: state.auth,
        posts: state.posts,
        saves: state.saves,
        comments: state.comments
    }
}

const mapDispatchToProps = dispatch => ({
    postSave: (postId) => dispatch(postSave(postId)),
    deleteSave: (postId) => dispatch(deleteSave(postId)),
    postComment: (postId, comment) => dispatch(postComment(postId, comment)),
    deleteComment: (commentId) => dispatch(deleteComment(commentId))
})

function RenderPostDetail(props) {

    const post = props.post;

    if (post != null) {
        var date = new Date(post.createdAt).toString();
        return (
            <Card
                containerStyle={{ marginHorizontal: 0, elevation: 5 }}
            >
                <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Avatar
                            rounded
                            source={{
                                uri: baseUrl + post.avatar_url,
                            }}
                            size="small"
                        />
                    </View>
                    <View style={{ marginLeft: 10, width: 270 }}>
                        <Text style={{ fontSize: 14 }}>
                            <Text style={{ fontWeight: 'bold' }}>{post.title}</Text>
                        </Text>
                        <Text style={{ fontSize: 12, color: 'grey' }}>{date.substring(16, 21) + ', ' + date.substring(0, 15)}</Text>
                    </View>
                </View>
                <Divider />
                <Text style={{ marginVertical: 10 }}>
                    {post.details}
                </Text>
            </Card>
        );
    }
}

class PostDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            comment: '',
            isNavOpen: false,
            isVisible: false
        };
    }

    renderCommentItem = ({ item, index }) => {
        const handleComment = () => {
            if (item.author._id === this.props.auth.user._id) {
                Alert.alert(
                    "What do you want to do?",
                    "Delete Comment",
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
                            onPress: () => this.props.deleteComment(item._id),
                            style: "destructive"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else
                return

        }
        var date = new Date(item.createdAt).toString();
        return (
            <TouchableWithoutFeedback onLongPress={handleComment}>
                <View key={index} style={{ marginVertical: 15, flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View>
                        <Avatar
                            rounded
                            source={{
                                uri: baseUrl + item.author.display_pic,
                            }}
                            size="small"
                        />
                    </View>
                    <View style={{ marginLeft: 10, width: 270 }}>
                        <Text style={{ fontSize: 14 }}>
                            <Text style={{ fontWeight: 'bold' }}>{item.author.firstname + ' ' + item.author.lastname}</Text>
                            <Text>  {item.comment}</Text>
                        </Text>
                        <Text style={{ fontSize: 12, color: 'grey' }}>{date.substring(16, 21) + ', ' + date.substring(0, 15)}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    toggleModal() {
        this.setState({
            isVisible: !this.state.isVisible
        });
    }

    handleSubmit(postId, comment) {
        this.props.postComment(postId, comment);
        this.toggleModal();
    }

    markSave(postId) {
        this.props.postSave(postId);
    }

    removeSave(postId) {
        this.props.deleteSave(postId);
    }

    sharePost = (postId, title, message) => {
        var date = new Date(this.props.posts.posts.filter((post) => post._id === postId)[0].createdAt).toString();
        Share.share({
            title: title,
            message: title + ',\n' + date.substring(16, 21) + ', ' + date.substring(0, 15) + ': \n\n' + message
        }, {
            dialogTitle: 'Share ' + title
        })
    };

    render() {
        const postId = this.props.route.params.postId;
        const post = this.props.posts.posts.filter((post) => post._id === postId)[0];
        return (
            <>
                <ScrollView>
                    <RenderPostDetail post={this.props.posts.posts.filter((post) => post._id === postId)[0]}
                    />
                    <Card
                        title='Comments'
                        containerStyle={{ marginHorizontal: 0, elevation: 5 }}
                    >
                        <FlatList
                            data={this.props.comments.comments.filter((comment) => comment.post === postId)}
                            renderItem={this.renderCommentItem}
                            keyExtractor={item => item._id}
                        />
                    </Card>
                    <Overlay
                        isVisible={this.state.isVisible}
                        windowBackgroundColor="rgba(255, 255, 255, .5)"
                        onBackdropPress={() => this.setState({ isVisible: false })}
                    >
                        <View style={{ width: 300, marginHorizontal: 0 }}>
                            <TextInput
                                style={{ borderRadius: 5, backgroundColor: '#EBECF0', padding: 15, marginVertical: 20 }}
                                multiline
                                placeholder="Comment Here..."
                                placeholderTextColor="grey"
                                editable
                                onChangeText={(comment) => this.setState({ comment: comment })}
                                value={this.state.comment}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 300 }}>
                                <Button
                                    title="Comment"
                                    buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                                    titleStyle={{ color: '#ADEFD1FF' }}
                                    raised
                                    onPress={() => this.handleSubmit(postId, this.state.comment)}
                                />
                                <Button
                                    title="Cancel"
                                    buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                                    titleStyle={{ color: '#ADEFD1FF' }}
                                    raised
                                    onPress={() => this.toggleModal()}
                                />
                            </View>
                        </View>
                    </Overlay>
                </ScrollView>
                {this.props.auth.isAuthenticated &&
                    <ActionButton buttonColor="rgba(231,76,60,1)">
                        {this.props.saves.saves !== null &&
                            <ActionButton.Item buttonColor='#9b59b6' title={this.props.saves.saves.posts.some((post) => post._id === postId) ? "Unsave" : "Save"} onPress={() => this.props.saves.saves.posts.some((post) => post._id === postId) ? this.props.deleteSave(postId) : this.props.postSave(postId)}>
                                <Icon name={this.props.saves.saves.posts.some((post) => post._id === postId) ? "bookmark-minus" : "bookmark-plus"} type='material-community' iconStyle={styles.actionButtonIcon} />
                            </ActionButton.Item>
                        }
                        {this.props.saves.saves === null &&
                            <ActionButton.Item buttonColor='#9b59b6' title={"Save"} onPress={() => this.props.postSave(postId)}>
                                <Icon name={"bookmark-plus"} type='material-community' iconStyle={styles.actionButtonIcon} />
                            </ActionButton.Item>
                        }
                        <ActionButton.Item buttonColor='#3498db' title="Comment" onPress={() => { this.setState({ isVisible: true }) }}>
                            <Icon name="comment" type='font-awesome' iconStyle={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#1abc9c' title="Share" onPress={() => this.sharePost(postId, post.title, post.details)}>
                            <Icon name="share-variant" type='material-community' iconStyle={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                }
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});