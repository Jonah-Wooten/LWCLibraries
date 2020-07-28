import { LightningElement } from 'lwc';
import locationCallout from '@salesforce/apex/WebServiceLWC.locationCallout';
import zipcodeCallout from '@salesforce/apex/WebServiceLWC.zipcodeCallout';

export default class WeatherDataLWC extends LightningElement {

    lat;
    long;
    mapMarkers = [];
    zoomLevel = 8;
    result;
    value;

    connectedCallback() {
        //calling locationCallout Apex metod 
        locationCallout({ location: 'Detroit,MI' }).then(data => {
            this.mapMarkers = [{
                location: {
                    Latitude: data['cityLat'],
                    Longitude: data['cityLong']
                },
                title: data['cityName'] + ', ' + data['state'],
            }];
            this.result = data;
        }).catch(err => console.log(err));

    }
    //If enter key is pressed 
    callKeyUp(event) {
        if (event.keyCode == 13) {

            this.onSearchChange(event);

        }
    }
    onSearchChange(event) {
        this.value = event.target.value;
        if (isNaN(this.value)) {
            console.log('string');
            locationCallout({ location: this.value }).then(data => {
                this.mapMarkers = [{
                    location: {
                        Latitude: data['cityLat'],
                        Longitude: data['cityLong']
                    },
                    title: data['cityName'] + ', ' + data['state'],
                }];
                this.result = data;
            }).catch(err => console.log(err));
        } else {
            console.log('number');
            zipcodeCallout({ location: this.value }).then(data => {
                this.mapMarkers = [{
                    location: {
                        Latitude: data['cityLat'],
                        Longitude: data['cityLong']
                    },
                    title: data['cityName'] + ', ' + data['state'],
                }];
                this.result = data;
            }).catch(err => console.log(err));
        }

    }

//Getting City name from result and pass it to the HTML
get getCityName() {
    if (this.result) {
        return this.result.cityName + ' Information';
    } else {
        return '---'
    }
}

get getConvertedTemp() {
    if (this.result) {
        return Math.round((this.result.cityTemp * (9 / 5)) + 32) + ' F';

    } else {
        return '--'
    }
}

get getCurrentWindSpeed() {
    if (this.result) {
        return this.result.cityWindSpeed + ' mph';
    } else {
        return '--'
    }
}

get getCurrentPrecip() {
    if (this.result) {
        return this.result.cityPrecip + " inches"
    } else {
        return '--'
    }
}


get getCurrentUv() {
    if (this.result) {
        return Math.round(this.result.cityUv)
    } else {
        return '--'
    }
}
get getSunrise() {
    if (this.result) {
        return (this.result.citySunrise)
    } else {
        return '--'
    }
}

get getClouds() {
    if (this.result) {
        return Math.round(this.result.cityClouds) + '%'
    } else {
        return '--'
    }
}
get getSunset() {
    if (this.result) {
        return (this.result.citySunset)
    } else {
        return '--'
    }
}
get getVisibility() {
    if (this.result) {
        return Math.round(this.result.cityVis)
    } else {
        return '--'
    }
}
get getSnowfall() {
    if (this.result) {
        return Math.round(this.result.citySnow)
    } else {
        return '--'
    }
}


}