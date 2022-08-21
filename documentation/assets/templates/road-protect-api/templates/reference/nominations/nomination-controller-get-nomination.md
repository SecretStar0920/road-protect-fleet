Overlay: true

[[example]]
## Example Request 
### NodeJs Request
Replace ```NOMINATION_ID``` with the desired ```nominationId```.

```angular2html
var request = require('request');
var options = {
  'method': 'GET',
  'url': 'BACKEND_HOST_NAME/api/v1/nomination/NOMINATION_ID',
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
Replace ```NOMINATION_ID``` with the desired ```nominationId```.

```angular2html
import requests
url = "BACKEND_HOST_NAME/api/v1/nomination/NOMINATION_ID"
payload={}
headers = {
  'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
response = requests.request("GET", url, headers=headers, data=payload)
print(response.text)
```
