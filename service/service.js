import * as firebase from 'firebase';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import {AsyncStorage} from 'react-native';
import * as Util from './Util';
import DataService from './dataservice';
import Moment from 'moment';

const apiurl = 'https://newadmin.veryhorse.com';

export default class Service
{

    dataservice = null;
    constructor()
    {
        this.dataservice = new DataService();
    }

    loadbanner = (language)=>
    {
        return new Promise((resolve,reject)=>{
            axios.get(apiurl + '/get-banners',{params:{lang:language}}).then(res=>{
                
                let bannerimages = [];
                let data = res.data.data;
                
                for(let item in data)
                {
                    data[item]['image'] = apiurl + '/images/banners/' + data[item]['image'];
                    bannerimages.push(data[item]);
                }

                resolve(bannerimages);
            })
        })
    }

    loadrandombanner = async(language = "es") => {
        let banners = await this.loadbanner(language);
        return banners.length>0?banners[Math.floor(Math.random() * banners.length)]:null;
    }

    getintroduction = () => {
        return new Promise((resolve,reject)=>{
            axios.get(apiurl + "/api/mundoEquino").then(res=>{
                let data = res.data.mundo;
              
                data.sort(function(a,b){
                    var aTime = Math.round(new Date(a.date).getTime()/1000),
                        bTime = Math.round(new Date(b.date).getTime()/1000);
                    return bTime - aTime;
                })

                resolve(data);
            })
            
        })
    }

    getintroitem = (id) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref('/mundoEquino/' + id).on('value',(snapshot)=>{
                resolve(snapshot.val());
            })
        })
    }

    getinfo = (language = "es") => {
        return new Promise((resolve,reject)=>{
            axios.get(apiurl + "/get-static-pages",{params:{lang:language}}).then(res=>{
                let pages = [];
                for(let item in res.data.pages)
                {
                    pages.push(res.data.pages[item]);
                }

                resolve(pages);
            }).catch(err=>reject(err.getMessage()));
        })
    }

    getstaticpage = (page,language = "es") => {
        return new Promise((resolve,reject)=>{
            axios.get(apiurl + "/get-static-page/" + page,{params:{lang:language}}).then(res=>{
                resolve(res.data);
            }).catch(err=>reject(err));
        })
    }

    getdata = (language = "es") => {
        return new Promise((resolve,reject)=>{
            axios.get(apiurl + "/get-hotels-list",{params:{lang:language}}).then(res=>{
                let hoteldata = res.data.hotels;
                let alllat = 0; alllong = 0; count = 0;

                for(let item in hoteldata)
                {
                    let lat = parseFloat(hoteldata[item].latitude);
                    let long = parseFloat(hoteldata[item].longitude);

                    alllat += lat;
                    alllong += long;
                    count ++;
                }

                alllat = alllat / count;
                alllong = alllong / count;

                resolve({hoteldata:hoteldata,center:{lat:alllat,long:alllong}});
            })
        })
    }

    getcurrentposition = () => {
        return new Promise((resolve,reject)=>{
            Geolocation.getCurrentPosition((position)=>{
                resolve({lat:position.coords.latitude,long:position.coords.longitude});
            },(err)=>{
                resolve(null);
            })
        })
    }

    getfullhotellist = async(language = "es") => {
        let locationinfo = await this.getcurrentposition();

        return new Promise((resolve,reject)=>{
            axios.get(apiurl + "/get-hotels-list",{params:{lang:language}}).then(async(res)=>{
                let hoteldata = [];
                
                for(let item in res.data.hotels)
                {
                    res.data.hotels[item].cover_photo = apiurl + "/images/hotels/" + res.data.hotels[item].cover_photo;
                    res.data.hotels[item].distance = "";
                    hoteldata.push(res.data.hotels[item]);
                }

                if(locationinfo)
                {
                    for(let item in hoteldata)
                    {
                        hoteldata[item].offset = this.getdistance(locationinfo,hoteldata[item]);
                        hoteldata[item].distance = hoteldata[item].offset?hoteldata[item].offset + " km":'';
                    }

                    resolve(hoteldata);
                }
                else
                {
                    resolve(hoteldata);
                }
            }).catch(err=>reject(err))
        })
    }

    getdistance = (currentlocation,hotel) => {
        let R = 6378137;
        var dLat = this.getrad(currentlocation.lat - parseFloat(hotel.latitude));
		var dLong = this.getrad(currentlocation.long - parseFloat(hotel.longitude));
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	    Math.cos(this.getrad(hotel.latitude)) * Math.cos(this.getrad(currentlocation.lat)) *
	    Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
        
        var distanceInKm = Math.ceil(d/1000);

		return distanceInKm;
    }

    getrad = (x) => {
        return parseFloat(x) * Math.PI / 180;
    }

    gethoteldetail = (hotelid,language = "es") => {
        return new Promise((resolve,reject)=>{
            axios.get(apiurl + "/get-hotel-info",{params:{lang:language,id:hotelid}}).then(res=>{
                let hoteldata = res.data.hotel;
                hoteldata['cover_photo'] = apiurl + "/images/hotels/" + hoteldata['cover_photo'];
                if(hoteldata['photos']) {
                    for(var i in hoteldata['photos']) {
                        hoteldata['photos'][i] = apiurl + '/images/photos/' + hoteldata['photos'][i];
                    }
                }
                if(hoteldata['whatsapp']) {
                    hoteldata['whatsapp'] = 'https://api.whatsapp.com/send?phone=' + hoteldata['whatsapp'].replace(/[\D]+/, '');
                }
                
                resolve(hoteldata);
            })
        })
    }

    sendemail = (proposal,content,title) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/users/" + proposal.transportista).on("value",snapshot=>{
                let users = snapshot.val();
                axios({
                    url:'https://api.sendgrid.com/v3/mail/send',
                    method:"POST",
                    headers:{
                        'Authorization':"Bearer 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",
                        "Content-Type":"application/json"
                    },
                    data:{
                        "personalizations": [{"to": [{"email": "info@veryhorse.com"}]}],"from": {"email": users.email},"subject": title,"content": [{"type": "text/html", "value": '<html><body><div><strong>User : ' + users.name + '</strong></div><div><strong>User Email : ' + users.email + '</strong></div><div><strong>Price : ' + Util.demandamount(proposal.amount) + '€ </strong> </div><div><strong>Vehicle : ' + proposal.vehicle + '</strong></div><div><p>' + content +'</p></div></body></html>'}]}
                }).then(function(res){
                    resolve(true);
                }).catch(function(err){
                    reject(err.getMessage());
                })
            })
        })
        
    }

    sendcontactinfo = (data,language,callback) => {
        data.lang = language;
        axios.get('http://admin.veryhorse.com/php/send.php',{params:{data:JSON.stringify(data),action:"send_emergencias"}}).then(res=>{
            callback(res.data)
        })
    }

    createdemand = (data,callback) =>{
        AsyncStorage.getItem("user").then(value=>{
            let user = JSON.parse(value);
            data.user = user.uid;
            data.status = "pending";
            
            data.pickDayIni = data.pickDayIni?new Date(data.pickDayIni).getTime():0;
            data.pickDayEnd = data.pickDayEnd?new Date(data.pickDayIni).getTime():0;
            data.deliverDayIni = data.deliverDayIni?new Date(data.deliverDayIni).getTime():0;
            data.deliverDayEnd = data.deliverDayEnd?new Date(data.deliverDayEnd).getTime():0;
            firebase.database().ref("/demandas").push(data).then(function(ref){
                
                let senddata = {demand:ref.key,pickCountry:data.pickCountry,deliverCountry:data.deliverCountry,pickCity:data.pickCity,deliverCity:data.deliverCity};
                axios.get('http://admin.veryhorse.com/php/send.php',{params:{data:JSON.stringify(senddata),action:"send_new_demand"}}).then(res=>{
                    console.log(res);
                })

                
                callback(true);
            })
        })
    }
    

    getdemand = (status) => {
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem("user").then(value=>{
                let user = JSON.parse(value);
                var myToday = new Date();
                var today = +(new Date(myToday.getFullYear(), myToday.getMonth(), myToday.getDate(), 0, 0, 0))
               
                firebase.database().ref("/demandas/").orderByChild("user").equalTo(user.uid).on("value",async(snapshot)=>{
                    let array = [];
                    snapshot.forEach(function(item){
                        let data = item.val();
                        data.id = item.key;
                        
                        if(data.status == status && ((data.pickDayEnd && +(new Date(data.pickDayEnd)) > today) || +(new Date(data.pickDayIni)) > today))
                        {
                            array.push(data);
                        }
                    })

                    for(let item in array)
                    {
                        array[item].count = await this.getdemandquotecount(array[item].id);
                    }
                    resolve(array);
                })
            })
        })
    }

    parsedemand = (item,transporterId) => {
        return new Promise((resolve,reject)=>{
            let demands = {
                pending:[],
                sent:[]
            }
            
            firebase.database().ref('/proposals/' + item.id).on("value",snapshot=>{
                let added = false;
                snapshot.forEach(value=>{
                    let proposal = value.val();
                    if(proposal.transportista == transporterId)
                    {
                        let itemCopy = this.iterationCopy(item);
                        itemCopy.amount = proposal.amount;
                        if(proposal.triptype) {
                            itemCopy.tripTitle = proposal.triptype === 'one_way_trip' ?  'TRIP_ONE_WAY' : 'TRIP_ROUND';
                            itemCopy.tripTitle = '(' + itemCopy.tripTitle + ')';
                        } else {
                            itemCopy.tripTitle = '';
                        }
                        
                        //console.log(itemCopy);
                        demands.sent.push(itemCopy);
                        added = true;
                    }
                })

                if(!added)
                {
                    demands.pending.push(item);
                }

                resolve(demands);
            })
        })
    }

    getdemandquotecount = (demandid) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/proposals/" + demandid).on("value",snapshot=>{
                resolve(snapshot.numChildren());
            })
        })
    }

    getalldemand = () => {
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem("user").then(value=>{
                let user = JSON.parse(value);
                var myToday = new Date();
                var today = +(new Date(myToday.getFullYear(), myToday.getMonth(), myToday.getDate(), 0, 0, 0));
                var transporterId = user.uid;
                console.log(transporterId);
                firebase.database().ref("/demandas/").on("value",async(snapshot)=>{
                    let demands = {
                        confirmed:[],
                        sent:[],
                        pending:[]
                    }

                    
                    let list = [];
                    snapshot.forEach(val=>{
                        let demand = val.val();
                        demand.id = val.key;
                        if(!Number.isNaN(Number(demand.pickDayIni)) && demand.status != "canceled" && demand.status != "refund" && (new Date(demand.pickDayIni).getTime() > today || (demand.pickDayEnd && new Date(demand.pickDayEnd).getTime() > today)))
                        {
                            list.push(demand);
                        }
                        
                    })

                    await this.dataservice.getcountries();
                    for(let item in list)
                    {
                        if(list[item].routeid)
                        {
                            let routeitem = await this.getrouteitem(list[item].routeid);
                            if(routeitem.uid != transporterId)
                            {
                                continue;
                            }                            
                        }
                        if(!list[item].desestimadas || list[item].desestimadas.indexOf(transporterId) < 0)
                        {
                            if(list[item].status == 'confirmed' &&  list[item].userTrans == transporterId)
                            {
                                if((list[item].deliverDayEnd && list[item].deliverDayEnd >= today) || (list[item].deliverDayIni && list[item].deliverDayIni >= today)){
                                    demands.confirmed.push(list[item]);
                                }
                            }
                            else if(list[item].status == 'pending' && this.isItemInteresting(list[item],user))
                            {
                                
                                let results = await this.parsedemand(list[item],transporterId);
                                demands.pending = demands.pending.concat(results.pending);
                                demands.sent = demands.sent.concat(results.sent);
                            }
                        }
                    }

                    resolve(demands);
                })
                
            })
        })
    }


    iterationCopy = (src) => {
        let target = {};
        for (let prop in src) {
            if (src.hasOwnProperty(prop)) {
                target[prop] = src[prop];
            }
        }
        return target;
    }
    isItemInteresting = (item,user) => {
        if(!item.desestimadas || item.desestimadas.indexOf(user.uid) < 0) {
            
            if(!user.interestedCountries) {
                user.interestedCountries = [];
                if(user.paises)
                {
                    for(let item in user.paises)
                    {
                        user.interestedCountries.push(user.paises[item].iso2);
                    }
                }
            }

            
            if(user.interestedCountries.indexOf(item.pickCountry) >= 0 || user.interestedCountries.indexOf(item.deliverCountry) >= 0) {
                return true;
            } else {
                
                var continentPick = this.dataservice.getContinentFromISO(item.pickCountry);
                var continentDel = this.dataservice.getContinentFromISO(item.deliverCountry);
    
                if(user.interestedCountries.indexOf(continentPick) >= 0 || user.interestedCountries.indexOf(continentDel) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
    
    getdemanditem = (item) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/demandas/" + item).on("value",snapshot=>{
                resolve(snapshot.val());
            })
        })
    }

    rejectdemand = (data,demandid,user) => {
        return new Promise((resolve,reject)=>{
            if(!data.desestimadas)
            {
                data.desestimadas = [];
            }
            console.log("reject");
            console.log("reject",data.desestimadas);

            if(data.desestimadas.indexOf(user.uid) == -1)
            {
                data.desestimadas.push(user.uid);
            }
            console.log("reject",data.desestimadas);

            firebase.database().ref("/demandas/" + demandid).set(data).then(res=>{
                resolve(true);
            })
        })
    }

    deletequote = (demandid,proposalid) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/proposals/" + demandid + "/" + proposalid).remove().then(res=>{
                resolve(res);
            })
        })
    }

    deletedemand = (id,callback) => {
        firebase.database().ref("/demandas/" + id + "/status").set("canceled",function(error){
            callback(true)
        })
    }
    
    savepaymentsuccessdemand = (demand,demandid) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/demandas/" + demandid).set(demand).then(function(){
                AsyncStorage.getItem("user").then(function(value){
                    let user = JSON.parse(value);
                    axios.get("http://admin.veryhorse.com/php/send.php",{
                        params:{
                            data:JSON.stringify({demand:demandid,proposal:demand.acceptedProposal,transportista:demand.userTrans,user:user.uid}),
                            action:'send_offer_accepted'
                        }
                    });

                    resolve(true);
                })
            })
        })
    }

    addpending = (demand,data) => {
        return new Promise((resolve,reject)=>{
            let nowDate = new Date();
            var nowsecond = demand.deliverDayIni + (1000 * ((nowDate.getHours() * 3600) + (nowDate.getMinutes() * 60) + nowDate.getSeconds()));
            firebase.database().ref("/pending_valoraciones/" + demand.user).push({
                date:nowsecond,
                trans:data.transportista,
                transname:data.transportistaname,
                demandname:demand.pickCity + " a " + demand.deliverCity
            });

            resolve(true);
        })
    }
    getproposal = (id) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/proposals/" + id).on("value",snapshot=>{
                let proposals = [];
                snapshot.forEach(function(item){
                    let data = item.val();
                    data.id = item.key;
                    proposals.push(data);
                })
                resolve(proposals);
            })
        }) 
    }

    getproposalitem = (demandid,id) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/proposals/" + demandid + "/" + id).on("value",snapshot=>{
                let data = snapshot.val();
                data.id = snapshot.key;
                resolve(data);
            })
        })
    }

    gettransportista = (transportista) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/users/" + transportista).on('value',snapshot=>{
                resolve(snapshot.val());
            })
        })
    }

    payforstripe = (data,callback) => {
        axios.post(apiurl + "/reservation-payment",data).then(function(res){
            callback(res.data);
        })    
    }

    

    desestimar = (demandid,proposalid,demand,proposal,callback) => {
        proposal.desestimada = true;
        firebase.database().ref("/proposals/" + demandid + "/" + proposalid).set(proposal).then(function(){
            axios.get("http://admin.veryhorse.com/php/send.php",{
                params:{
                    data:JSON.stringify({demand: demand.pickCity+" a "+demand.deliverCity, user:proposal.transportista}),
                    action:'send_offer_dismissed'
                }
            }).then(function(res){
                callback(success);
            })
        })
    }
    sendmail = (proposal,desc,title)=>{
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem("user").then(user=>{
                user = JSON.parse(user);
                let senddata = 
                   {"to": "info@veryhorse.com","from": user.email,"subject": title,"content": '<html><body><div><strong>User : ' + user.name + '</strong></div><div><strong>User Email : ' + user.email + '</strong></div><div><strong>Price : ' + parseFloat(Util.demandamount(proposal.amount)) + '€ </strong> </div><div><strong>Vehicle : ' + proposal.vehicle + '</strong></div><div><p>' + desc +'</p></div></body></html>'}
                axios.get("http://admin.veryhorse.com/php/send.php",{params:{data:JSON.stringify(senddata),action:"ask_carrier"}}).then(function(){
                    resolve(true);
                })
            })
            
        })
    }

    sendproposal = (demandid,demand,data) => {
        return new Promise((resolve,reject)=>{
            if(data.id)
            {
                let proposalitem = {};
                for(item in data)
                {
                    if(item != 'id')
                    {
                        proposalitem[item] = data[item];
                    }
                }

                firebase.database().ref("/proposals/" + demandid + "/" + data.id).set(proposalitem).then(function(){
                    resolve(true);
                })
            }
            else
            {
                firebase.database().ref("/proposals/" + demandid).push(data).then(function(){
                    axios.get('http://admin.veryhorse.com/php/send.php',{params:{
                        data:JSON.stringify({user:demand.user,demand:demandid,proposal:data,amount:Util.demandamount(data.amount)}),
                        action:'send_new_offer'
                    }}).then(function(){
                        resolve(true);
                    })
                })
            }
            
        })
    }

    sendcompatiar = (data,language) => {
        data.lang = language;
        return new Promise((resolve,reject)=>{
            axios.get('http://admin.veryhorse.com/php/send.php',{params:{
                data:JSON.stringify(data),
                action:"send_friend"
            }}).then(function(){
                resolve(true);
            }).catch(err=>reject(err))
        })       
    }

    getroutecount = (routeid) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("/demandas").orderByChild("routeid").equalTo(routeid).on("value",snapshot=>{
                let count = 0;
                snapshot.forEach(value=>{
                    let demand = value.val();
                    if(demand.status != "canceled")
                    {
                        count ++;
                    }
                })


                resolve(count);
            })
        })
    }


    getmyroute = (state) => {
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem("user").then(value=>{
                var today = new Date();
                let user = JSON.parse(value);
                if(user.type == 'transportista')
                {
                    firebase.database().ref("/routes").orderByChild("uid").equalTo(user.uid).on("value",async(snapshot)=>{
                        let list = [];
                        if(snapshot.exists())
                        {
                            snapshot.forEach(route=>{
                                let routedata = route.val();
                                let today = new Date();
                                routedata.id = route.key;
                                if(routedata.status == state && new Date(routedata.pickDayIni).getTime() > new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0).getTime())
                                {
                                    list.push(routedata);
                                }
                            })

                            for(let item in list)
                            {
                                list[item].count = await this.getroutecount(list[item].id);
                            }
                            resolve(list);
                        }
                        else
                        {
                            resolve([])
                        }
                    })
                }
                else
                {
                    firebase.database().ref("/routes").orderByChild('pickDayIni').startAt(Moment(today).format('YYYY-MM-DD')).on("value",snapshot=>{
                        let list = [];
                        if(snapshot.exists())
                        {
                            snapshot.forEach(route=>{
                                let routedata = route.val();
                                let today = new Date();
                                routedata.id = route.key;
                                if(routedata.status == state)
                                {
                                    list.push(routedata);
                                }
                            })
                            
                            resolve(list);
                        }
                        else
                        {
                            resolve([])
                        }
                    })
                }
            })
        })
    }

    createroute = (data,callback) => {
        AsyncStorage.getItem("user").then(user=>{
            user = JSON.parse(user);
            data.uid = user.uid;
            data.status = "pending";
            firebase.database().ref("routes").push(data).then(result=>{
                callback({success:true})
            })
        })
    }

    getrouteitem = (routeid) => {
        return new Promise((resolve,reject)=>{
            firebase.database().ref("routes/" + routeid).on("value",snapshot=>{
                let data = snapshot.val();
                data.id = snapshot.key;
                resolve(data);
            })
        })
    }

    getdemandfromroute = (routeid) => {
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem("user").then(user=>{
                let useritem = JSON.parse(user);
                firebase.database().ref("demandas").orderByChild("routeid").equalTo(routeid).on("value",snapshot=>{
                    let list = [];
                    snapshot.forEach(value=>{
                        let demand = value.val();
                        demand.id = value.key;
                        if(demand.status != "canceled" && (demand.user = useritem.uid || useritem.type == 'transportista'))
                        {
                            list.push(demand);
                        }
                    })
                    
                    resolve(list);
                })
            })
           
        })
    }

    deleteroute = (routeid,callback) => {
        firebase.database().ref("routes/" + routeid).remove().then(res=>{
            callback(true);
        })
    }
} 