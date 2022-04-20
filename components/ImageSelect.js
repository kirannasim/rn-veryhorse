import React from 'react';
import {View,StyleSheet,ImageBackground,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
class ImageSelect extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            active:false
        }
    }

    getselected = (id) =>{
        for(let item in this.props.images)
        {
            if(this.props.images[item].value == id)
            {
                return this.props.images[item];
            }
        }

        return false;
    }

    selectimage = (row) => {
        this.props.selectimage(row);
        this.setState({
            active:false
        })
    }

    render()
    {
        let selectedimage = this.getselected(this.props.value);
        console.log(this.props.value);
        return (
            <View style={{backgroundColor:'white',borderRadius:10}}>
                <TouchableOpacity style={style.container} onPress={()=>this.setState({active:!this.state.active})}>
                    <Icon name={this.state.active?"caret-up":"caret-down"} style={style.lefticon}></Icon>
                    {
                        selectedimage && (
                            <ImageBackground source={selectedimage.image} style={{width:'100%',height:hp('5%')}} resizeMode="contain" resizeMethod="resize"></ImageBackground>
                        )
                    }
                </TouchableOpacity>
                {
                    this.state.active && (
                        <View>
                            {
                                this.props.images.map((row,index)=>{
                                    return (
                                        <TouchableOpacity onPress={()=>this.selectimage(row)}>
                                            <ImageBackground source={row.image} style={style.listitem} imageStyle={{alignSelf:'flex-end',resizeMode:'contain'}}></ImageBackground>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    )
                }
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        height:hp('5%'),
        borderRadius:10,
        marginVertical:hp('1%')
    },
    lefticon:{
        position:'absolute',
        right:10,
        zIndex:100,
        top:hp('2%'),
        fontSize:hp('2.5%')
    },
    listitem:{
        width:'100%',
        height:hp('7%'),
        marginTop:1,
        backgroundColor:'lightblue',
        paddingVertical:hp('1%'),
    }
})
export default ImageSelect;