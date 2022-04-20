import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import Store from './store';
import { StyleSheet, View } from 'react-native';
import Splash from './components/Splash';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as firebase from 'firebase';



export default function App() {
  let config = {
      apiKey: "AIzaSyBupBBq1tkCuwxzAtxmkYx_b5cZa8P3eaA",
      authDomain: "very-horse.firebaseapp.com",
      databaseURL: "https://very-horse.firebaseio.com",
      storageBucket: "very-horse.appspot.com",
  }

  firebase.initializeApp(config);
  console.disableYellowBox = true;
  return (
    <StoreProvider store={Store}>
        <View style={styles.container}>
          <Splash/>
        </View>
    </StoreProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#b6a740',
    width:wp('100%'),
    height:hp('100%')
  }
});
