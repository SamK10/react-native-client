import React, { Component } from 'react';
import { View, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Input, Icon, Card } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { connect } from 'react-redux';
import { postEvent } from '../redux/ActionCreators';
import { baseUrl } from '../shared/baseurl';

const mapStateToProps = state => {
    return {
        pages: state.pages,
        events: state.events
    }
}

const mapDispatchToProps = dispatch => ({
    postEvent: (src, title, date, location) => dispatch(postEvent(src, title, date, location))
})

class CreateEvent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            eventTitle: '',
            dateShow: false,
            timeShow: false,
            date: '',
            time: '',
            location: '',
        }
    }

    submitEvent(src, title, time, date, location) {
        const dateTime = time + ' ' + date;
        this.props.postEvent(src, title, dateTime, location);
    }

    render() {
        const page = this.props.pages.pages.filter((page) => page.title === this.props.route.params.pageTitle)[0];
        return (
            <Card
                containerStyle={{ marginHorizontal: 0 }}
                image={{ uri: baseUrl + page.src }}
            >
                <Input
                    placeholder='Event'
                    leftIcon={
                        <Icon
                            name='event-seat'
                            size={24}
                            color='grey'
                            type='material'
                            style={{ marginRight: 5 }}
                        />
                    }
                    autoCapitalize='words'
                    onChangeText={(eventTitle) => this.setState({ eventTitle: eventTitle })}
                    value={this.state.eventTitle}
                />
                <Input
                    placeholder='Location'
                    leftIcon={
                        <Icon
                            name='location'
                            size={24}
                            color='grey'
                            type='entypo'
                            style={{ marginRight: 5 }}
                        />
                    }
                    autoCapitalize='words'
                    onChangeText={(location) => this.setState({ location: location })}
                    value={this.state.location}
                />
                {this.state.dateShow &&
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={Date.now()}
                        minimumDate={Date.now()}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={(event, date) => this.setState({ date: date.toString(), dateShow: false })}
                    />
                }
                {this.state.timeShow &&
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={Date.now()}
                        minimumDate={Date.now()}
                        mode={'time'}
                        is24Hour={true}
                        display="default"
                        onChange={(event, time) => this.setState({ time: time.toString(), timeShow: false })}
                    />
                }
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 }}>
                    <Button
                        title="Pick Time"
                        buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                        titleStyle={{ color: '#ADEFD1FF' }}
                        raised
                        onPress={() => this.setState({ timeShow: true })}
                    />
                    <Button
                        title="Pick Date"
                        buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                        titleStyle={{ color: '#ADEFD1FF' }}
                        raised
                        onPress={() => { this.setState({ dateShow: true }) }}
                    />
                </View>
                <TextInput
                    style={{ borderRadius: 5, backgroundColor: '#EBECF0', padding: 15, marginVertical: 10 }}
                    placeholderTextColor="grey"
                    value={this.state.time.slice(16, 21) + ' ' + this.state.date.slice(0, 15)}
                    editable={false}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 }}>
                    {!this.props.events.isLoading ? <Button
                        title="Create"
                        buttonStyle={{ backgroundColor: '#00203FFF', width: 100 }}
                        titleStyle={{ color: '#ADEFD1FF' }}
                        raised
                        onPress={() => { this.submitEvent(page.src, this.state.eventTitle, this.state.time.slice(16, 21), this.state.date.slice(0, 15), this.state.location) }}
                    /> : <ActivityIndicator />}
                </View>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);