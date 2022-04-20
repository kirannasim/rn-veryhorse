import React from 'react';
import {View,TouchableOpacity,StyleSheet,Text} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import connect from '../components/connectedcomponent';
import PageContainer from '../components/PageContainer';
import {Step1,Step2,Step3,Step4,Step5,Step6,Step7} from '../components/demand';
import Service from '../service/service';
class NewDemand extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data:{
                pickCity: false,
                pickCityName:"",
                pickCountry:"",
                pickCountryName:"",
                pickCP: false,
                pickMod: false,
                pickDayIni: false,
                pickDayEnd: false,
                deliverCity: false,
                deliverCityName:"",
                deliverCountry:"",
                deliverCountryName:"",
                deliverCP: false,
                deliverMod: false,
                deliverDayIni: false,
                deliverDayEnd: false,
                numHorses: false,
                special: false,
                specialDesc: "",
                lugage: false,
                lugageDesc: ""
            },
            step:0,
            error:{},
            sending:false
        }
    }

    nextstep = () => {
        let step = this.state.step;
        console.log(this.props.navigation.state.params);
        if(this.validate(step))
        {
            if(step == 7)
            {
                let service = new Service();
                let self = this;
                this.setState({
                    sending:true
                })

                let data = this.state.data;
                if(this.props.navigation.state.params && this.props.navigation.state.params.routeid)
                {
                    data.routeid = this.props.navigation.state.params.routeid;
                }

                
                service.createdemand(data,function(result){
                    if(self.props.navigation.state.params && self.props.navigation.state.params.routeid)
                    {
                        self.props.navigation.goBack();
                    }
                    else
                    {
                        self.setState({
                            step:8,
                            sending:false
                        })
                    }
                })
            }
            else
            {
                step = Math.min(this.state.step + 1,9);
                this.setState({
                    step:step
                })
            }
            
        }
    }

    prevstep = () => {
        let step = Math.max(this.state.step - 1,0);
        
        this.setState({
            step:step
        })
    }

    getbuttontitle = () => {
        const {intlData} = this.props;
        switch(this.state.step)
        {
            case 6:
                return intlData.messages['ENVIAR_DEMANDA'];
            case 7:
                if(this.state.sending)
                {
                    return intlData.messages['CONFIRMAR5'];
                }
                else
                {
                    return intlData.messages['CONFIRMAR4'];
                }
            case 8:
                return intlData.messages['FINALIZAR'];
            default:
                return intlData.messages['SIGUIENTE'];
        }
    }
    
    handleChange = (name,value) => {
        let data = this.state.data;
        data[name] = value;

        if(name == 'pickMod')
        {
            if(value != 'between')
            {
                data.pickDayEnd = "";
            }
        }
        else if(name == 'deliverMod')
        {
            if(value != 'between')
            {
                data.deliverDayEnd = "";
            }
        }

        this.setState({
            data:data
        })
    }

    validate = (step) => {
        let data = this.state.data;
        let error = {};
        const {intlData} = this.props;
        let enable = true;
       
        switch(step)
        {
            case 0:
                if(!data.pickCity)
                {
                    error.pickCity = intlData.messages['OBLIGATORIO'];
                    enable = false;
                }

                if(!data.pickCP)
                {
                    error.pickCP = intlData.messages['OBLIGATORIO'];
                    enable = false;
                }
                break;
            case 2:
                if(!data.pickDayIni)
                {
                    error.pickDayIni = intlData.messages['OBLIGATORIO'];
                    enable = false;
                }

                if(data.pickMod == 'between')
                {
                    if(!data.pickDayEnd)
                    {
                        error.pickDayEnd = intlData.messages['OBLIGATORIO'];
                        enable = false;
                    }
                }
                break;
            case 3:
                if(!data.deliverCity)
                {
                    error.deliverCity = intlData.messages['OBLIGATORIO'];
                    enable = false;
                }

                if(!data.deliverCP)
                {
                    error.deliverCP = intlData.messages['OBLIGATORIO'];
                    enable = false;
                }
                break;
            case 5:
                if(!data.deliverDayIni)
                {
                    error.deliverDayIni = intlData.messages['OBLIGATORIO'];
                    enable = false;
                }

                if(data.deliverMod == 'between')
                {
                    if(!data.deliverDayEnd)
                    {
                        error.deliverDayEnd = intlData.messages['OBLIGATORIO'];
                        enable = false;
                    }
                }
                break;
            case 6:
                if(!data.numHorses)
                {
                    error.numHorses = intlData.messages['OBLIGATORIO'];
                    enable = false;
                }
        }

        this.setState({
            error:error
        })
        return enable;
    }

    newdemand = () => {
        let data = {
            pickCity: false,
            pickCityName:"",
            pickCountry:"",
            pickCountryName:"",
            pickCP: false,
            pickMod: false,
            pickDayIni: false,
            pickDayEnd: false,
            deliverCity: false,
            deliverCityName:"",
            deliverCountry:"",
            deliverCountryName:"",
            deliverCP: false,
            deliverMod: false,
            deliverDayIni: false,
            deliverDayEnd: false,
            numHorses: false,
            special: false,
            specialDesc: "",
            lugage: false,
            lugageDesc: ""
        }

        this.setState({
            data:data,
            step:0
        })
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer {...this.props} bannerenable={true} backenable={true} title={intlData.messages['NEW_DEMANDA']}>
                <View style={style.container}>
                     {
                         (this.state.step == 0 || this.state.step == 3) && (
                            <Step1 data={this.state.data} param1={this.state.step == 0?"pickCity":"deliverCity"} param2={this.state.step == 0?"pickCP":"deliverCP"} {...this.props} handleChange={this.handleChange} error={this.state.error}></Step1>
                         )
                     }
                     {
                         (this.state.step == 1 || this.state.step == 4) && (
                            <Step2 {...this.props} param1={this.state.step == 1?"pickMod":"deliverMod"} handleChange={this.handleChange} nextstep={this.nextstep}></Step2>
                         )
                     }
                     {
                         (this.state.step == 2 || this.state.step == 5) && (
                             <Step3 {...this.props} mode={this.state.step == 2?this.state.data.pickMod:this.state.data.deliverMod} data={this.state.data} param1={this.state.step == 2?"pickDayIni":'deliverDayIni'} param2={this.state.step == 2?"pickDayEnd":'deliverDayEnd'} error={this.state.error} handleChange={this.handleChange}></Step3>
                         )
                      }
                      {
                          this.state.step == 6 && (
                            <Step4 {...this.props} data={this.state.data} error={this.state.error} handleChange={this.handleChange}></Step4>
                          )
                      }
                      {
                          this.state.step == 7 && (
                              <Step5 {...this.props} data={this.state.data}></Step5>
                          )
                      }
                      {
                          this.state.step == 8 && (
                              <Step6 {...this.props}></Step6>
                          )
                      }
                      {
                          this.state.step == 9 && (
                              <Step7 {...this.props} newdemand = {this.newdemand}></Step7>
                          )
                      }
                     {
                         (this.state.step != 1 && this.state.step != 4 && this.state.step != 9) && (
                            <View style={style.formgroup}>
                                <TouchableOpacity style={style.login_btncontainer} onPress={this.nextstep}>
                                    <Text style={style.loginbtn_text}>{this.getbuttontitle()}</Text>
                                </TouchableOpacity>
                            </View>
                         )
                     }
                     {
                         (this.state.step != 0 && this.state.step < 8) && (
                            <View style={style.formgroup}>
                                <TouchableOpacity style={style.backbtn} onPress={this.prevstep}>
                                    <Text style={style.loginbtn_text}>{intlData.messages['ATRAS']}</Text>
                                </TouchableOpacity>
                            </View>
                         )
                     }
                </View>
            </PageContainer>
        )
        
    }   
}

const style = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:hp('5%'),
        paddingLeft:wp('8%'),
        paddingRight:wp('8%'),
        paddingBottom:hp('3%')
    },
    formgroup:{
        marginTop:hp('2%')
    },  
    login_btncontainer:{
        paddingTop:hp('1.5%'),
        paddingBottom:hp('1.5%'),
        backgroundColor:'#dd691b',
        justifyContent:'center',
        borderRadius:5,
        marginTop:hp('2%')
    },
    loginbtn_text:{
        color:'white',
        fontSize:hp('2%'),
        textAlign:'center'
    },
    backbtn:{
        paddingTop:hp('2%'),
        paddingBottom:hp('2%'),
        backgroundColor:'#8b7f25',
        justifyContent:'center',
        borderRadius:5,
        marginTop:hp('2%')
    }
})
export default connect(NewDemand);