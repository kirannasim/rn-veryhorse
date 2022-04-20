import React from 'react';
import {View,StyleSheet,Image,TouchableOpacity,Text,Linking,Platform} from 'react-native';
import PageService from '../service/service';
import PageContainer from '../components/PageContainer';
import SlideShow from 'react-native-image-slider-show';
import HTML from 'react-native-render-html';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import connect from '../components/connectedcomponent';
class HotelDetail extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            spinner:true,
            hoteldetail:false,
            sliderdata:[]
        }
    }

    componentDidMount()
    {
        let hotel = this.props.navigation.state.params.hotel;
        let pageservice = new PageService();
        let self = this;
        const {intlData} = this.props;
        pageservice.gethoteldetail(hotel,intlData.locale).then(data=>{
            console.log(data);
            let sliderdata = [];
            for(let item in data.photos)
            {
                sliderdata.push({
                    title:null,
                    caption:null,
                    url:data.photos[item]
                })
            }
            self.setState({
                hoteldetail:data,
                sliderdata:sliderdata,
                spinner:false
            })
        })
    }

    callphone = (prefix,number) => {
        let clearPhoneNmber = 'tel:+' + ("" + prefix).replace(/([\D\+\-\s]+)/g, '') + ("" + number).replace(/([\D\+\-\s]+)/g, '');
        clearPhoneNmber = clearPhoneNmber.replace(' ', '').replace(/[\s]+/g, '');
        Linking.openURL(clearPhoneNmber);
    }

    showroute = () => {
        let destination = this.state.hoteldetail.latitude + "," + this.state.hoteldetail.longitude;
        if(Platform.OS == "ios")
        {
            Linking.openURL("maps://?q=" + destination);
        }
        else
        {
            let label = encodeURI(this.state.hoteldetail.name);
            Linking.openURL('geo:0,0?q=' + destination + '(' + label + ')');
        }
    }

    isset = (text) => {
        return text?true:false;
    }
    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer {...this.props} bannerenable={true} backenable={true}>
                <Spinner visible={this.state.spinner} textContent={'Loading ... '} textStyle={style.textspinner}></Spinner>
                <View style={style.container}>
                    <View style={style.header}>
                        <Text style={style.headertitle}>{this.state.hoteldetail.name}</Text>
                        <Text style={style.description}>{this.state.hoteldetail.address}</Text>
                    </View>
                    {
                        this.state.sliderdata.length > 0 && (
                            <SlideShow dataSource={this.state.sliderdata} indicatorSize={20} indicatorColor="#A46A0080" indicatorSelectedColor="#A46A00FF"></SlideShow>
                        )
                    }
                    {
                        this.state.sliderdata.length == 0 && (
                            <Image source={{uri:this.state.hoteldetail.cover_photo}} style={{width:wp('100%')-10,height:hp('20%')}}></Image>
                        )
                    }
                    <View style={style.desc_content}>
                        <HTML html={this.state.hoteldetail.description}></HTML>
                    </View>
                    <View style={style.section}>
                        <Text style={style.description}>{intlData.messages['SERVICES']}</Text>
                        <View style={style.desc_content}>
                            <HTML html={this.state.hoteldetail.services}></HTML>
                        </View>
                    </View>
                    <View style={style.section}>
                        <Text style={style.description}>{intlData.messages['PRICES']}</Text>
                        <View style={style.desc_content}>
                            <HTML html={this.state.hoteldetail.prices}></HTML>
                        </View>
                    </View>
                    <View style={style.section}>
                        <Text style={style.description}>{intlData.messages['CONTACTO']}</Text>
                        <View style={style.desc_content}>
                            <View style={style.buttoncontainer}>
                                {
                                    this.isset(this.state.hoteldetail.email) && (
                                        <TouchableOpacity style={style.button} onPress={()=>Linking.openURL("mailto:" + this.state.hoteldetail.email)}>
                                            <Image source={require('../assets/imgs/icons/icon_email.png')} style={style.button}></Image>
                                        </TouchableOpacity>
                                    )
                                }
                                {
                                    this.isset(this.state.hoteldetail.web) && (
                                        <TouchableOpacity style={style.button} onPress={()=>Linking.openURL(this.state.hoteldetail.web)}>
                                            <Image source={require('../assets/imgs/icons/icon_web.png')} style={style.button}></Image>
                                        </TouchableOpacity>
                                    )
                                }
                                {
                                    this.isset(this.state.hoteldetail.facebook) && (
                                        <TouchableOpacity style={style.button} onPress={()=>Linking.openURL(this.state.hoteldetail.facebook)}>
                                            <Image source={require('../assets/imgs/icons/icon_facebook.png')} style={style.button}></Image>
                                        </TouchableOpacity>
                                    )
                                }
                                {
                                    this.isset(this.state.hoteldetail.whatsapp) && (
                                        <TouchableOpacity style={style.button} onPress={()=>Linking.openURL(this.state.hoteldetail.whatsapp)}>
                                            <Image source={require('../assets/imgs/icons/icon_whatsapp.png')} style={style.button}></Image>
                                        </TouchableOpacity>
                                    )
                                }
                                {
                                    (this.isset(this.state.hoteldetail.prefix_fix) && this.isset(this.state.hoteldetail.phone_fix)) && (
                                        <TouchableOpacity style={style.button} onPress={()=>this.callphone(this.state.hoteldetail.prefix_fix,this.state.hoteldetail.phone_fix)}>
                                            <Image source={require('../assets/imgs/icons/icon_phone.png')} style={style.button}></Image>
                                        </TouchableOpacity>
                                    )
                                }
                                {
                                    this.isset(this.state.hoteldetail.prefix_mob) && (
                                        <TouchableOpacity style={style.button} onPress={()=>this.callphone(this.state.hoteldetail.prefix_mob,this.state.hoteldetail.phone_mob)}>
                                            <Image source={require('../assets/imgs/icons/icon_mobile.png')} style={style.button}></Image>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                            {
                                (this.state.hoteldetail.latitude != '' && this.state.hoteldetail.longitude != '') && (
                                    <TouchableOpacity style={style.contact_btn} onPress={()=>this.showroute()}>
                                        <Text style={style.contact_text}>{intlData.messages['SHOW_ROUTE']}</Text>
                                    </TouchableOpacity>
                                )
                            }
                            
                        </View>
                    </View>
                </View>
               
            </PageContainer>            
        )
    }
}

const style = StyleSheet.create({
    container:{
        padding:5,
        paddingBottom:20
    },
    header:{
        padding:hp('1%'),
        backgroundColor:'#605e00'
    },
    headertitle:{
        color:'white',
        fontSize:hp('2.5%'),
        fontWeight:'bold'
    },
    description:{
        color:'white',
        fontSize:hp('2%')
    },
    desc_content:{
        paddingLeft:wp('2%'),
        paddingTop:hp('2%'),
        paddingBottom:hp('2%'),
        paddingRight:wp('2%'),
        backgroundColor:'white'
    }, 
    section:{
        marginTop:hp('1%')
    },
    descriptiontitle:{
        color:'white',
        fontSize:hp('2%'),
        textTransform:'uppercase'
    },
    buttoncontainer:{
        flexDirection:'row',
        justifyContent:'center'
    },
    button:{
        width:hp('5%'),
        height:hp('5%'),
        marginRight:wp('1%')
    },
    textspinner:{
        color:'white'
    },
    contact_btn:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#D9544C',
        padding:5,
        margin:10,
        borderRadius:5
    },
    contact_text:{
        color:'white',
        fontSize:hp('2.5%')
    }
})

export default connect(HotelDetail);