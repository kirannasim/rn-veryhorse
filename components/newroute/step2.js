import React from 'react';
import {View,Text,StyleSheet,TextInput} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Moment from 'moment';
class Step3 extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    
    render()
    {
        const {intlData} = this.props;
        return (
            <View style={style.form}>
                <Text style={style.label}>{intlData.messages['FECHA_R']}</Text>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['SELECCIONE2']}</Text>
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages[this.props.param1 == 'pickDayIni'?"DATE_DEPARTURE":"DATE_ARRIVAL"]}</Text>
                    <DatePicker 
                        mode="date" 
                        style={style.dateInput} 
                        showIcon={false}
                        format="YYYY-MM-DD"
                        minDate={this.props.param1 == "pickDayIni"?Moment(new Date()).format('YYYY-MM-DD'):Moment(new Date(this.props.data['pickDayIni'])).format('YYYY-MM-DD')}
                        maxDate={(this.props.param1 == 'pickDayIni' && this.props.data['deliverDayIni'])?Moment(new Date(this.props.data['deliverDayIni'])).format('YYYY-MM-DD'):Moment(new Date(8640000000000000)).format('YYYY-MM-DD')}
                        onDateChange={(date)=>this.props.handleChange(this.props.param1,date)}
                        date={this.props.data[this.props.param1]}
                        ></DatePicker>
                    {
                        this.props.error[this.props.param1] != undefined && (
                        <Text style={style.form_error}>{this.props.error[this.props.param2]}</Text>
                        )
                    }
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    form:{
        flex:1
    },
    formgroup:{
        marginTop:hp('2%')
    },  
    label:{
        fontSize:hp('2.2%'),
        color:'#605e00',
        fontWeight:'700',
        paddingBottom:hp('0.5%')
    },
    input:{
        paddingLeft:wp('3%'),
        paddingTop:hp('1%'),
        paddingBottom:hp('1%'),
        backgroundColor:'white',
        borderRadius:5
    },
    dateInput:{
        backgroundColor:'white',
        borderRadius:5,
        width:wp('84%')
    },
    form_error:{
        color:'#fb0603',
        fontSize:hp('2.3%')
    }
})
export default Step3;