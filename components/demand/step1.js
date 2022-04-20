import React from 'react';
import {View,Text,StyleSheet,TextInput} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';

class Step1 extends React.Component
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
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages[this.props.param1 == "pickCity"?'DIRECCION_RECOGIDA':'DIRECCION_ENTREGA']} *:</Text>
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
                                this.props.handleChange(this.props.param1,details.formatted_address);
                                let countryname = "";
                                let countrycode = "";
                                let cityname = "";
                                for(let item in details.address_components)
                                {
                                    if(details.address_components[item].types.indexOf("locality") > -1)
                                    {
                                        cityname = details.address_components[item].long_name;
                                    }

                                    if(details.address_components[item].types.indexOf("country") > -1)
                                    {
                                        countryname = details.address_components[item].long_name;
                                        countrycode = details.address_components[item].short_name;
                                    }
                                }

                                console.log(cityname)
                                if(this.props.param1 == 'pickCity')
                                {
                                    this.props.handleChange("pickCityName",cityname);
                                    this.props.handleChange('pickCountry',countrycode);
                                    this.props.handleChange('pickCountryName',countryname);
                                }
                                else
                                {
                                    this.props.handleChange("deliverCityName",cityname);
                                    this.props.handleChange('deliverCountry',countrycode);
                                    this.props.handleChange('deliverCountryName',countryname);
                                }
                            }}
                            enablePoweredByContainer={false}
                            getDefaultValue={() => this.props.data[this.props.param1]}
                            textInputProps={{
                                ref: (input) => {this.fourthTextInput = input}
                            }}
                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: 'AIzaSyDbsOXv4sPiyPY1p-RGsRtMCwoKZdBMXCM',
                                language: intlData.locale,
                                types: 'geocode', // default: 'geocode'
                            }}
                            styles={{
                                container: {width:wp('84%'),backgroundColor:'white',borderRadius:5,zIndex:100},
                                textInputContainer: {
                                backgroundColor: 'transparent',
                                margin: 0,
                                width: wp('84%'),
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
                                fields: 'formatted_address,address_component,name',
                            }}
                            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                            debounce={200}
                            />
                    </View>
                    {
                        this.props.error[this.props.param1] != undefined && (
                        <Text style={style.form_error}>{this.props.error[this.props.param1]}</Text>
                        )
                    }
                </View>
                <View style={style.formgroup}>
                    <Text style={style.label}>{intlData.messages['CODIGO2']} *:</Text>
                    <TextInput style={style.input} value={this.props.data[this.props.param2]} onChangeText={(text)=>this.props.handleChange(this.props.param2,text)}></TextInput>
                    {
                        this.props.error[this.props.param2] != undefined && (
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
    form_error:{
        color:'#fb0603',
        fontSize:hp('2.3%')
    }
})
export default Step1;