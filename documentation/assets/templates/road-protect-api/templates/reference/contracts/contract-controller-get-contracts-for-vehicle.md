Overlay: true

[[example]]
## Example Request
### NodeJs Request
Replace ```VEHICLE_ID``` with the desired ```vehicleId```.

```angular2html
var request = require('request');
var options = {
    'method': 'GET',
    'url': 'BACKEND_HOST_NAME/api/v1/contract/vehicle/VEHICLE_ID',
    'headers': {
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
    }
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});

```

### Python Requests
Replace ```VEHICLE_ID``` with the desired ```vehicleId```.

```angular2html
import requests
url = "BACKEND_HOST_NAME/api/v1/contract/vehicle/VEHICLE_ID"
payload={}
headers = {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
response = requests.request("GET", url, headers=headers, data=payload)
print(response.text)
```
