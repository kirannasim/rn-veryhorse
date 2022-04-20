import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity,AsyncStorage} from 'react-native';
import PageService from '../service/service';
import config from '../config/config';
import PageContainer from '../components/PageContainer';
import MapView,{Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoding from 'react-native-geocoding';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import connect from '../components/connectedcomponent';
import Moment from 'moment';
import Modal,{ModalTitle,ModalContent,ModalButton,ModalFooter} from 'react-native-modals';

class RouteItem extends React.Component
{
    vehicle = [
        {image:require('../assets/vehiculos/vehiculo_1.png'),value:1},
        {image:require('../assets/vehiculos/vehiculo_2.png'),value:2},
        {image:require('../assets/vehiculos/vehiculo_3.png'),value:3},
        {image:require('../assets/vehiculos/vehiculo_4.png'),value:4},
        {image:require('../assets/vehiculos/vehiculo_5.png'),value:5},
        {image:require('../assets/vehiculos/vehiculo_6.png'),value:6},
        {image:require('../assets/vehiculos/vehiculo_7.png'),value:7},
        {image:require('../assets/vehiculos/vehiculo_8.png'),value:8}
    ]

    sending = false;

    constructor(props)
    {
        super(props);
        this.state = {
            data:{},
            demands:[],
            origin:false,
            destination:false,
            confirm:false,
            distance:0,
            user:{},
            myproposal:false,
            proposalsent:false,
            proposalitem:{},
            error:{}
        }
    }

    componentDidMount()
    {
        let routeid = this.props.navigation.state.params.id;
        let service = new PageService();
        let self = this;
        Geocoding.init(config.googleapikey);
        self.getinformation();
        AsyncStorage.getItem("user").then(user=>{
            user = JSON.parse(user);
            service.getrouteitem(routeid).then(async(route)=>{
                self.setState({
                    data:route,
                    user:user
                })
    
                let origin = await self.getlocation(route.pickCity);
                let destination = await self.getlocation(route.deliverCity);
    
                self.setState({
                    origin:origin,
                    destination:destination
                })
            })
        })
        
    }

    componentWillReceiveProps()
    {
        this.getinformation();
    }

    getinformation = async() => {
        let service = new PageService();
        let routeid = this.props.navigation.state.params.id;
        let demands = await service.getdemandfromroute(routeid);
        this.setState({
            demands:demands
        })
    }


    deletedemand = () => {
        let demandid = this.props.navigation.state.params.id;
        let service = new PageService();
        let self = this;
        self.setState({
            confirm:false
        })
        service.deletedemand(demandid,function(){
            self.props.navigation.navigate('MyRoute');
        })
    }

    getlocation = (address) => {
        return new Promise((resolve,reject)=>{
            Geocoding.from(address).then(json=>{
                let location = json.results[0].geometry.location;
                resolve({latitude:location.lat,longitude:location.lng});
            })
        })
    }

    getregion = () => {
        let origin = this.state.origin?this.state.origin:{};
        let destination = this.state.destination?this.state.destination:{};

        let latitudeDelta = Math.max(destination.latitude?destination.latitude:0 - origin.latitude?origin.latitude:0,0.3);
        let longitudeDelta = Math.max(destination.longitude?destination.longitude:0 - origin.longitude?origin.longitude:0,0.3);
        

        return {latitude:origin.latitude,longitude:origin.longitude,latitudeDelta:latitudeDelta,longitudeDelta:longitudeDelta};
    }
    
    titleroute = (type) => {
        const {intlData} = this.props;
        let data = this.state.data;
        let string = Moment(new Date(data[type + "DayIni"])).format('DD-MM-YYYY');
        return string + " - " + data[type + "CityName"] + " , "  + data[type + "CP"] + " (" + data[type + "CountryName"] + ")";
    }

    title = (type,item) => {
        const {intlData} = this.props;
        let data = item;
        let string = "";
        switch(data[type + "Mod"])
        {
            case 'before':
                string = intlData.messages['ANTES_DIA'] + " "  + Moment(new Date(data[type + "DayIni"])).format('DD-MM-YYYY');
                break;
            case 'after':
                string = intlData.messages['DESPUES'] + " " + Moment(new Date(data[type + "DayIni"])).format('DD-MM-YYYY');
                break;
            case 'day':
                string = Moment(new Date(data[type + "DayIni"])).format('DD-MM-YYYY');
                break;
            case 'between':
                string = intlData.messages['ENTRE'] + " " + Moment(new Date(data[type + "DayIni"])).format('DD-MM-YYYY') + " " + intlData.messages['Y_EL'] + " " + Moment(new Date(data[type + "DayIni"])).format('DD-MM-YYYY');
                break;
        }

        return string + " - " + data[type + "CityName"] + " , "  + data[type + "CP"] + " (" + data[type + "CountryName"] + ")";
    }

    viewdemand = (demandid) => {
        this.props.navigation.navigate("MYDEMANDITEM",{id:demandid,routeid:this.props.navigation.state.params.id})
    }

    isTrans = () => {
        return this.state.user && this.state.user.type === "transportista";
    }

    deleteroute = () => {
        let routeid = this.props.navigation.state.params.id;
        service.deleteroute(routeid,function(){
            this.props.navigation.navigate('MyRoute');
        })
    }
    showconfirm = () => {
        this.setState({
            confirm:true
        })
    }
    render()
    {
        let region = this.getregion();
        let service = new PageService();
        let distance = "";
        if(this.state.origin && this.state.destination)
        {
            distance = service.getdistance({lat:this.state.origin.latitude,long:this.state.origin.longitude},this.state.destination);
        }
        
        console.log(this.state.origin);
        const {intlData} = this.props;
        return (
           <PageContainer {...this.props} bannerenable={true} backenable={true} padding={true}>
               <View style={style.container}>
                {
                    (this.state.origin && this.state.destination) && (
                        <View style={{marginTop:hp('2%')}}>
                            <MapView style={style.map} 
                            initialRegion={region}
                            zoomEnabled={true}
                            zoomControlEnabled={true}
                            showsCompass={true}
                            showsMyLocationButton={true}
                            showsUserLocation={true}
                            toolbarEnabled={true}>
                                <Marker coordinate={this.state.origin}></Marker>
                                <Marker coordinate={this.state.destination}></Marker>
                                <MapViewDirections
                                origin={this.state.origin} 
                                destination={this.state.destination} 
                                language={intlData.locale} 
                                apikey={config.googleapikey}
                                strokeWidth={3}
                                strokeColor="hotpink"
                                onReady={(result)=>this.setState({distance:result.distance})}
                                ></MapViewDirections>
                            </MapView>
                            <Text style={style.distance}>{intlData.messages['DISTANCE']} {this.state.distance?this.state.distance:distance} km</Text>
                        </View>
                    )
                }                
               </View>
               <View style={style.content}>
                    <View style={style.groupitem}>
                        <Text style={style.label}>{intlData.messages['DEPARTURE']}</Text>
                        <Text style={style.description}>{this.titleroute('pick')}</Text>
                    </View>
                    <View style={style.groupitem}>
                        <Text style={style.label}>{intlData.messages['Arrival']}</Text>
                        <Text style={style.description}>{this.titleroute('deliver')}</Text>
                    </View>
                    
                    {
                        this.isTrans() && (
                            <View style={style.groupitem}>
                                <Text style={style.label}>{intlData.messages['PROPUESTA6']}</Text>
                                <View style={style.groupitem}>
                                    {
                                        this.state.demands.map((row,index)=>{
                                            return (
                                                <View key={index} style={style.item}>
                                                    <Text style={style.title}>{row.pickCityName} > {row.deliverCityName}</Text>
                                                    <Text>Recogida: {Moment(new Date(row.pickDayIni)).format('DD-MMM')} - Entrega: {Moment(new Date(row.deliverDayIni)).format('DD-MMM')}</Text>
                                                    <TouchableOpacity style={style.buttonproposal} onPress={()=>this.viewdemand(row.id)}>
                                                        <Text style={{textAlign:'center',...style.description}}>{intlData.messages['VER']} {intlData.messages['DEMANDA']}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        )
                    }
                    {
                        this.isTrans() && (
                            <View style={style.groupitem}>
                                <TouchableOpacity style={style.btn}><Text style={{textAlign:'center',...style.description}} onPress={this.showconfirm}>{intlData.messages['ANULAR_ROUTE']}</Text></TouchableOpacity>
                            </View>
                        )
                    }
                    {
                        !this.isTrans() && (
                            <View style={style.groupitem}>
                                <TouchableOpacity style={style.btn} onPress={()=>this.props.navigation.navigate('NEWDEMAND',{routeid:this.props.navigation.state.params.id})}><Text style={{textAlign:'center',...style.description}}>{intlData.messages['NEWDEMANDROUTE']}</Text></TouchableOpacity>
                            </View>
                        )
                    }
                    
                </View>
               <Modal
                     visible={this.state.confirm} 
                     modalTitle={<ModalTitle title={intlData.messages['ANULAR_DEMANDA']}></ModalTitle>}
                     footer={<ModalFooter><ModalButton style={style.btn} text={intlData.messages['ANULAR']} textStyle={style.description} onPress={()=>this.deleteroute()}></ModalButton><ModalButton text={intlData.messages['CANCELAR']} onPress={()=>this.setState({confirm:false})}></ModalButton></ModalFooter>}
                     onTouchOutside={()=>this.setState({confirm:false})}
                >
                    <ModalContent>
                        <Text style={style.confirmText}>{intlData.messages['SEGURIDAD2']}</Text>
                    </ModalContent>
                </Modal>
           </PageContainer> 
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        paddingLeft:wp('2%'),
        paddingRight:wp('2%'),
        paddingBottom:hp('4%')
    },
    map:{
        width:wp('96%'),
        height:hp('30%'),
        alignSelf:'center'
    },
    distance:{
        color:'white',
        fontSize:hp('2.3%')
    },
    content:{
        paddingTop:hp('2%'),
        paddingLeft:wp('4%'),
        paddingRight:wp('4%')
    },
    label:{
        fontSize:hp('2.3%'),
        fontWeight:'bold',
        color:'#605e00'
    },
    groupitem:{
        marginBottom:hp('1%')
    },
    description:{
        color:'white',
        fontSize:hp('2.1%')
    },
    btn:{
        backgroundColor:'#dd691b',
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
        paddingHorizontal:wp('2%'),
        marginTop:hp('2%'),
        borderRadius:5
    },
    confirmText:{
        fontSize:hp('2.3%'),
        fontWeight:'bold'
    },
    item:{
        backgroundColor:'#FFF',
        borderColor:'#DDD',
        borderWidth:1,
        paddingLeft:wp('4%'),
        paddingTop:hp('2%'),
        paddingBottom:hp('2%'),
        marginTop:hp('1%')
    },
    title:{
        color:'black',
        fontWeight:'bold',
        fontSize:hp('2.2%')
    },
    price:{
        color:'#605e00',
        fontSize:hp('2%')
    },
    buttonproposal:{
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
        width:wp('40%'),
        marginTop:hp('1%'),
        backgroundColor:'#dd691b',
        borderRadius:5,
        justifyContent:'center'
    },
    forminput:{
        backgroundColor:'white',
        marginTop:hp('1%'),
        borderRadius:10,
        width:wp('92%')
    },
    formerror:{
        color:'#fb0603',
        fontSize:hp('2.3%'),
        textAlign:'center',
        marginTop:hp('1%')
    }
})

export default connect(RouteItem);