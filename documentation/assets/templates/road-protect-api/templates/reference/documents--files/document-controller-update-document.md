Overlay: true

[[example]]
## Example Request
### NodeJs Request
Replace ```DOCUMENT_ID``` with the desired ```documentId```.
Replace ```FILE_NAME``` with the desired ```fileName```.

```angular2html
var request = require('request');
var options = {
    'method': 'POST',
    'url': 'BACKEND_HOST_NAME/api/v1/document/DOCUMENT_ID',
    'headers': {
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
            'Content-Type': 'application/json'
        },
    body: JSON.stringify({"fileName":"FILE_NAME"})
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```

### Python Requests
Replace ```DOCUMENT_ID``` with the desired ```documentId```.
Replace ```FILE_NAME``` with the desired ```fileName```.

```angular2html
import requests
url = "BACKEND_HOST_NAME/api/v1/document/DOCUMENT_ID"
payload="{\n    \"fileName\": \"FILE_NAME\"\n}"
headers = {
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'Content-Type': 'application/json'
}
response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)

```
