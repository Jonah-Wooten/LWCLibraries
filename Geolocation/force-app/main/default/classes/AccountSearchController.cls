public with sharing class AccountSearchController{
    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccounts(String searchTerm) {
        List<Account> accounts = new List<Account>();
        if(String.isNotBlank(searchTerm)){
            List<List<SObject>> searchResults = [
                FIND :searchTerm
                RETURNING Account(
                    Id, Name, Phone, Website,
                    BillingStreet, BillingCity,
                    BillingState, BillingPostalCode
                    ORDER BY Name, BillingCity
                    LIMIT 10
                )
            ];
            accounts = searchResults[0];
        }
        return accounts;
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> searchGeolocations(List<Id> geoIds){
        List<Account> accounts = new List<Account>();
        accounts = [SELECT BillingLatitude, BillingLongitude FROM Account WHERE Id IN :geoIds];
        return accounts;  
    }
}