import React, { Component } from 'react';
import { View, Modal, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Input, Icon, Text, Button, CheckBox, Avatar, Card, Image } from 'react-native-elements';
import { baseUrl } from '../shared/baseurl';
import { connect } from 'react-redux';
import { postPage } from '../redux/ActionCreators';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import ActionSheet from 'react-native-zhb-actionsheet';

const mapStateToProps = state => {
    return {
        pages: state.pages
    }
}

const mapDispatchToProps = dispatch => ({
    postPage: (cover_url, src, title) => dispatch(postPage(cover_url, src, title))
})

class CreatePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showActionSheet: false,
            title: '',
            display_pic: baseUrl + 'images/page_display.png',
            cover_pic: baseUrl + 'images/page_cover.jpeg'
        };
    }

    showActionSheet = () => {
        this.refs.picker.show();
    }

    getCoverFromGallery = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            let pickedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 1,
            });
            if (!pickedImage.cancelled) {
                this.setState({ cover_pic: pickedImage.uri });
            }
        }

    }

    getImageFromGallery = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            let pickedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            if (!pickedImage.cancelled) {
                this.setState({ display_pic: pickedImage.uri });
            }
        }
    }

    render() {
        return (
            <View>
                <Card containerStyle={{ padding: 0, elevation: 5 }}>
                    <Image
                        source={{ uri: this.state.cover_pic }}
                        style={{ height: 200 }}
                        containerStyle={{ backgroundColor: '#000', borderBottomWidth: 0.5 }}
                        resizeMode='cover'
                    />
                    <Avatar
                        rounded
                        source={{
                            uri: this.state.display_pic
                        }}
                        size={150}
                        containerStyle={{ alignSelf: 'center', marginTop: -70, borderWidth: 0.5, backgroundColor: '#fff' }}
                    />
                    <Icon
                        name='edit'
                        raised
                        reverse
                        containerStyle={{ position: 'absolute', top: 0, right: 0 }}
                        color='grey'
                        size={18}
                        onPress={this.showActionSheet}
                    />
                    <Input
                        placeholder='New Page'
                        leftIcon={
                            <Icon
                                name='quote-left'
                                size={24}
                                color='grey'
                                type='font-awesome'
                                style={{ marginRight: 5 }}
                            />
                        }
                        rightIcon={
                            <Icon
                                name='quote-right'
                                size={24}
                                color='grey'
                                type='font-awesome'
                                style={{ marginLeft: 5 }}
                            />
                        }
                        onChangeText={(title) => this.setState({ title: title })}
                        value={this.state.title}
                        containerStyle={{ marginTop: 20 }}
                        inputContainerStyle={{ marginHorizontal: 10 }}
                        inputStyle={{ textAlign: 'center' }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginVertical: 20 }}>
                        {!this.props.pages.isLoading ? <Button
                            title="Create"
                            buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                            titleStyle={{ color: '#ADEFD1FF' }}
                            raised
                            onPress={() => { this.props.postPage(this.state.cover_pic, this.state.display_pic, this.state.title); }}
                        /> : <ActivityIndicator />}
                    </View>
                    <ActionSheet
                        ref="picker"
                        titles={
                            [
                                { title: 'Cover Photo', action: this.getCoverFromGallery },
                                { title: 'Profile Pic', action: this.getImageFromGallery },
                                { title: 'Cancel', actionStyle: 'cancel' }
                            ]
                        }
                        separateHeight={3}
                        separateColor="#dddddd"
                        backgroundColor="rgba(0, 0, 0, 0.3)"
                        containerStyle={{ margin: 10, borderRadius: 5 }}
                    />
                </Card>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePage);