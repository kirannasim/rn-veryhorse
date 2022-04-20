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

    getlabel = () => {
        const {intlData} = this.props;
        switch(this.props.mode)
        {
            case 'before':
                return intlData.messages['ANTES_DIA'];
            case 'between':
                return intlData.messages['ENTRE'];
            case 'day':
                return intlData.messages['EL_DIA'];
            case 'after':
                return intlData.messages['DESPUES'];
        }

        return '';
    }
    render()
    {
        const {intlData} = this.props;
        return (
            <View style={style.form}>
                <Text style={style.label}>{this.props.param1 == 'deliverDayIni'?intlData.messages['FECHA_E']:intlData.messages['FECHA_R']}</Text>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['SELECCIONE2']}</Text>
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{this.props.mode == 'between'?intlData.messages['ENTRE']:intlData.messages['EL_DIA']} *:</Text>
                    <DatePicker 
                        mode="date" 
                        style={style.dateInput} 
                        showIcon={false}
                        format="YYYY-MM-DD"
                        minDate={Moment(new Date()).format('YYYY-MM-DD')}
                        maxDate={(this.props.data[this.props.param2] && this.props.mode == 'between')?this.props.data[this.props.param2]:new Date(8640000000000000)}
                        onDateChange={(date)=>this.props.handleChange(this.props.param1,date)}
                        date={this.props.data[this.props.param1]}
                        ></DatePicker>
                </View>
                {
                    this.props.mode == 'between' && (
                        <View style={style.formgroup}>
                            <Text style={style.label}>{intlData.messages['Y_EL']} *:</Text>
                            <DatePicker 
                                mode="date" 
                                style={style.dateInput} 
                                showIcon={false}
                                format="YYYY-MM-DD"
                                minDate={this.props.data[this.props.param1]?this.props.data[this.props.param1]:Moment(new Date()).format('YYYY-MM-DD')}
                                onDateChange={(date)=>this.props.handleChange(this.props.param2,date)}
                                date={this.props.data[this.props.param2]}
                                ></DatePicker>
                            {
                                this.props.error[this.props.param2] != undefined && (
                                <Text style={style.form_error}>{this.props.error[this.props.param2]}</Text>
                                )
                            }
                        </View>
                    )
                }
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