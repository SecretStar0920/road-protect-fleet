Overlay: true

[[example]]
## Example Request
### NodeJs Request
For example, to update the case number:
- Replace ```INFRINGMENT_ID``` with the desired ```infringementId```.
- Replace ```CASE_NUMBER``` with the desired ```caseNumber```.

```angular2html
var request = require('request');
var options = {
    'method': 'POST',
    'url': 'BACKEND_HOST_NAME/api/v1/infringement/INFRINGMENT_ID',
    'headers': {
        'Authorization': 'Bearer YOUR_TOKEN_HERE', 
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"caseNumber":"'CASE_NUMBER'"})
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```

### Python Requests
For example, to update the case number:
- Replace ```INFRINGMENT_ID``` with the desired ```infringementId```.
- Replace ```CASE_NUMBER``` with the desired ```caseNumber```.

```angular2html
import requests
url = "BACKEND_HOST_NAME/api/v1/infringement/INFRINGMENT_ID"

payload="{\n    \"caseNumber\":\"'CASE_NUMBER'\"\n}"
headers = {
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'Content-Type': 'application/json'
}
response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)
```
