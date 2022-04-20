import React from 'react';
import {View,StyleSheet,TouchableOpacity,Text} from 'react-native';
import PageContainer from '../components/PageContainer';
import connect from '../components/connectedcomponent';
import {Step1,Step2,Step3} from '../components/newroute';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Service from '../service/service';
class NewRoute extends React.Component
{
    sending = false;
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
                deliverCity: false,
                deliverCityName:"",
                deliverCountry:"",
                deliverCountryName:"",
                deliverCP: false,
                pickDayIni: false,
                deliverDayIni: false,
            },
            step:0,
            error:{},
            sending:false
        }
    }

    nextstep = () => {
        let step = this.state.step;
        if(this.validate(step))
        {
            if(step == 4)
            {
                let service = new Service();
                let self = this;
                if(!this.state.sending)
                {
                    this.setState({
                        sending:true
                    })
                    
                    service.createroute(this.state.data,function(result){
                        self.props.navigation.navigate("Intro");
                        self.setSate({
                            sending:false
                        })
                    })
                }
                
            }
            step = Math.min(this.state.step + 1,4);
            this.setState({
                step:step
            })
        }
    }
    prevstep = () => {
        let step = Math.max(this.state.step - 1,0);
        
        this.setState({
            step:step
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
            case 1: 
                if(!data.pickDayIni)
                {
                    error.pickDayIni = intlData.messages['OBLIGATORIO'];
                    enable = false;
                }
                break;
            case 2:
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
            case 3: 
                if(!data.deliverDayIni)
                {
                    error.deliverDayIni = intlData.messages['OBLIGATORIO'];
                    enable = false;
                }
                break;
        }

        this.setState({
            error:error
        });

        return enable;
    }

    getbuttontitle = () => {
        const {intlData} = this.props;
        switch(this.state.step)
        {
            case 3:
                return intlData.messages['CONFIRMAR4'];
            case 4:
                return intlData.messages['CREATEROUTE'];
            default:
                return intlData.messages['SIGUIENTE'];
        }
    }
    
    handleChange = (name,value) => {
        let data = this.state.data;
        data[name] = value;

        this.setState({
            data:data
        })
    }
    
    render()
    {
        const {intlData} = this.props;
        return (
            <PageContainer {...this.props} bannerenable={true} backenable={true} backfunction={this.state.step == 0?this.prevstep:false} title={intlData.messages['NewRoute']}>
                <View style={style.container}>
                    {
                         (this.state.step == 0 || this.state.step == 2) && (
                            <Step1 data={this.state.data} param1={this.state.step == 0?"pickCity":"deliverCity"} param2={this.state.step == 0?"pickCP":"deliverCP"} {...this.props} handleChange={this.handleChange} error={this.state.error}></Step1>
                         )
                     }
                     {
                         (this.state.step == 1 || this.state.step == 3) && (
                            <Step2 {...this.props} data={this.state.data} param1={this.state.step == 1?"pickDayIni":"deliverDayIni"} handleChange={this.handleChange} nextstep={this.nextstep} error={this.state.error}></Step2>
                         )
                     }
                     {
                         this.state.step == 4 && (
                            <Step3 {...this.props} data={this.state.data}></Step3>
                         )
                     }
                     <View style={style.formgroup}>
                        <TouchableOpacity style={style.login_btncontainer} onPress={this.nextstep}>
                            <Text style={style.loginbtn_text}>{this.getbuttontitle()}</Text>
                        </TouchableOpacity>
                    </View>       
                    {
                        this.state.step != 0 && (
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

export default connect(NewRoute);