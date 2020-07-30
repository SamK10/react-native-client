import React, { Component } from 'react';
import { ScrollView, Text, Linking, View } from 'react-native';
import { Card, Icon, Avatar } from 'react-native-elements';
import { baseUrl } from '../shared/baseurl';

function History() {
    return (
        <Card
            containerStyle={{ marginTop: 100, elevation: 5 }}
        >
            <Avatar
                rounded
                source={{
                    uri:
                        baseUrl + 'images/logo.jpg'
                }}
                size='xlarge'
                containerStyle={{ alignSelf: 'center', marginTop: -100, borderWidth: 0.5 }}
            />
            <Text style={{ margin: 10 }}>This App was created for the benefit of the KGPian community</Text>
        </Card>
    )
}

class About extends Component {
    render() {
        return (
            <ScrollView>
                <History />
                <Card
                    title='Contact Us'
                    containerStyle={{ elevation: 5 }}
                >
                    <Text style={{ margin: 5, fontWeight: 'bold', fontSize: 16 }}>Samir Kumar</Text>
                    <Text style={{ margin: 5 }}>Indian Institute of Technology, Kharagpur</Text>
                    <Text style={{ margin: 5 }}>Mobile: +91 86976 67650</Text>
                    <Text style={{ margin: 5 }}>Whatsapp: +91 8697667650</Text>
                    <Text style={{ margin: 5 }}>LinkedIn: samir-kumar-1a0b42190</Text>
                    <Text style={{ margin: 5 }}>Email: sk66215@gmail.com</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Icon
                            raised
                            reverse
                            name='google'
                            type='font-awesome'
                            color='#D44638'
                            onPress={() => Linking.openURL('mailto:sk66215@gmail.com?subject=Feedback&body=Hi Samir,\n')}
                            size={16}
                        />
                        <Icon
                            raised
                            reverse
                            name='facebook'
                            type='font-awesome'
                            color='#3B5998'
                            onPress={() => Linking.openURL('https://www.messenger.com/t/samk1003')}
                            size={16}
                        />
                        <Icon
                            raised
                            reverse
                            name='linkedin'
                            type='font-awesome'
                            color='#0e76a8'
                            onPress={() => Linking.openURL('https://www.linkedin.com/in/samir-kumar-1a0b42190')}
                            size={16}
                        />
                        <Icon
                            raised
                            reverse
                            name='whatsapp'
                            type='font-awesome'
                            color='#25D366'
                            onPress={() => Linking.openURL('whatsapp://send?text=Hello&phone=918697667650')}
                            size={16}
                        />
                    </View>
                </Card>
            </ScrollView>
        );
    }
}

export default About;