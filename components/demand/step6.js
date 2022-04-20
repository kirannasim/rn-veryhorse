import React from 'react';
import {View,StyleSheet,Text} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';

class Step6 extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <View style={style.container}>
                <Text style={style.title}>{intlData.messages['DEMANDA2']}</Text>
                <Text style={style.description}>{intlData.messages['DEMANDA3']}</Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    title:{
        fontSize:hp('2.5%'),
        fontWeight:'bold',
        color:'white'
    },
    description:{
        fontSize:hp('2.3%'),
        color:'white',
        marginTop:hp('4%')
    }
})

export default Step6;
