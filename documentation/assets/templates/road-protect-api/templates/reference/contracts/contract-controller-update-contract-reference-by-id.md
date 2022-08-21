Overlay: true

[[example]]
## Example Request
### NodeJs Request
Replace ```CONTRACT_ID``` with the desired ```contractId```.
Replace ``REFERENCE`` with the desired ```reference```.
```angular2html
var request = require('request');
var options = {
    'method': 'POST',
    'url': 'BACKEND_HOST_NAME/api/v1/contract/CONTRACT_ID/reference',
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer YOUR_TOKEN_HERE'
        },
form: {
'reference': 'REFERENCE'
}
    };
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```

### Python Requests
Replace ```CONTRACT_ID``` with the desired ```contractId```.
Replace ``REFERENCE`` with the desired ```reference```.

```angular2html
import requests
url = "BACKEND_HOST_NAME/api/v1/contract/CONTRACT_ID/reference"
payload='reference=REFERENCE'
headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)
```
