import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Input, Icon, Button, Avatar, Card, Overlay } from 'react-native-elements';
import { baseUrl } from '../shared/baseurl';
import { connect } from 'react-redux';
import { loginUser, logoutUser, registerUser } from '../redux/ActionCreators';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import ActionSheet from 'react-native-zhb-actionsheet';

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    loginUser: (creds) => dispatch(loginUser(creds)),
    logoutUser: () => dispatch(logoutUser()),
    registerUser: (display_pic, firstname, lastname, username, password) => dispatch(registerUser(display_pic, firstname, lastname, username, password))
})

class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showOverlay: false,
            showActionSheet: false,
            user: '',
            pass: '',
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            display_pic: baseUrl + 'images/user_default.png'
        };
    }

    toggleOverlay() {
        this.setState({ showOverlay: !this.state.showOverlay });
    }

    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
            });
            if (!capturedImage.cancelled) {
                this.setState({ display_pic: capturedImage.uri });
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

    showActionSheet = () => {
        this.refs.picker.show();
    }

    render() {
        if (this.props.auth.isAuthenticated) {
            return (
                <View>
                    <Card containerStyle={{ marginTop: 120, marginHorizontal: 0, elevation: 5 }}>
                        <Avatar
                            rounded
                            source={{
                                uri: baseUrl + this.props.auth.user.display_pic
                            }}
                            size='xlarge'
                            containerStyle={{ marginTop: -80, alignSelf: 'center' }}
                            showEditButton
                        />
                        <Input
                            leftIcon={
                                <Icon
                                    name='quote-left'
                                    size={20}
                                    color='grey'
                                    type='font-awesome'
                                    style={{ marginRight: 5 }}
                                />
                            }
                            rightIcon={
                                <Icon
                                    name='quote-right'
                                    size={20}
                                    color='grey'
                                    type='font-awesome'
                                    style={{ marginLeft: 5 }}
                                />
                            }
                            disabled
                            value={this.props.auth.user.username}
                            containerStyle={{ marginTop: 20 }}
                            inputContainerStyle={{ marginHorizontal: 10 }}
                            inputStyle={{ textAlign: 'center', color: 'brown', fontWeight: 'bold', fontSize: 22 }}
                        />
                        <Input
                            disabled
                            value={this.props.auth.user.firstname + ' ' + this.props.auth.user.lastname}
                            containerStyle={{ marginTop: 20 }}
                            inputContainerStyle={{ marginHorizontal: 10 }}
                            inputStyle={{ textAlign: 'center', color: 'brown', fontWeight: 'bold' }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 30 }}>
                            {!this.props.auth.isLoading ? <Button
                                title="Sign Out"
                                buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                                titleStyle={{ color: '#ADEFD1FF' }}
                                raised
                                onPress={() => this.props.logoutUser()}
                            /> : <ActivityIndicator />}
                        </View>
                    </Card>
                </View>
            )
        }
        else
            return (
                <ScrollView justifyContent='center'>
                    <Card title='SIGN IN' containerStyle={{ elevation: 5 }}>
                        <Input
                            placeholder='Username'
                            leftIcon={
                                <Icon
                                    name='user'
                                    size={24}
                                    color='grey'
                                    type='font-awesome'
                                    style={{ marginRight: 5 }}
                                />
                            }
                            autoCapitalize='none'
                            onChangeText={(user) => this.setState({ user: user })}
                            value={this.state.user}
                            containerStyle={{ marginTop: 20 }}
                        />
                        <Input
                            placeholder='Password'
                            secureTextEntry={true}
                            leftIcon={
                                <Icon
                                    name='lock'
                                    size={24}
                                    color='grey'
                                    type='font-awesome'
                                    style={{ marginRight: 5 }}
                                />
                            }
                            autoCapitalize='none'
                            onChangeText={(pass) => this.setState({ pass: pass })}
                            value={this.state.pass}
                            containerStyle={{ marginVertical: 20 }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            {!this.props.auth.isLoading ?
                                <>
                                    <Button
                                        title="Sign In"
                                        buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                                        titleStyle={{ color: '#ADEFD1FF' }}
                                        raised
                                        onPress={() => this.props.loginUser({ username: this.state.user, password: this.state.pass })}
                                    />
                                    <Button
                                        title="Sign Up"
                                        buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                                        titleStyle={{ color: '#ADEFD1FF' }}
                                        raised
                                        onPress={() => this.toggleOverlay()}
                                    />
                                </>
                                : <ActivityIndicator />
                            }
                        </View>
                        <Overlay
                            animationType={'slide'}
                            transparent={true}
                            isVisible={this.state.showOverlay}
                            onBackdropPress={() => this.setState({ showOverlay: false })}
                        >
                            <View style={{ width: 300, marginHorizontal: 0, paddingHorizontal: 10 }}>
                                <Avatar
                                    rounded
                                    source={{
                                        uri: this.state.display_pic
                                    }}
                                    size={100}
                                    containerStyle={{ marginTop: -60, alignSelf: 'center', borderWidth: 0.5 }}
                                    onPress={this.showActionSheet}
                                />
                                <Input
                                    placeholder='Firstname'
                                    leftIcon={
                                        <Icon
                                            name='quote-left'
                                            size={24}
                                            color='grey'
                                            type='font-awesome'
                                            style={{ marginRight: 5 }}
                                        />
                                    }
                                    onChangeText={(firstname) => this.setState({ firstname: firstname })}
                                    value={this.state.firstname}
                                    containerStyle={{ marginTop: 10 }}
                                />
                                <Input
                                    placeholder='Lastname'
                                    rightIcon={
                                        <Icon
                                            name='quote-right'
                                            size={24}
                                            color='grey'
                                            type='font-awesome'
                                            style={{ marginLeft: 5 }}
                                        />
                                    }
                                    onChangeText={(lastname) => this.setState({ lastname: lastname })}
                                    value={this.state.lastname}
                                    containerStyle={{ marginTop: 10 }}
                                />
                                <Input
                                    placeholder='Username (unique)'
                                    leftIcon={
                                        <Icon
                                            name='user'
                                            size={24}
                                            color='grey'
                                            type='font-awesome'
                                            style={{ marginRight: 5 }}
                                        />
                                    }
                                    autoCapitalize='none'
                                    onChangeText={(username) => this.setState({ username: username })}
                                    value={this.state.username}
                                    containerStyle={{ marginTop: 10 }}
                                />
                                <Input
                                    placeholder='Enter Password'
                                    secureTextEntry={true}
                                    leftIcon={
                                        <Icon
                                            name='key'
                                            size={24}
                                            color='grey'
                                            type='font-awesome'
                                            style={{ marginRight: 5 }}
                                        />
                                    }
                                    autoCapitalize='none'
                                    onChangeText={(password) => this.setState({ password: password })}
                                    value={this.state.password}
                                    containerStyle={{ marginVertical: 10 }}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 }}>
                                    {!this.props.auth.isLoading ? <>
                                        <Button
                                            title="Submit"
                                            buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                                            titleStyle={{ color: '#ADEFD1FF' }}
                                            raised
                                            onPress={() => this.props.registerUser(this.state.display_pic, this.state.firstname, this.state.lastname, this.state.username, this.state.password)}
                                        />
                                        <Button
                                            title="Cancel"
                                            buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                                            titleStyle={{ color: '#ADEFD1FF' }}
                                            raised
                                            onPress={() => this.toggleOverlay()}
                                        />
                                    </>
                                        :
                                        <ActivityIndicator />
                                    }
                                </View>
                                <ActionSheet
                                    ref="picker"
                                    titles={
                                        [
                                            { title: 'Camera', action: this.getImageFromCamera },
                                            { title: 'Choose from Album', action: this.getImageFromGallery },
                                            { title: 'Cancel', actionStyle: 'cancel' }
                                        ]
                                    }
                                    separateHeight={3}
                                    separateColor="#dddddd"
                                    backgroundColor="rgba(0, 0, 0, 0.3)"
                                    containerStyle={{ margin: 5, borderRadius: 5 }}
                                />
                            </View>
                        </Overlay>
                    </Card>
                </ScrollView>
            )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);