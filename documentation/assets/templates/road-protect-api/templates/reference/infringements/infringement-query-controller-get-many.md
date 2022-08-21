Overlay: true

[[description]]
Using this endpoint you can request paginated and filtered infringements. You
will only be able to see infringements linked to your account via the vehicles
they are linked to


[[query-parameters]]
### Filters
You can filter the results using query parameters with the following format:

  <code>
    filter=FIELD||OPERATION||VALUE
  </code>

You can combine multiple filters to refine your result (see examples)

### Order / Sorting
You can order the result by a specific column by adding a query param with the following format:
  
<code>sort=FIELD,ORDER</code>
  
### Pagination
You can select how many items per page you want and which page you want by using the following query parameters
   
<code>per_page=COUNT</code>
    
<code>page=PAGE</code>

### Other Query Parameters
The query parameter `via` is used to simplify filtering infringements
  <p>EG: <code>via=nominated</code> will return all infringements nominated to your account</p>
  <p>EG: <code>via=onVehicles</code> will return all infringements linked to vehicles you have used, regardless of whether they are nominated to you or not</p>



### Examples
Request infringements that contain the string "123" in their noticeNumber

  <code>?filter=noticeNumber||cont||123</code>

Request infringements that contain the string "123" in their noticeNumber and which have an offence date before 2000

  <code>?filter=noticeNumber||cont||123&filter=offenceDate||lte||2000-01-01T00:00:00.000Z</code>


Request the first 30 infringements created since a certain date

  <code>?filter=createdAt||gt||2020-02-18T22:00:00.000Z&per_page=30&page=1</code>



[[example]]
## Example Request
### NodeJs Request
For example, to find my infringements where ```200 < amountDue < 800```:

```angular2html
var request = require('request');
var options = {
    'method': 'GET',
    'url': 'BACKEND_HOST_NAME/api/v1/query/infringement?mine=true&filter=amountDue||gt||200&filter=amountDue||lt||800',
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
For example, to find my infringements where ```200 < amountDue < 800```:

```angular2html
url = "BACKEND_HOST_NAME/api/v1/query/infringement?mine=true&filter=amountDue||gt||200&filter=amountDue||lt||800"
payload={}
headers = {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
}
response = requests.request("GET", url, headers=headers, data=payload)
print(response.text)
```
