## 2.3 API
The API for the application was based upon RESTful architecture. Communication between the client and server was based upon the JSON format. 

### Standard Responses
The API follows a standard for three types of responses: error, success and data. Each endpoint responded in JSON of the following structures:

##### Error response
The error response had three fields: `error`, `message` and `meta`. The `error` field is just a boolean denoting an error has occurred while `message` and `meta` both describe the error. The `meta` object can contain anything and is usually contains extra data to display to the user to give a more detailed error report.

```json
> 400 BAD REQUEST
{
	"error": true,
	"message": "Invalid data in request.",
	"meta": {
		"field": "email"
	}
}
```

##### Success response
Sometimes requests to the server perform actions and required no more of a response than a simple "Yes, the action was completed." For this, the API has a standard *success* response of the form below.

```json
> 200 OK
{
	"success": true
}
```

##### Data response
The data response is more loose in what form it takes as a response. The data schema does not follow any pattern like the success and error responses however it must return a `200 OK` status code. Usually, however not enforced, the top level keys denote entities and the type of entity is used as the key. An example response from the API:

```json
> 200 OK
{
  "course": {
    "code": "CT422-1",
    "id": 2819,
    "institution_id": 1,
    "name": "Modern Information Management",
    "papers": [
      3671,
      3672,
      ...
      3685,
      3686
    ]
  }
}
```