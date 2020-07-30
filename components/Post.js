import React, { Component } from 'react';
import { View, Modal, Dimensions, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Input, Icon, Text, Button, CheckBox, Avatar, Card, Image, Divider } from 'react-native-elements';
import { baseUrl } from '../shared/baseurl';
import { connect } from 'react-redux';
import { postPost } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        pages: state.pages,
        posts: state.posts
    }
}

const mapDispatchToProps = dispatch => ({
    postPost: (title, detail, avatar_url) => dispatch(postPost(title, detail, avatar_url))
})

class CreatePost extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            current_page: this.props.pages.pages.filter((page) => page.title === this.props.route.params.pageTitle)[0]
        };
    }

    reset = () => {
        this.setState({ text: '' });
    }

    render() {
        var date = new Date().toString();
        const page = this.props.pages.pages.filter((page) => page.title === this.props.route.params.pageTitle)[0];
        return (
            <ScrollView centerContent>
                <Card containerStyle={{ marginHorizontal: 0 }} >
                    <View style={{ marginBottom: 15, flexDirection: 'row', alignItems: 'center' }} >
                        <View>
                            <Avatar
                                rounded
                                source={{
                                    uri: baseUrl + this.state.current_page.src,
                                }}
                                size="small"
                            />
                        </View>
                        <View style={{ marginLeft: 10, width: 270 }}>
                            <Text style={{ fontSize: 14 }}>
                                <Text style={{ fontWeight: 'bold' }}>{this.state.current_page.title}</Text>
                            </Text>
                            <Text style={{ fontSize: 12, color: 'grey' }}>{date.substring(16, 21) + ', ' + date.substring(0, 15)}</Text>
                        </View>
                    </View>
                    <Divider />
                    <TextInput
                        style={{ borderRadius: 5, backgroundColor: '#EBECF0', padding: 15, marginVertical: 20 }}
                        multiline
                        placeholder="Write Here..."
                        placeholderTextColor="grey"
                        editable
                        onChangeText={(text) => this.setState({ text: text })}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginVertical: 20 }}>
                        {!this.props.posts.isLoading ? <Button
                            title="Post"
                            buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                            titleStyle={{ color: '#ADEFD1FF' }}
                            raised
                            onPress={() => { this.props.postPost(this.state.current_page.title, this.state.text, this.state.current_page.src); this.reset }}
                        /> : <ActivityIndicator />}
                    </View>
                </Card>
            </ScrollView>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);