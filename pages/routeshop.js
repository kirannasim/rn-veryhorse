import React from 'react';
import {StyleSheet,View,Image,TouchableHighlight,Text,ScrollView,TouchableOpacity} from 'react-native';
import MapView,{Marker,Callout} from 'react-native-maps';
import PageContainer from '../components/PageContainer';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import PageService from '../service/service';
import AutoHeightImage from 'react-native-auto-height-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import connect from '../components/connectedcomponent';
class RouteShop extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            banner:null,
            center:null,
            hoteldata:{},
            possitiverate:0,
            spinner:true
        }
    }

    componentDidMount()
    {
        const {intlData} = this.props;
        var pageservice = new PageService();
        let self = this;
       
        pageservice.getdata(intlData.locale).then(data => {
            let center = {
                latitude:data.center.lat,
                longitude:data.center.long,
                latitudeDelta: 50,
                longitudeDelta: 50,
            }

            self.setState({
                center:center,
                hoteldata:data.hoteldata,
                spinner:false
            })
        })
    }

    pressed = (id) => {
        this.props.navigation.navigate('HotelDetail',{hotel:id});
    }

    setpositive = () => {
        let positive = 1 - this.state.possitiverate;
        this.setState({
            possitiverate:positive
        })
    }
    
    render()
    {
        const {intlData} = this.props;
        return (
            <View style={{flex:1}}>
                <PageContainer {...this.props} bannerenable={true} title={intlData.messages['HOTELS']}>                
                    <MapView 
                        style={style.container}
                        initialRegion={this.state.center}
                        zoomEnabled={true}
                        zoomControlEnabled={true}
                        showsCompass={true}
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        toolbarEnabled={true}
                    >
                        
                        {
                            Object.keys(this.state.hoteldata).map((value,index)=>{
                                if(this.state.hoteldata[value].five_stars >= this.state.possitiverate)
                                {
                                    return (
                                        <Marker 
                                            key={index}
                                            title={this.state.hoteldata[value].name}
                                            coordinate={{latitude:parseFloat(this.state.hoteldata[value].latitude),longitude:parseFloat(this.state.hoteldata[value].longitude),latitudeDelta:0,longitudeDelta:0}}
                                            
                                        >
                                            <AutoHeightImage source= {parseInt(this.state.hoteldata[value].five_stars) > 0?require('../assets/imgs/icons/map_green.png'):require('../assets/imgs/icons/map_orange.png')} width={20}></AutoHeightImage>
                                            <Callout onPress={()=>this.pressed(this.state.hoteldata[value].id)}>
                                                <ScrollView style={style.locationcontainer}>
                                                    <Text style={style.locationtitle}>{this.state.hoteldata[value].name}</Text>
                                                    <Text style={style.locationdescription}>{this.state.hoteldata[value].address}, {this.state.hoteldata[value].city}, {this.state.hoteldata[value].country_name}</Text>
                                                    <TouchableHighlight style={style.more_detail} onPress={()=>this.pressed()}>
                                                        <Text style={style.more_text}>{intlData.messages['VIEW_DETAILS']}</Text>
                                                    </TouchableHighlight>
                                                </ScrollView>
                                            </Callout>
                                        </Marker>
                                    )
                                }
                            })
                        }
                    </MapView>
                    <View style={style.action_btn}>
                        <TouchableOpacity style={style.hotellist} onPress={()=>this.props.navigation.navigate('HotelList')}>
                            <View style={style.hotelcontainer}>
                                <Ionicons name="md-list" style={style.icon}></Ionicons>
                                <Text style={style.hotellisttext}>
                                    {intlData.messages['VIEW_LIST']}
                                </Text>
                            </View>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={style.ratelist} onPress={this.setpositive}>
                            <View style={style.hotelcontainer}>
                                <Ionicons name="md-star" style={this.state.possitiverate == 0?style.icon_star_inactive:style.icon_star_active}></Ionicons>
                                <Ionicons name="md-star" style={this.state.possitiverate == 0?style.icon_star_inactive:style.icon_star_active}></Ionicons>
                                <Ionicons name="md-star" style={this.state.possitiverate == 0?style.icon_star_inactive:style.icon_star_active}></Ionicons>
                                <Ionicons name="md-star" style={this.state.possitiverate == 0?style.icon_star_inactive:style.icon_star_active}></Ionicons>
                                <Ionicons name="md-star" style={this.state.possitiverate == 0?style.icon_star_inactive:style.icon_star_active}></Ionicons>
                            </View>      
                        </TouchableOpacity>
                    </View>
                </PageContainer>
            </View>
            
        )
        
    }
}


const style = StyleSheet.create({
    container:{
        width:wp('100%'),
        height:hp('74%')
    },
    spinnerText:{
        color:"#FFF"
    },
    banner:{
        width:wp('100%'),
        height:hp('16%'),
        resizeMode:'stretch'
    },
    locationtitle:{
        fontSize:hp('2%'),
        fontWeight:'bold'
    },
    locationdescription:{
        fontSize:hp('1.9%'),
        marginTop:hp('1%'),
        marginBottom:hp('1%')
    },
    more_detail:{
        width:wp('30%'),
        height:hp('5%'),
        backgroundColor:'red',
        borderRadius:hp('1%'),
        justifyContent:'center',
        alignItems:'center',
        zIndex:100
    },
    more_text:{
        color:'white',
        fontSize:hp('2%')
    },
    locationcontainer:{
        width:wp('70%'),
        height:hp('18%'),
        padding:5
    },
    action_btn:{
        position:'absolute',
        bottom:hp('5%'),
        flexDirection:'row',
        paddingLeft:wp('4%'),
        zIndex:10000
    },
    hotellist:{
        backgroundColor:'#EF463A',
        width:wp('35%'),
        height:hp('7%'),
        borderRadius:10
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
    },
    ratelist:{
        backgroundColor:'white',
        width:wp('35%'),
        height:hp('7%'),
        borderRadius:10,
        marginLeft:wp('2%')
    },
    icon_star_active:{
        marginRight:wp('1%'),
        color:'#FFD700',
        fontSize:hp('4%')
    },
    icon_star_inactive:{
        marginRight:wp('1%'),
        color:'grey',
        fontSize:hp('4%')
    }
})

export default connect(RouteShop);