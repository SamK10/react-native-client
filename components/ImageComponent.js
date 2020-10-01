import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Image } from 'react-native-elements';

class ImageView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Image
                source={{ uri: this.props.route.params.uri }}
                resizeMode='contain'
                containerStyle={{ backgroundColor: '#121212' }}
                style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height - 120 }}
            />
        )
    }
}

export default ImageView;