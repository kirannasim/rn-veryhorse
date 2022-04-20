import React from 'react';
import {View,StyleSheet} from 'react-native';
import Modal,{ModalTitle,ModalButton,ModalFooter,ModalContent} from 'react-native-modals';
import HTML from 'react-native-render-html';
import connect from '../components/connectedcomponent';
import {heightPercentageToDP as hp,widthPercentageToDP as wp} from 'react-native-responsive-screen';
class ErrorAlert extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            erroralert:false
        }
    }

    componentDidMount()
    {
        this.setState({
            erroralert:this.props.error
        })
    }

    componentWillReceiveProps()
    {
        this.setState({
            erroralert:this.props.error
        })
    }

    close = () => {
        this.setState({
            erroralert:false
        })

        this.props.navigation.goBack();
    }

    render()
    {
        const {intlData} = this.props;
        return (
            <Modal 
                visible={this.state.erroralert} 
                onTouchOutside={()=>this.close()}
                modalTitle={<ModalTitle title={intlData.messages['PAGO_REALIZADO']} style={style.paymenttitle}></ModalTitle>}
                footer={
                    <ModalFooter>
                        <ModalButton text={intlData.messages['CANCELAR']} style={{backgroundColor:'lightgrey'}} onPress={()=>this.close()}></ModalButton>
                    </ModalFooter>
                }
                modalStyle={{margin:wp('2%')}}>
                <View style={{padding:wp('3%'),backgroundColor:'lightgrey'}}>
                    <View style={{marginTop:hp('1%')}}>
                        <HTML html={intlData.messages['TEXTO_PAGO_REALIZADO']}></HTML>
                    </View>
                </View>
            </Modal>
        )
    }
}

const style = StyleSheet.create({
    paymenttitle:{
        fontSize:hp('1.9%'),
        fontWeight:'bold'
    }
})
export default ErrorAlert;