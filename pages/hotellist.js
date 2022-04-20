import React from 'react';
import {View,StyleSheet,ImageBackground,Text,TouchableOpacity,Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import PageContainer from '../components/PageContainer';
import PageService from '../service/service';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';

import HTML from 'react-native-render-html';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import connect from '../components/connectedcomponent';

class HotelList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            spinner:true,
            banner:null,
            hotellist:{}
        }
    }

    componentDidMount()
    {
        const {intlData} = this.props;
        let self = this;
        let pageservice = new PageService();

        pageservice.getfullhotellist(intlData.locale).then(hoteldata=>{
            self.setState({
                hotellist:hoteldata,
                spinner:false
            })
        })
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <View style={{flex:1}}>
                <Spinner visible={this.state.spinner} textContent={'Loading ... '} textStyle={style.textspinner}></Spinner>
                <PageContainer {...this.props} backenable={true} back="RouteShop" title={intlData.messages['HOTELS']} bannerenable = {true}>
                    <View style={style.container}>
                        <View style={{flex:1}}>
                        {
                            Object.keys(this.state.hotellist).map((value,index)=>{
                                let flagicon = 'https://www.countryflags.io/' + this.state.hotellist[value].country.toLowerCase() + '/flat/64.png';
                                return (
                                    <TouchableOpacity style={style.contentcontainer} key={index} onPress={()=>this.props.navigation.navigate('HotelDetail',{hotel:this.state.hotellist[value].id})}>
                                        <View style={style.header}>
                                            <Text style={style.title}>{this.state.hotellist[value].name}</Text>
                                            {
                                                this.state.hotellist[value].distance != "" && (
                                                    <View>
                                                        <Text style={style.distance}>{this.state.hotellist[value].distance}</Text>
                                                    </View>       
                                                )
                                            }
                                            <View style={style.address}>
                                                <Text style={style.distance}>{this.state.hotellist[value].address}</Text>
                                                <View>
                                                {
                                                    this.state.hotellist[value].country && (
                                                        <Image source={{uri:flagicon}} style={{width:30,height:20}}></Image>
                                                    )
                                                }
                                                </View>
                                                <View style={{marginLeft:wp('1%')}}>
                                                    <Text style={style.distance}>{this.state.hotellist[value].city}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:1}}>
                                            <ImageBackground style={{width:'100%',height:hp('20%')}} source={{uri:this.state.hotellist[value].cover_photo}}></ImageBackground>
                                        </View>
                                        
                                        <View style={style.description}>
                                            <HTML html={this.state.hotellist[value].description}></HTML>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        </View>
                    </View>
                </PageContainer>
                <View style={style.action_btn}>
                    <TouchableOpacity style={style.hotellist} onPress={()=>this.props.navigation.navigate('RouteShop')}>
                        <View style={style.hotelcontainer}>
                            <Ionicons name="ios-map" style={style.icon}></Ionicons>
                            <Text style={style.hotellisttext}>
                                {intlData.messages['VIEW_MAP']}
                            </Text>
                        </View>
                        
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        paddingLeft:wp('2%'),
        paddingRight:wp('2%'),
        marginTop:hp('2%')
    },
    textspinner:{
        color:'white'
    },
    banner:{
        width:wp('96%'),
        height:hp('16%'),
        resizeMode:'stretch',
        marginBottom:hp('2%')
    },
    contentimage:{
        width:wp('100%'),
        height:hp('20%'),
        resizeMode:'stretch'
    },
    header:{
        padding:hp('1%'),
        backgroundColor:'#605e00'
    },
    title:{
        color:'white',
        fontSize:hp('2.5%'),
        fontWeight:'bold'
    },
    distance:{
        color:'white',
        fontSize:hp('2%')
    },
    address:{
        flexDirection:'row',
        flexWrap:'wrap'
    },
    city:{
        fontSize:hp('2%'),
        color:'white',
        marginLeft:wp('1%')
    },
    description:{
        backgroundColor:'white',
        padding:10
    },
    contentcontainer:{
        flex:1,
        marginTop:hp('2%')
    },
    action_btn:{
        position:'absolute',
        bottom:hp('7%'),
        flexDirection:'row',
        paddingLeft:wp('4%'),
        zIndex:10000
    },
    hotellist:{
        backgroundColor:'#EF463A',
        height:hp('7%'),
        borderRadius:10,
        display:'flex',
        paddingLeft:wp('3%'),
        paddingRight:wp('3%')
    },
    hotellisttext:{
        color:'white',
        fontSize:hp('2.3%'),
        alignItems:'center'
    },
    icon:{
        fontSize:hp('4%'),
        marginRight:wp('2%'),
        color:'white'
    },
    hotelcontainer:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        flex:1
    }
    
})
export default connect(HotelList);