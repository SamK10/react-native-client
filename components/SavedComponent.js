import React, { Component } from 'react';
import { View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Card, Divider, Button, Text, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchSaves } from '../redux/ActionCreators';
import { baseUrl } from '../shared/baseurl';

const mapStateToProps = state => {
    return {
        auth: state.auth,
        saves: state.saves
    }
}

const mapDispatchToProps = dispatch => ({
    fetchSaves: () => dispatch(fetchSaves())
})

class Saved extends Component {

    renderSavedPost = ({ item, index }) => {
        var date = new Date(item.createdAt).toString();
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
        );
    }

    render() {
        return (
            <FlatList
                data={this.props.saves.saves !== null ? this.props.saves.saves.posts : null}
                renderItem={this.renderSavedPost}
                style={{ marginBottom: 10 }}
                keyExtractor={item => item._id}
                refreshing={this.props.saves.isLoading}
                onRefresh={() => { this.props.fetchSaves() }}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Saved);