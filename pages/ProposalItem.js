import React from 'react';
import {View,StyleSheet,Text,TextInput,TouchableOpacity,Alert} from 'react-native';
import PageContainer from '../components/PageContainer';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import connect from '../components/connectedcomponent';
import Service from '../service/service';
import Moment from 'moment';
import * as Util from '../service/Util';
import AutoHeightImage from 'react-native-auto-height-image';
import IonIcon from 'react-native-vector-icons/Ionicons';
import CheckBox from 'react-native-check-box';
import Paypal from 'react-native-paypal-wrapper';
import config from '../config/config';
import HTML from 'react-native-render-html';
import Modal,{ModalTitle,ModalButton,ModalFooter,ModalContent} from 'react-native-modals';
import Spinner from 'react-native-loading-spinner-overlay';
import Strip from 'tipsi-stripe';
import ErrorAlert from './ErrorAlert';
class Proposalitem extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data:{},
            proposal:{},
            rating:0,
            transportista:{},
            paysuccess:false,
            ask_description:"",
            tos:false,
            error:false,
            erroralert:false,
            strip:false,
            card:{},
            formerror:{},
            loading:false
        }
    }

    getinformation = () => {
        
        let demandid = this.props.navigation.state.params.demandid;
        let proposalid = this.props.navigation.state.params.proposalid;
        let service = new Service();
        service.getdemanditem(demandid).then(async(result)=>{
            let proposal = await service.getproposalitem(demandid,proposalid);
            
            
            let transportista = await service.gettransportista(proposal.transportista);
            
            
            let rating = 0;
            if(transportista && transportista.valoraciones)
            {
                let grade = 0;
                for(let item in transportista.valoraciones)
                {
                    grade += transportista.valoraciones[item].points;
                }

                rating = parseInt(grade / transportista.valoraciones.length);
            }

            
            this.setState({
                data:result,
                proposal:proposal,
                rating:rating,
                transportista:transportista?transportista:{}
            })
        })

    }

    sendemail = () => {
        const {intlData} = this.props;
        let ask_desc = this.state.ask_description;
        let service = new Service();

        let self = this;
        service.sendmail(this.state.proposal,ask_desc,intlData.messages['ASK_CARRIER']).then(function(){
            self.props.navigation.navigate("AskPending");
        })
    }

    componentDidMount()
    {
        this.getinformation();
    }

    componentWillReceiveProps()
    {
        this.getinformation();
    }

    title = (type) => {
        const {intlData} = this.props;
        let data = this.state.data;
        let string = "";
        switch(data[type + "Mod"])
        {
            case 'before':
                string = intlData.messages['ANTES_DIA'] + " "  + Moment(new Date(Number(data[type + "DayIni"]))).format('DD-MM-YYYY');
                break;
            case 'after':
                string = intlData.messages['DESPUES'] + " " + Moment(new Date(Number(data[type + "DayIni"]))).format('DD-MM-YYYY');
                break;
            case 'day':
                string = Moment(new Date(Number(data[type + "DayIni"]))).format('DD-MM-YYYY')
                break;
            case 'between':
                string = intlData.messages['ENTRE'] + " " + Moment(new Date(Number(data[type + "DayIni"]))).format('DD-MM-YYYY') + " " + intlData.messages['Y_EL'] + " " + Moment(new Date(Number(data[type + "DayIni"]))).format('DD-MM-YYYY');
                break;
        }

        return string + " - " + data[type + "CityName"] + " , "  + data[type + "CP"] + " (" + data[type + "CountryName"] + ")";
    }

    getvehicle = () => {
        let vehicle = this.state.proposal.vehicle;
        switch(vehicle)
        {
            case '1':
                return require('../assets/vehiculos/vehiculo_1.png');
            case '2':
                return require('../assets/vehiculos/vehiculo_2.png');
            case '3':
                return require('../assets/vehiculos/vehiculo_3.png');
            case '4':
                return require('../assets/vehiculos/vehiculo_4.png');
            case '5':
                return require('../assets/vehiculos/vehiculo_5.png');
            case '6':
                return require('../assets/vehiculos/vehiculo_6.png');
            case '7':
                return require('../assets/vehiculos/vehiculo_7.png');
            case '8':
                return require('../assets/vehiculos/vehiculo_8.png');
            default:
                return require('../assets/vehiculos/vehiculo_1.png');
        }
    }

    righttext = () => {
        const {intlData} = this.props;
        return (
            <Text style={{marginLeft:wp('2%'),alignItems:'center'}}>
                <Text style={style.acceptbefore}>
                    {intlData.messages['LEIDO']}
                </Text>
                <Text style={style.acceptafter}> {intlData.messages['CONDICIONES_GENERAL_CONTRATACION']}</Text>
            </Text>
        )
    }

    accept = () => {
        let checked = this.state.tos;
        this.setState({
            tos:!checked
        })
    }

    paymentcompleted = (amountpaid) => {
        const {intlData} = this.props;
        let self = this;
        let demand = self.state.data;
        demand.status = "confirmed";
        demand.userTrans = self.state.proposal.transportista;
        demand.paymentDate = +(new Date());
        demand.amountPaid = amountpaid;
        demand.acceptedProposal = self.props.navigation.state.params.proposalid;
        if(self.state.proposal.altPicDay && self.state.proposal.altPicDay != ""){
            demand.pickMod = "day";
            demand.pickDayIni = self.state.proposal.altPicDay;
            demand.pickDayEnd = "";
        }

        if(self.state.proposal.altDelDay && self.state.proposal.altDelDay != ""){
            demand.deliverMod = "day";
            demand.deliverDayIni = self.state.proposal.altDelDay;
            demand.deliverDayEnd = "";
        }
        
        let service = new Service();
        service.savepaymentsuccessdemand(demand,self.props.navigation.state.params.demandid).then(function(result){
            service.addpending(demand,{transportista:self.state.proposal.transportista,transportistaname:self.state.transportista.name_empresa}).then(function(result){
                self.setState({
                    loading:false,
                    strip:false,
                    erroralert:true
                })
            })
        })
    }
    
    sendpayment = () => {
        const {intlData} = this.props;
        Paypal.initialize(Paypal.PRODUCTION,config.PayPalEnvironmentProduction);
        Paypal.initialize(Paypal.SANDBOX,config.PayPalEnvironmentSandbox);
        let amountpaid = parseFloat(Util.payamount(this.state.proposal.amount)).toString();
        let self = this;
        console.log("errr");
        Paypal.pay({
            price:amountpaid,
            currency:'EUR',
            description:'Reserva Very Horse'
        }).then(confirm=>{
            self.paymentcompleted(amountpaid);

        }).catch(err=>{console.log(err);Alert.alert("Error",intlData.messages['ERROR_PAGO'])});
    }

    showreservar = () => {
        if(this.state.tos)
        {
            this.setState({
                strip:true,
                error:false
            })
        }
        else
        {
            this.setState({
                error:true
            })
        }
        
    }

    close = () => {
        this.setState({
            erroralert:false
        })

        this.props.navigation.navigate("MYDEMAND");
    }

    reservar = async() => {
        const {intlData} = this.props;
        let self = this;
        let err = {};
        if(!this.state.card.cc)
        {
            err.cc = intlData.messages['OBLIGATORIO'];
        }

        if(!this.state.card.name)
        {
            err.name = intlData.messages['OBLIGATORIO'];
        }

        if(!this.state.card.mes)
        {
            err.mes = intlData.messages['OBLIGATORIO3'];
        }

        if(!this.state.card.year)
        {
            err.year = intlData.messages['OBLIGATORIO3'];
        }

        if(!this.state.card.ccv)
        {
            err.ccv = intlData.messages['OBLIGATORIO'];
        }

        if(Object.keys(err).length == 0)
        {
            this.setState({
                loading:true
            })
            let carddetail = {
                number:this.state.card.cc,
                cvc:this.state.card.ccv,
                expMonth:parseInt(this.state.card.mes),
                expYear:parseInt(this.state.card.year),
                name:this.state.card.name
            }

            Strip.setOptions({
                publishableKey:config.STRIPKEY
            })

            console.log(carddetail);
            let amountPaid = Util.payamount(this.state.proposal.amount);
            let self = this;
            Strip.createTokenWithCard(carddetail).then(token=>{
                console.log(token);
                var payment = {
                    token:token.tokenId,
                    price:amountPaid
                }

                let service = new Service();
                service.payforstripe(payment,function(data){
                    if(data.status != "error")
                    {
                        self.paymentcompleted(data.paidAmount / 100);
                    }
                    else
                    {
                        if(data.code == 'card_declined')
                        {
                            Alert.alert(intlData.messages['ERROR_T'],intlData.messages['TARJETA_R'] + ' ' + data.message);
                        }
                        else
                        {
                            Alert.alert('Error',intlData.messages['ERROR_PAGO'] + ' ' + data.message);
                        }
                    }
                })
            }).catch(err=>{
                console.log(err);
                self.setState({
                    loading:false,
                    strip:false
                })

                Alert.alert('Error',err.message);
            })

            //this.paymentcompleted(amountPaid);

        }
        else
        {
            this.setState({
                formerror:err
            })
        }
    }

    handleChange = (name,value) => {
        let card = this.state.card;
        card[name] = value;
        this.setState({
            card:card
        })
        
    }

    deleteproposal = () => {
        const {intlData} = this.props;
        Alert.alert(
            intlData.messages['DESESTIMAR_QUOTE'],
            intlData.messages['DESESTIMAR_CONFIRM'],
            [
                {text:intlData.messages['CANCELAR']},
                {text:intlData.messages['ANULAR'],onPress: ()=>this.desestimar()}
            ]
        )
    }

    desestimar = () => {
        let service = new Service();
        let self = this;
        service.desestimar(this.props.navigation.state.params.demandid,this.props.navigation.state.params.proposalid,this.state.data,this.state.proposal,function(){
            self.props.navigation.goBack();
        })
    }

    render()
    {
        const {intlData} = this.props;
        let self = this;
        return(
            <PageContainer {...this.props} backenable={true} bannerenable={true}>
                <Spinner visible={this.state.loading} textContent={"Loading .... "} textStyle={{color:'white'}}></Spinner>
                <View style={style.container}>
                    <View style={style.demandcontent}>
                        <View style={style.itemgroup}>
                            <Text style={style.label}>{intlData.messages['RECOGIDA']}</Text>
                            {
                                this.state.proposal.altDelDay && (
                                    <Text style={style.description}>
                                        {Moment(new Date(Number(this.state.proposal.altDelDay))).format('DD-MM-YYYY')} - {this.state.data.pickCityName}, {this.state.data.pickCP} ({this.state.data.pickCountryName})
                                    </Text>
                                )
                            }
                            {
                                !this.state.proposal.altDelDay && (
                                    <Text style={style.description}>{this.title('pick')}</Text>
                                )
                            }
                        </View>
                        <View style={style.itemgroup}>
                            <Text style={style.label}>{intlData.messages['ENTREGA']}</Text>
                            {
                                this.state.proposal.altDelDay && (
                                    <Text style={style.description}>
                                        {Moment(new Date(Number(this.state.proposal.altDelDay))).format('DD-MM-YYYY')} - {this.state.data.deliverCityName}, {this.state.data.deliverCP} ({this.state.data.deliverCountryName})
                                    </Text>
                                )
                            }
                            {
                                !this.state.proposal.altDelDay && (
                                    <Text style={style.description}>{this.title('deliver')}</Text>
                                )
                            }
                        </View>
                        <View style={{flexDirection:'row',...style.itemgroup}}>
                            <Text style={style.label}>{intlData.messages['NUMERO_C2']}</Text>
                            <Text style={{marginLeft:wp('2%'),...style.description}}>{this.state.data.numHorses}</Text>
                        </View>
                        <View style={style.itemgroup}>
                            <Text style={style.label}>{intlData.messages['TRATAMIENTO']}</Text>
                            <Text style={style.description}>{this.state.data.specialDesc?this.state.data.specialDesc:"No"}</Text>
                        </View>
                        <View style={style.itemgroup}>
                            <Text style={style.label}>{intlData.messages['EQUIPAJE']}</Text>
                            <Text style={style.description}>{Number(this.state.data.lugage)?this.state.data.lugageDesc:"No"}</Text>
                        </View>
                    </View>
                    <View style={style.proposalcontent}>
                        <View style={style.itemgroup}>
                            <Text style={style.label}>{intlData.messages['PRECIO5']}</Text>
                            <Text style={style.description}>{Util.demandamount(this.state.proposal.amount)} €</Text>
                        </View>
                        <View style={style.itemgroup}>
                            <Text style={style.label}>{intlData.messages['PRECIO2']}</Text>
                            <Text style={style.description}>{Util.payamount(this.state.proposal.amount)} €</Text>
                            <Text style={{fontSize:hp('1.9%'),...style.description}}>{intlData.messages['PROPOSAL_DISCLOUSURE']}</Text>
                        </View>
                        <View style={style.itemgroup}>
                            <Text style={style.label}>{intlData.messages['VEHICULO']}</Text>
                            {
                                this.state.proposal.vehicle && (
                                    <AutoHeightImage source={this.getvehicle()} style={style.vehicle} width={wp('60%')}></AutoHeightImage>
                                )
                            }
                            
                        </View>
                        <View style={style.itemgroup}>
                            <Text style={style.label}>{intlData.messages['VALOR_TRANS2']}</Text>
                            <View style={{flexDirection:'row'}}>
                                {
                                    [0,1,2,3,4].map(function(value,key){
                                        return (
                                            <IonIcon name="md-star" style={value < self.state.rating?style.onicon:style.officon}></IonIcon>
                                        )
                                    })
                                }
                            </View>
                            {
                                this.state.transportista.description && (
                                    <Text style={style.description}>{(intlData.locale == 'en' && this.state.transportista.description.en)?this.state.transportista.description.en:this.state.transportista.description.es}</Text>
                                )
                            }
                        </View>
                        <View style={style.itemgroup}>
                            <Text style={style.label}>{intlData.messages['ASK_CARRIER']}</Text>
                            <TextInput style={style.ask_input} multiline={true} numberOfLines={4} value={this.state.ask_description} onChangeText={(text)=>this.setState({ask_description:text})}></TextInput>
                            <View style={style.askbtncontainer}>
                                <TouchableOpacity style={style.ask_btn} onPress={this.sendemail}>
                                    <Text style={style.description}>{intlData.messages['Send_Consult']}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            this.state.data.status == 'pending' && (
                                <View>
                                    <View style={{marginTop:hp('1%'),flexDirection:'row'}}>
                                        <CheckBox isChecked={this.state.tos} onClick={this.accept}></CheckBox>
                                        <Text style={{marginLeft:wp('2%'),alignItems:'center'}}>
                                            <Text style={style.acceptbefore}>
                                                {intlData.messages['LEIDO']}
                                            </Text>
                                            <Text style={style.acceptafter}> {intlData.messages['CONDICIONES_GENERAL_CONTRATACION']}</Text>
                                        </Text>
                                    </View>
                                    {
                                        this.state.error && (
                                            <Text style={style.formerror}>{intlData.messages['ACEPTAR_CONDICIONES']}</Text>
                                        )
                                    }
                                    <View style={{marginTop:hp('3%')}}>
                                        <TouchableOpacity style={style.btncontainer} onPress={this.showreservar}>
                                            <Text style={{textAlign:'center',...style.description}}>{intlData.messages['RESERVAR']}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={style.btncontainer} onPress={this.sendpayment}>
                                            <Text style={{textAlign:'center',...style.description}}>{intlData.messages['RESERVAR_PAYPAL']}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={style.btncontainer} onPress={this.deleteproposal}>
                                            <Text style={{textAlign:'center',...style.description}}>{intlData.messages['DESESTIMAR_QUOTE']}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
                <Modal 
                    visible={this.state.strip}
                    onTouchOutside={()=>this.setState({strip:false})}
                    modalTitle={<ModalTitle title={intlData.messages['INFORMACION']} style={style.paymenttitle}></ModalTitle>}
                    footer={
                        <ModalFooter>
                            <ModalButton text={intlData.messages['CANCELAR']} style={{backgroundColor:'lightgrey'}} onPress={()=>this.setState({strip:false})}></ModalButton>
                            <ModalButton text={intlData.messages['ENVIAR2']} style={{backgroundColor:'#dd691b'}} textStyle={style.description} onPress={this.reservar}></ModalButton>
                        </ModalFooter>
                    }
                    modalStyle={{margin:wp('2%')}}
                >
                    <ModalContent>
                        <View style={{padding:wp('3%'),backgroundColor:'lightgrey'}}>
                            <View style={{marginTop:hp('1%')}}>
                                <HTML html={intlData.messages['BEFORE_PAYMENT']}></HTML>
                            </View>
                            <View style={{marginTop:hp('1%')}}>
                                <Text style={style.formlabel}>{intlData.messages['NUMERO_T']} *</Text>
                                <TextInput style={style.forminput} value={this.state.card.cc} onChangeText={(text)=>this.handleChange('cc',text)}></TextInput>
                                {
                                    this.state.formerror.cc && (
                                        <Text style={style.formerror}>{this.state.formerror.cc}</Text>
                                    )
                                }
                            </View>
                            <View style={{marginTop:hp('1%')}}>
                                <Text style={style.formlabel}>{intlData.messages['NOMBRE_T']} *</Text>
                                <TextInput style={style.forminput} value={this.state.card.name} onChangeText={(text)=>this.handleChange('name',text)}></TextInput>
                                {
                                    this.state.formerror.name && (
                                        <Text style={style.formerror}>{this.state.formerror.name}</Text>
                                    )
                                }
                            </View>
                            <View style={{marginTop:hp('1%'),flexDirection:'row'}}>
                                <View style={{flex:1}}>
                                    <Text style={style.formlabel}>{intlData.messages['MES']} (MM)*</Text>
                                    <TextInput style={style.forminput} value={this.state.card.mes} onChangeText={(text)=>this.handleChange('mes',text)}></TextInput>    
                                    {
                                        this.state.formerror.mes && (
                                            <Text style={style.formerror}>{this.state.formerror.mes}</Text>
                                        )
                                    }
                                </View>
                                <View style={{flex:1,marginLeft:wp('1%')}}>
                                    <Text style={style.formlabel}>{intlData.messages['ANO']} (AA)*</Text>
                                    <TextInput style={style.forminput} value={this.state.card.year} onChangeText={(text)=>this.handleChange('year',text)}></TextInput>    
                                    {
                                        this.state.formerror.year && (
                                            <Text style={style.formerror}>{this.state.formerror.year}</Text>
                                        )
                                    }
                                </View>
                            </View>
                            <View style={{marginTop:hp('1%')}}>
                                <Text style={style.formlabel}>CCV **</Text>
                                <TextInput style={style.forminput} value={this.state.card.ccv} onChangeText={(text)=>this.handleChange('ccv',text)}></TextInput>
                                {
                                    this.state.formerror.ccv && (
                                        <Text style={style.formerror}>{this.state.formerror.ccv}</Text>
                                    )
                                }
                            </View>
                            <Text style={{marginTop:hp('1%'),fontSize:hp('1.9%')}}>
                                {intlData.messages['CODIGO_3_DIGITOS_REVERSO_TARJETA']}
                            </Text>
                        </View>
                    </ModalContent>
                </Modal>

                <ErrorAlert error={this.state.erroralert} {...this.props}></ErrorAlert>
            </PageContainer>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        paddingLeft:wp('5%'),
        paddingRight:wp('5%'),
        marginTop:hp('1%')
    },
    label:{
        fontSize:hp('2.3%'),
        fontWeight:'bold',
        color:'#605e00'
    },
    description:{
        color:'white',
        fontSize:hp('2.1%')
    },
    itemgroup:{
        marginTop:hp('2%')
    },
    demandcontent:{
        paddingBottom:hp('7%'),
        borderBottomColor:'#605e00',
        borderBottomWidth:2
    },
    proposalcontent:{
        paddingTop:hp('5%'),
        paddingBottom:hp('7%')
    },
    vehicle:{
        width:wp('60%')
    },
    onicon:{
        color:'white',
        marginRight:wp('1%'),
        fontSize:hp('4.5%')
    },
    officon:{
        color:'#605e00',
        marginRight:wp('1%'),
        fontSize:hp('4.5%')
    },
    ask_input:{
        backgroundColor:'white',
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
        marginTop:hp('1%')
    },
    askbtncontainer:{
        flex:1,
        display:'flex',
        flexDirection:'row',
        backgroundColor:'white'
    },
    ask_btn:{
        padding:hp('1%'),
        backgroundColor:'#d9534f',
        fontSize:hp('2%'),
        marginLeft:'auto',
        borderRadius:5
    }, 
    acceptbefore:{
        fontSize:hp('2%'),
        color:'white'
    },
    acceptafter:{
        fontSize:hp('2%'),
        color:'#605e00',
        marginLeft:wp('1%')
    },
    btncontainer:{
        backgroundColor:'#dd691b',
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
        marginBottom:hp('2%'),
        borderRadius:5
    },
    formerror:{
        color:'#fb0603',
        fontSize:hp('2.3%'),
        textAlign:'center',
        marginTop:hp('1%')
    },
    paymenttitle:{
        fontSize:hp('1.9%'),
        fontWeight:'bold'
    },
    formlabel:{
        fontSize:hp('1.9%')
    },
    forminput:{
        backgroundColor:'white',
        marginTop:hp('1%')
    },
    formerror:{
        color:'#fb0603',
        fontSize:hp('2.3%'),
        textAlign:'center',
        marginTop:hp('1%')
    }
})
export default connect(Proposalitem);