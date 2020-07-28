import { LightningElement, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import searchGeolocations from '@salesforce/apex/AccountSearchController.searchGeolocations';

export default class AccountMap extends LightningElement {
    markers = [];
    geoIds = [];
    center = {};
    zoom ='1';
    switchTemplate = true;
    selectedMarkerValue = '';
    
    @wire(CurrentPageReference) 
    pageRef; 

    @wire(searchGeolocations, { geoIds: '$geoIds' })
    wiredGeoLocations({ error, data }){
        if (data){
            this.center = this.geolcationMidpoint(data);
        } 
        else if(error){
            console.log(error);
        }
    }
        
    connectedCallback(){
        registerListener('mapAccounts', this.handleMapAccount, this);
    }

    disconnectedCallback(){
        unregisterAllListeners(this);
    }

    handleMapAccount(data){ 
        this.markers = [];
        this.geoIds = [];
        if(data){
            this.markers = data.map(account => {
                return {
                    location: {
                        Street: account.BillingStreet,
                        State: account.BillingState,
                        City: account.BillingCity,
                        PostalCode: account.BillingPostalCode
                    },
                    title: account.Name,
                    description: account.Phone,
                    icon: 'utility:pinned'
                }
            });

            this.markers.length < 1 ? this.zoom = '1' : this.zoom = '14';

            if(this.markers.length % 2 === 0){
                this.switchTemplate = true;
            }
            else{
                this.switchTemplate = false;
            }
        
            for(const account of data){
                this.geoIds.unshift(account.Id);
            }   
        } 
    }  

    handleMarkerSelect(event) {
        this.selectedMarkerValue = event.detail.selectedMarkerValue;
    }
    
    geolcationMidpoint(locations){
        //absolute value
        let lat = [];
        let long = [];
        for(const l of locations){
            lat.unshift(l.BillingLatitude);
            long.unshift(l.BillingLongitude);
        }
        
        var latitude = lat.reduce(function(a, b){
            return Number(a) + Number(b);
        }, 0)/lat.length;
        var longitude = long.reduce(function(a, b){
            return Number(a) + Number(b);
        }, 0)/long.length;

        return {location: { Latitude: latitude,
                            Longitude: longitude }
               };
    }
}