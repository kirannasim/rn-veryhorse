import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity,AsyncStorage,Image} from 'react-native';
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
import * as Util from '../service/Util';
import { TextInput } from 'react-native-gesture-handler';
import RadioForm,{RadioButton,RadioButtonInput,RadioButtonLabel} from 'react-native-simple-radio-button';
import ImageSelect from '../components/ImageSelect';
import DatePicker from 'react-native-datepicker';
import Service from '../service/service';
class MyDemandItem extends React.Component
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
            proposal:[],
            origin:false,
            destination:false,
            confirm:false,
            distance:0,
            user:{},
            myproposal:false,
            proposalsent:false,
            proposalitem:{},
            error:{},
            acceptedproposal:{},
            acceptedtransportista:{},
            accepteduser:{}
        }
    }

    componentDidMount()
    {
        let demandid = this.props.navigation.state.params.id;
        let service = new PageService();
        let self = this;
        Geocoding.init(config.googleapikey);
        AsyncStorage.getItem("user").then(user=>{
            user = JSON.parse(user);
            service.getdemanditem(demandid).then(async(demand)=>{
                let proposal = await service.getproposal(demandid);
                let acceptedproposal = {};
                let acceptedtransportista = {};
                let accepteduser = {};
                if(demand.acceptedProposal && demand.status == 'confirmed')
                {
                    acceptedproposal = await service.getproposalitem(demandid,demand.acceptedProposal);
                    if(user.type == 'transportista')
                    {
                        accepteduser = await service.gettransportista(demand.user);
                    }
                    else
                    {
                        acceptedtransportista = await service.gettransportista(demand.userTrans);
                    }
                }

                console.log(acceptedtransportista);

                let myproposal = false;
                let proposalitem = {};
                for(let item in proposal)
                {
                    console.log(proposal[item]);
                    if(proposal[item].transportista == user.uid)
                    {
                        proposalitem = proposal[item];
                        myproposal = true;
                        break;
                    }
                }
                self.setState({
                    data:demand,
                    proposal:proposal,
                    user:user,
                    myproposal:myproposal,
                    proposalitem:proposalitem,
                    acceptedproposal:acceptedproposal,
                    acceptedtransportista:acceptedtransportista,
                    accepteduser:accepteduser
                })
    
                let origin = await self.getlocation(demand.pickCity);
                let destination = await self.getlocation(demand.deliverCity);
    
                self.setState({
                    origin:origin,
                    destination:destination
                })
            })
        })
        
    }

    handleChange = (name,value) => {
        let proposalitem = this.state.proposalitem;
        proposalitem[name] = value;
        this.setState({
            proposalitem:proposalitem
        })
    }

    selectvehicle = (vehicles) => {
        console.log(vehicles);
        let proposalitem = this.state.proposalitem;
        proposalitem.vehicle = vehicles.value;
        this.setState({
            proposalitem:proposalitem
        })
    }

    deletedemand = () => {
        let demandid = this.props.navigation.state.params.id;
        let service = new PageService();
        let self = this;
        self.setState({
            confirm:false
        })

        if(!this.sending)
        {
            this.sending = true;
            service.deletedemand(demandid,function(){
                if(self.props.navigation.state.params.routeid)
                {
                    self.props.navigation.goBack();
                }
                else
                {
                    self.props.navigation.navigate('MYDEMAND');
                }
                self.sending = false;
            })
        }
        
        
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
    validate = () => {
        let error = {};
        let proposalitem = this.state.proposalitem;
        if(isNaN(proposalitem.amount)){
			error.amount = true;
			return false;
		}
		
		if(proposalitem.vehicle === undefined) {
			error.vechicle = true;
			return false;
        }
        
        this.setState({
            error:error
        })

        return true;

		
    }

    sendproposal = () => {
        if(this.validate())
        {
            if(!this.sending)
            {
                this.sending = true;
                let service = new Service();
                let self = this;

                let data = this.state.proposalitem;
                data.transportista = this.state.user.uid;
                service.sendproposal(this.props.navigation.state.params.id,this.state.data,this.state.proposalitem).then(function(success){
                    self.sending = false;
                    self.setState({
                        proposalsent:true
                    })
                })
            }
        }
    }


    title = (type) => {
        const {intlData} = this.props;
        let data = this.state.data;
        console.log(data);
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
                string = Moment(new Date(data[type + "DayIni"])).format('DD-MM-YYYY')
                break;
            case 'between':
                string = intlData.messages['ENTRE'] + " " + Moment(new Date(data[type + "DayIni"])).format('DD-MM-YYYY') + " " + intlData.messages['Y_EL'] + " " + Moment(new Date(data[type + "DayEnd"])).format('DD-MM-YYYY');
                break;
        }

        return string + " - " + data[type + "CityName"] + " , "  + data[type + "CP"] + " (" + data[type + "CountryName"] + ")";
    }

    showconfirm = () => {
        this.setState({
            confirm:true
        })
    }

    viewproposal = (proposalid) => {
        let demandid = this.props.navigation.state.params.id;
        this.props.navigation.navigate("PROPOSAL",{demandid:demandid,proposalid:proposalid})
    }

    isTrans = () => {
        return this.state.user && this.state.user.type === "transportista";
    }

    rendertrans = () => {
        const {intlData} = this.props;
        return (
            <View style={style.groupitem}>
                <Text style={style.label}>{intlData.messages['DATOS']}</Text>
                <View style={{flexDirection:'row',...style.groupitem}}>
                    <Text style={style.label}>{intlData.messages['NOMBRE_E']} : <Text style={style.description}>{this.state.acceptedtransportista.name_empresa}</Text></Text>
                </View>
                <View style={{flexDirection:'row',...style.groupitem}}>
                    <Text style={style.label}>Email : <Text style={style.description}>{this.state.acceptedtransportista.email}</Text></Text>
                </View>
                <View style={{flexDirection:'row',...style.groupitem}}>
                    <Text style={style.label}>{intlData.messages['IDIOMA']} : <Text style={style.description}>{this.state.acceptedtransportista.idioma}</Text></Text>
                </View>
                {
                    this.state.acceptedproposal.vehicle > 0 && (
                        <View style={style.groupitem}>
                            <Text style={style.label}>{intlData.messages['VEHICULO']} :</Text>
                            <Image source={this.vehicle[this.state.acceptedproposal.vehicle - 1].image}></Image>
                        </View>
                    )
                }
                <View style={{flexDirection:'row',...style.groupitem}}>
                    <Text style={style.label}>{intlData.messages['DIRECCION']} : <Text style={style.description}>{this.state.acceptedtransportista.address}</Text></Text>
                </View>
                <View style={{flexDirection:'row',...style.groupitem}}>
                    <Text style={style.label}>{intlData.messages['POBLACION']} : <Text style={style.description}>{this.state.acceptedtransportista.town}</Text></Text>
                </View>
                <View style={{flexDirection:'row',...style.groupitem}}>
                    <Text style={style.label}>CP : <Text style={style.description}>{this.state.acceptedtransportista.cp}</Text></Text>
                </View>
                <View style={{flexDirection:'row',...style.groupitem}}>
                    <Text style={style.label}>{intlData.messages['PAIS']} : <Text style={style.description}>{this.state.acceptedtransportista.country}</Text></Text>
                </View>
                {
                    (this.state.acceptedtransportista.phoneFix != undefined && this.state.acceptedtransportista.phoneFix != "") && (
                        <View style={{flexDirection:'row',...style.groupitem}}>
                            <Text style={style.label}>{intlData.messages['TELEFONO_F']} : <Text style={style.description}>{this.state.acceptedtransportista.prefixFix} - {this.state.acceptedtransportista.phoneFix}</Text></Text>
                        </View>
                    )
                }
                <View style={{flexDirection:'row',...style.groupitem}}>
                    <Text style={style.label}>{intlData.messages['TELEFONO_M']} : <Text style={style.description}>{this.state.acceptedtransportista.prefixMob} - {this.state.acceptedtransportista.phoneMob}</Text></Text>
                </View>
                {
                    (this.state.acceptedtransportista.web != undefined && this.state.acceptedtransportista.web != "") && (
                        <View style={{flexDirection:'row',...style.groupitem}}>
                            <Text style={style.label}>Web : <Text style={style.description}>{this.state.acceptedtransportista.web}</Text></Text>
                        </View> 
                    )
                }
            </View>
        )
    }
    desetimar = () => {
        let service = new Service();
        let self = this;
        self.setState({
            desetimar:false
        })
        service.rejectdemand(this.state.data,this.props.navigation.state.params.id,this.state.user).then(res=>{
            self.props.navigation.goBack();
        })
    }

    deletequote = () => {
        let service = new Service();
        let self = this;
        self.setState({
            deletequote:false
        })
        service.deletequote(this.props.navigation.state.params.id,this.state.proposalitem.id).then(res=>{
            self.props.navigation.goBack();
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
                        <Text style={style.label}>{intlData.messages['RECOGIDA']}</Text>
                        <Text style={style.description}>{this.title('pick')}</Text>
                    </View>
                    <View style={style.groupitem}>
                        <Text style={style.label}>{intlData.messages['ENTREGA']}</Text>
                        <Text style={style.description}>{this.title('deliver')}</Text>
                    </View>
                    <View style={{flexDirection:'row',...style.groupitem}}>
                        <Text style={style.label}>{intlData .messages['NUMERO_C2']} :</Text>
                        <Text style={{marginLeft:wp('2%'),...style.description}}>{this.state.data.numHorses}</Text>
                    </View>
                    <View style={style.groupitem}>
                        <Text style={style.label}>{intlData.messages['TRATAMIENTO']}</Text>
                        <Text style={style.description}>{this.state.data.specialDesc?this.state.data.specialDesc:'No'}</Text>
                    </View>
                    <View style={style.groupitem}>
                        <Text style={style.label}>{intlData.messages['EQUIPAJE']}</Text>
                        <Text style={style.description}>{this.state.data.lugage?this.state.data.lugageDesc:'No'}</Text>
                    </View>
                    {
                        (this.state.data.status == 'pending' && this.isTrans()) && (
                            <View>
                                {
                                    (this.state.myproposal && !this.state.proposalsent) && (
                                        <Text style={{marginTop:hp('8%'),...style.description}}>{intlData.messages['PROPUESTA_YA_ENVIADA']}</Text>
                                    )
                                }
                                {
                                    !this.state.proposalsent && (
                                        <View>
                                            <View style={style.groupitem}>
                                                <Text style={style.label}>{intlData.messages['COTIZACION']}</Text>
                                                <TextInput style={style.forminput} keyboardType="numeric" value={this.state.proposalitem.amount} onChangeText={(text)=>this.handleChange("amount",text)}></TextInput>
                                                <View style={{flexDirection:'row',display:'flex'}}>
                                                    <Text style={{color:'white',marginLeft:'auto'}}>{intlData.messages['TAXES_INCLUDED']}</Text>
                                                </View>
                                            </View>
                                            <View style={style.groupitem}>
                                                <RadioForm
                                                    formHorizontal={false}
                                                    animation={true}
                                                    onPress={(value)=>this.handleChange("triptype",value)}
                                                >
                                                    {
                                                        [{label:intlData.messages['TRIP_ONE_WAY'],value:'one_way_trip'},{label:intlData.messages['TRIP_ROUND'],value:'round_trip'}].map((row,index)=>{
                                                            return (
                                                                <RadioButton key={index} labelHorizontal={true}>
                                                                    <RadioButtonInput isSelected={this.state.proposalitem.triptype == row.value} obj={row} index={index} buttonWidth={10}  buttonInnerColor={'#e74c3c'} buttonSize={hp('1.5%')} buttonOuterSize={hp('3.5%')} onPress={(value)=>this.handleChange("triptype",value)}></RadioButtonInput>
                                                                    <RadioButtonLabel obj={row} index={index} labelHorizontal={true} labelStyle={{fontSize:hp('2.5%'),color:'white'}}  onPress={(value)=>this.handleChange("triptype",value)}></RadioButtonLabel>
                                                                </RadioButton>
                                                            )
                                                        })
                                                    }
                                                </RadioForm>
                                            </View>
                                            <View style={style.groupitem}>
                                                <Text style={style.label}>{intlData.messages['VEHICULO']}</Text>
                                                <ImageSelect images={this.vehicle} value={this.state.proposalitem.vehicle} selectimage={this.selectvehicle}></ImageSelect>
                                            </View>
                                            <View style={style.groupitem}>
                                                <Text style={style.label}>{intlData.messages['FECHA_A']}</Text>
                                            </View>
                                            <View style={style.groupitem}>
                                                <Text style={style.label}>{intlData.messages['RECOGIDA']}</Text>
                                                <DatePicker 
                                                mode="date" 
                                                style={style.forminput} 
                                                showIcon={false}
                                                format="YYYY-MM-DD"
                                                minDate={Moment(new Date()).format('YYYY-MM-DD')}
                                                onDateChange={(date)=>this.handleChange("altPicDay",new Date(date).getTime())}
                                                date={this.state.proposalitem.altPicDay?Moment(new Date(this.state.proposalitem.altPicDay)).format('YYYY-MM-DD'):""}
                                                placeholder={intlData.messages['RECOGIDA']}
                                                ></DatePicker>
                                            </View>
                                            <View style={style.groupitem}>
                                                <Text style={style.label}>{intlData.messages['ENTREGA']}</Text>
                                                <DatePicker 
                                                mode="date" 
                                                style={style.forminput} 
                                                showIcon={false}
                                                format="YYYY-MM-DD"
                                                minDate={this.state.proposalitem.altPicDay?Moment(new Date(this.state.proposalitem.altPicDay)).format('YYYY-MM-DD'):Moment(new Date()).format('YYYY-MM-DD')}
                                                onDateChange={(date)=>this.handleChange("altDelDay",new Date(date).getTime())}
                                                date={this.state.proposalitem.altDelDay?Moment(new Date(this.state.proposalitem.altDelDay)).format('YYYY-MM-DD'):""}
                                                placeholder={intlData.messages['ENTREGA']}
                                                ></DatePicker>
                                            </View>
                                            <View style={{display:'flex',flexDirection:'row',flexWrap:'wrap',...style.groupitem}}>
                                                {
                                                    this.state.myproposal && (
                                                        <TouchableOpacity style={style.btn} onPress={()=>this.setState({deletequote:true})}>
                                                            <Text style={style.description}>{intlData.messages['DELETE_QUOTE']}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                <TouchableOpacity style={{marginRight:wp('1%'),...style.btn}} onPress={this.sendproposal}>
                                                    <Text style={style.description}>{intlData.messages['ENVIAR_COTIZACION']} {this.state.myproposal?intlData.messages['NUEVA']:''}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={style.btn} onPress={()=>this.setState({desetimar:true})}>
                                                    <Text style={style.description}>{intlData.messages['DESESTIMAR']}</Text>
                                                </TouchableOpacity>
                                                
                                                
                                            </View>
                                        </View>
                                    )
                                }
                                
                            </View>
                        )
                    }
                    {
                        (this.state.data.status == 'pending' && !this.isTrans()) && (
                            <View style={style.groupitem}>
                                <Text style={style.label}>{intlData.messages['PROPUESTA6']}</Text>
                                <View style={style.groupitem}>
                                    {
                                        this.state.proposal.map((row,index)=>{
                                            if(!row.desestimada)
                                            {
                                                return (
                                                    <View key={index} style={style.item}>
                                                        <Text style={style.title}>{intlData.messages['PRECIO5']}</Text>
                                                        <Text style={style.price}>{Util.demandamount(row.amount)} €</Text>
                                                        <TouchableOpacity style={style.buttonproposal} onPress={()=>this.viewproposal(row.id)}>
                                                            <Text style={{textAlign:'center',...style.description}}>{intlData.messages['VER']} {intlData.messages['PROPUESTA']}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }
                                        })
                                    }
                                </View>
                            </View>
                        )
                    }
                    {
                        (!this.isTrans() && this.state.data.status == "pending") && (
                            <View style={style.groupitem}>
                                <TouchableOpacity style={style.btn}><Text style={{textAlign:'center',...style.description}} onPress={this.showconfirm}>{intlData.messages['ANULAR_DEMANDA']}</Text></TouchableOpacity>
                            </View>
                        )
                    }
                    {
                        (this.state.data.status == 'confirmed') && (
                            <View style={style.groupitem}>
                               <Text style={style.label}>{intlData.messages['PRECIO']}</Text>
                               <View style={{marginTop:hp('3%'),...style.groupitem}}>
                                    <Text style={style.label}>{intlData.messages['PRECIO4']} : <Text style={style.description}>{Util.demandamount(this.state.acceptedproposal.amount)} €</Text></Text>         
                                </View>
                                <View style={{flexDirection:'row',...style.groupitem}}>
                                    <Text style={style.label}>{intlData.messages['PAGO']} : <Text style={style.description}>{Util.payamount(this.state.acceptedproposal.amount)} €</Text></Text>
                                </View>
                                <View style={{flexDirection:'row',...style.groupitem}}>
                                    <Text style={style.label}>{intlData.messages['PAGO2']} : <Text style={style.description}>{this.state.acceptedproposal.amount} €</Text></Text>
                                </View>
                                {
                                    this.state.acceptedproposal.altPicDay && (
                                        <View style={style.groupitem}>
                                            <Text style={style.label}>{intlData.messages['PROPUESTA2']} : <Text style={style.description}>{Moment(new Date(this.state.acceptedproposal.altPicDay)).format('DD-MM-YYYY')}</Text></Text>
                                        </View>
                                    )
                                }
                                {
                                    this.state.acceptedproposal.altDelDay && (
                                        <View style={style.groupitem}>
                                            <Text style={style.label}>{intlData.messages['PROPUESTA3']} : <Text style={style.description}>{Moment(new Date(this.state.acceptedproposal.altDelDay)).format('DD-MM-YYYY')}</Text></Text>
                                        </View>
                                    )
                                }
                                {
                                    !this.isTrans() && this.rendertrans()
                                    
                                }
                                {
                                    this.isTrans() && (
                                        <View style={style.groupitem}>
                                            <Text style={{fontSize:hp('2.5%'),...style.label}}>{intlData.messages['DATOS2']}</Text>
                                            <View style={{flexDirection:'row',...style.groupitem}}>
                                                <Text style={style.label}>{intlData.messages['NOMBRE']} :</Text>
                                                <Text style={{marginLeft:wp('2%'),...style.description}}>{this.state.accepteduser.name} {this.state.accepteduser.lastname}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',...style.groupitem}}>
                                                <Text style={style.label}>{intlData.messages['DIRECCION']} :</Text>
                                                <Text style={{marginLeft:wp('2%'),...style.description}}>{this.state.accepteduser.address} {this.state.accepteduser.cp} {this.state.accepteduser.town} {this.state.accepteduser.country}</Text>
                                            </View>
                                            {
                                                (this.state.accepteduser.phoneFix != "" && this.state.accepteduser.phoneFix != undefined) && (
                                                    <View style={{flexDirection:'row',...style.groupitem}}>
                                                        <Text style={style.label}>{intlData.messages['DIRECCION']} :</Text>
                                                        <Text style={{marginLeft:wp('2%'),...style.description}}>{this.state.accepteduser.address} {this.state.accepteduser.cp} {this.state.accepteduser.town} {this.state.accepteduser.country}</Text>
                                                    </View>
                                                )
                                            }
                                            <View style={{flexDirection:'row',...style.groupitem}}>
                                                <Text style={style.label}>{intlData.messages['TELEFONO_M']} :</Text>
                                                <Text style={{marginLeft:wp('2%'),...style.description}}>{this.state.accepteduser.prefixMob} {this.state.accepteduser.phoneMob}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',...style.groupitem}}>
                                                <Text style={style.label}>Email :</Text>
                                                <Text style={{marginLeft:wp('2%'),...style.description}}>{this.state.accepteduser.email}</Text>
                                            </View>
                                        </View>
                                    )
                                }
                            </View>
                        )
                    }
                </View>
               <Modal
                     visible={this.state.confirm} 
                     modalTitle={<ModalTitle title={intlData.messages['ANULAR_DEMANDA']}></ModalTitle>}
                     footer={<ModalFooter><ModalButton style={style.btn} text={intlData.messages['ANULAR']} textStyle={style.description} onPress={()=>this.deletedemand()}></ModalButton><ModalButton text={intlData.messages['CANCELAR']} onPress={()=>this.setState({confirm:false})}></ModalButton></ModalFooter>}
                     onTouchOutside={()=>this.setState({confirm:false})}
                >
                    <ModalContent>
                        <Text style={style.confirmText}>{intlData.messages['SEGURIDAD2']}</Text>
                    </ModalContent>
                </Modal>

                <Modal
                     visible={this.state.desetimar} 
                     modalTitle={<ModalTitle title={intlData.messages['DESESTIMAR']}></ModalTitle>}
                     footer={<ModalFooter><ModalButton style={style.btn} text={intlData.messages['SI']} textStyle={style.description} onPress={()=>this.desetimar()}></ModalButton><ModalButton text={intlData.messages['NO']} onPress={()=>this.setState({desetimar:false})}></ModalButton></ModalFooter>}
                     onTouchOutside={()=>this.setState({confirm:false})}
                >
                    <ModalContent>
                        <Text style={style.confirmText}>{intlData.messages['ARE_YOU_SURE']}</Text>
                    </ModalContent>
                </Modal>
                <Modal
                     visible={this.state.deletequote} 
                     modalTitle={<ModalTitle title={intlData.messages['DELETE_QUOTE']}></ModalTitle>}
                     footer={<ModalFooter><ModalButton style={style.btn} text={intlData.messages['SI']} textStyle={style.description} onPress={()=>this.deletequote()}></ModalButton><ModalButton text={intlData.messages['NO']} onPress={()=>this.setState({deletequote:false})}></ModalButton></ModalFooter>}
                     onTouchOutside={()=>this.setState({deletequote:false})}
                >
                    <ModalContent>
                        <Text style={style.confirmText}>{intlData.messages['ARE_YOU_SURE']}</Text>
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
        fontWeight:'bold',
        textAlign:'center'
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

export default connect(MyDemandItem);