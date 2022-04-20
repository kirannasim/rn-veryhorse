import React from 'react';
import {View,StyleSheet,TouchableOpacity,Text,Image} from 'react-native';
import connect from '../components/connectedcomponent';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Moment from 'moment';
import PageContainer from '../components/PageContainer';
import Service from '../service/service';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents } from 'react-navigation';
class MyDemand extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data:[],
            tab:"pending",
            spinner:true
        }
    }

    getinformation = (state) => {
        let service = new Service();
        let self = this;
        service.getdemand(state).then(result=>{
            self.setState({
                data:result,
                tab:state,
                spinner:false
            })
        })
    }  

    settab = (tab) => {
        this.setState({
            spinner:true
        })
        this.getinformation(tab);
    }
    

    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer {...this.props} bannerenable={true}>
                <NavigationEvents
                    onDidFocus={() => this.getinformation("pending")}
                />
                <Spinner visible={this.state.spinner} textContent="Loading ..." textStyle={{color:'white'}}></Spinner>
                <View style={style.container}>
                    <View style={style.tab}>
                        <TouchableOpacity style={this.state.tab == 'pending'?style.tabitemactive:style.tabiteminactive} onPress={()=>this.settab("pending")}>
                            <Text style={this.state.tab == 'pending'?style.tabtext:style.tabinactivetext}>{intlData.messages['PENDIENTE']}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.tab== 'confirmed'?style.tabitemactive:style.tabiteminactive} onPress={()=>this.settab("confirmed")}>
                            <Text style={this.state.tab == 'confirmed'?style.tabtext:style.tabinactivetext}>{intlData.messages['CONFIRMADAS']}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1}}>
                        {
                            this.state.data.map((row,index)=>{
                                return (
                                    <TouchableOpacity key={index} style={style.contentitem} onPress={()=>this.props.navigation.navigate('MYDEMANDITEM',{id:row.id})}>
                                        <View style={{flexDirection:'row'}}>
                                            <View style={{flex:1}}>
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Image source={{uri:'https://www.countryflags.io/' + row.pickCountry.toLowerCase() + '/flat/64.png'}} style={style.flagimage}></Image>    
                                                    <Text style={{marginLeft:10}}>{row.pickCityName}</Text>
                                                    <Text> > </Text>
                                                    <Image source={{uri:'https://www.countryflags.io/' + row.deliverCountry.toLowerCase() + '/flat/64.png'}} style={style.flagimage}></Image>
                                                    <Text style={{marginLeft:10}}>{row.deliverCityName}</Text>
                                                </View>
                                                <Text>Recogida: {Moment(new Date(row.pickDayIni)).format('DD-MMM')} - Entrega: {Moment(new Date(row.deliverDayIni)).format('DD-MMM')}</Text>
                                            </View>
                                            {
                                                row.count > 0 && (
                                                    <View style={{width:wp('10%'),justifyContent:'center'}}>
                                                        <TouchableOpacity style={style.badge}>
                                                            <Text style={{color:'white',textAlign:'center'}}>{row.count}</Text>
                                                        </TouchableOpacity>
                                                    </View>    
                                                )
                                            }
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        {
                            this.state.data.length == 0 && (
                                <TouchableOpacity style={style.contentitem}>
                                    <Text style={{textAlign:'center'}}>{intlData.messages['NO_RESUL']}</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        marginTop:hp('2%'),
        marginBottom:hp('2%')
    },
    tab:{
        flexDirection:'row'
    },
    tabitemactive:{
        flex:1,
        backgroundColor:'#dd691b',
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%')
    },
    tabiteminactive:{
        flex:1,
        backgroundColor:'#E3DFB9',
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%')
    },
    tabtext:{
        fontSize:hp('2.3%'),
        color:'white',
        textAlign:'center'
    },
    tabinactivetext:{
        fontSize:hp('2.3%'),
        textAlign:'center'
    },
    contentitem:{
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
        paddingLeft:wp('2%'),
        backgroundColor:'white',
        marginBottom:1
    },
    flagimage:{
        width:hp('3%'),
        height:hp('3%')
    },
    badge:{
        borderRadius:wp('2.5%'),
        width:wp('5%'),
        height:wp('5%'),
        backgroundColor:'red',
        justifyContent:'center'
    }
})

export default connect(MyDemand);