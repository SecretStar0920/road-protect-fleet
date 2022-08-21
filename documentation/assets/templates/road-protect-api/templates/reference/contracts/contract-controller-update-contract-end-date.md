Overlay: true

[[example]]
## Example Request
### NodeJs Request
Replace ``REFERENCE`` with the desired ```reference```.

```angular2html
var request = require('request');
var options = {
    'method': 'POST',
    'url': 'BACKEND_HOST_NAME/api/v1/contract/REFERENCE/end-date',
    'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
    },
body: JSON.stringify({"endDate":"2019-07-31T21:59:00.000Z","startDate":"2019-06-30T22:00:00.000Z"})
};
request(options, function (error, response) {
    if (error) throw new Error(error);
        console.log(response.body);
    });
};
```

### Python Requests
Replace ``REFERENCE`` with the desired ```reference```.

```angular2html
import requests
url = "BACKEND_HOST_NAME/api/v1/contract/REFERENCE/end-date"
payload="{\n\t \"endDate\": \"2019-07-31T21:59:00.000Z\",\n\t \"startDate\": \"2019-06-30T22:00:00.000Z\"\n}"
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)
```
