import React from 'react';
import {View,StyleSheet,Text,TextInput,Picker} from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Dropdown} from 'react-native-material-dropdown';
import connect from '../connectedcomponent';
import DataService from '../../service/dataservice';
import {GooglePlacesAutocomplete}  from 'react-native-google-places-autocomplete';

class Step2 extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            countries:[]
        }
    }

    componentDidMount()
    {
        let dataservice = new DataService();
        let self  = this;
        dataservice.getcountries().then(res=>{
            self.setState({
                countries:res
            })
        })  
    }

    handlecp = (text) => {
        this.props.handleChange("cp",text);
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <View style={style.form}>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['DIRECCION']} * </Text>
                    <TextInput style={style.input} value={this.props.user.address} onChangeText={(text)=>this.props.handleChange("address",text)}></TextInput>
                    {
                        this.props.error.address != undefined && (
                            <Text style={style.form_error}>{this.props.error.address}</Text>
                        )
                    }
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['POBLACION']} * </Text>
                    <View style={{flex:1}}>
                        <GooglePlacesAutocomplete
                            placeholder='Search'
                            minLength={2}
                            autoFocus={false}
                            returnKeyType={'search'}
                            keyboardAppearance={'light'}
                            listViewDisplayed={false}
                            fetchDetails={true}
                            keyboardShouldPersistTaps="handled"
                            renderDescription={row => row.description}
                            onPress={(data, details = null) => {
                                this.props.handleChange("town",details.formatted_address);
                            }}
                            enablePoweredByContainer={false}
                            Value={this.props.user.town}
                            getDefaultValue={() => ''}
                            textInputProps={{
                                ref: (input) => {this.fourthTextInput = input}
                            }}
                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: 'AIzaSyC8h5--lK_Hd7IIpkLIyy75xCY_VkPyg1k',
                                language: intlData.locale,
                                types: '', // default: 'geocode'
                            }}
                            styles={{
                                container: {width:wp('80%'),backgroundColor:'white',borderRadius:5,zIndex:100},
                                textInputContainer: {
                                backgroundColor: 'transparent',
                                margin: 0,
                                width: wp('80%'),
                                padding:0,
                                borderTopWidth: 0,
                                borderBottomWidth:0
                                },
                                textInput: {
                                minWidth: wp('25%'), 
                                borderColor: "#cbb4c0",
                                borderBottomWidth: 1,
                                color: '#5d5d5d',
                                fontSize: 14,
                                },
                                description: {
                                color:'#000',
                                fontWeight: '300',
                                zIndex:100
                                },
                                predefinedPlacesDescription: {
                                color: '#1faadb'
                                }
                            }}
                            currentLocation={false} 
                            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            GoogleReverseGeocodingQuery={{// available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                            }}
                            GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                rankby: 'distance',
                                type: 'cafe'
                            }}    
                            GooglePlacesDetailsQuery={{
                                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                fields: 'formatted_address',
                            }}
                            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                            debounce={200}
                            />
                    </View>
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['CODIGO2']} * </Text>
                    <TextInput style={style.input} keyboardType="numeric" value={this.props.user.cp} onChangeText={(text)=>this.handlecp(text)}></TextInput>
                    {
                        this.props.error.cp != undefined && (
                            <Text style={style.form_error}>{this.props.error.cp}</Text>
                        )
                    }
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['PAIS']} * </Text>
                    <View style={style.containerStyle}>
                        <Picker mode="dropdown" style={{flex:1}} selectedValue={this.props.user.country} onValueChange={(value)=>this.props.handleChange("country",value)}>
                            <Picker.Item style={style.containerStyle} value="" label={intlData.messages["PAIS"]}></Picker.Item>
                            {
                                this.state.countries.map((row,index)=>{
                                    return (
                                        <Picker.Item key={index} value={row.nombre} label={row.nombre}></Picker.Item>
                                    )
                                })
                            }
                        </Picker>
                    </View>
                    {
                        this.props.error.country != undefined && (
                            <Text style={style.form_error}>{this.props.error.country}</Text>
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
    formgroup:{
        marginBottom:hp('2%')
    },
    containerStyle:{
        backgroundColor:'white',
        borderRadius:10,
        paddingLeft:wp('3%'),
        flex:1,
        justifyContent:'center'
    },
    form_error:{
        color:'#fb0603',
        fontSize:hp('2.3%')
    }
})
export default Step2;
