//Class to perform callout

global class WebServiceLWC {
 
    
    @AuraEnabled (cacheable=true)
    global static WeatherData locationCallout(String location) {
        String endPoint='callout:WeatherAPI?city=' + location + '&key=YOUR API Key';
        return calloutMethod(endPoint);
    }
    @AuraEnabled (cacheable=true)
    global static WeatherData zipcodeCallout(String location) {
      
        String endPoint='callout:WeatherAPI?postal_code=' + location + '&key=YOUR API Key';
        return calloutMethod(endPoint);
    }
    
    
 public static WeatherData calloutMethod(String endPoint){
    HttpRequest req = new HttpRequest();
    req.setEndpoint(endPoint);
    req.setMethod('GET');
    Http http = new Http();
    system.debug('request'+req);
    HTTPResponse res = http.send(req);
    system.debug('response'+res);
    JSONParser parser = JSON.createParser(res.getBody());
    
    WeatherData weather = new WeatherData();

    while (parser.nextToken() != null) {
        if(parser.getCurrentToken() == JSONToken.FIELD_NAME) {
            parser.nextValue();
            if (parser.getCurrentName() == 'temp') {
                weather.cityTemp = Decimal.valueOf(parser.getText());
            } else if (parser.getCurrentName() == 'city_name') {
                weather.cityName = parser.getText();
            } else if (parser.getCurrentName() == 'state_code') {
                weather.state = parser.getText();
            } else if (parser.getCurrentName() == 'timezone') {
                weather.cityTimeZone = parser.getText();
            } else if (parser.getCurrentName() == 'wind_spd') {
                weather.cityWindSpeed = Decimal.valueOf(parser.getText());
            } else if (parser.getCurrentName() == 'lat') {
                weather.cityLat = parser.getText();
            } else if (parser.getCurrentName() == 'lon') {
                weather.cityLong = parser.getText();
            } else if (parser.getCurrentName() == 'precip') {
                weather.cityPrecip = Decimal.valueOf(parser.getText());
            }
            else if (parser.getCurrentName() == 'uv') {
                weather.cityUv = Decimal.valueOf(parser.getText());
            }
            else if (parser.getCurrentName() == 'sunrise') {
                weather.citySunrise = (parser.getText());
            }
            else if (parser.getCurrentName() == 'sunset') {
                weather.citySunset = (parser.getText());
            }
            else if (parser.getCurrentName() == 'clouds') {
                weather.cityClouds = (parser.getText());
            }
            else if (parser.getCurrentName() == 'vis') {
                weather.cityVis = Decimal.valueOf(parser.getText());
            }
            else if (parser.getCurrentName() == 'snow') {
                weather.citySnow = (parser.getText());
            }
        }
    }
    system.debug('response body'+weather);
    return weather;
 }
    global class WeatherData {
        @AuraEnabled public String cityName;
        @AuraEnabled public String cityTimeZone;
        @AuraEnabled public Decimal cityTemp;
        @AuraEnabled public String state;
        @AuraEnabled public Decimal cityWindSpeed;
        @AuraEnabled public String cityLat;
        @AuraEnabled public String cityLong;
        @AuraEnabled public Decimal cityPrecip;
        @AuraEnabled public Decimal cityUv;
        @AuraEnabled public String citySunrise;
        @AuraEnabled public String citySunset;
        @AuraEnabled public String cityClouds;
        @AuraEnabled public Decimal cityVis;
        @AuraEnabled public String citySnow;
    }
}