# jsreport-tool

For Android, by [HOMINHTUNG](https://github.com/HOMINHTUNG)

## Description

Just code, just javascript and html. This is enough to create pdf or excel with no limitations.

No dependency on a specific platform or language. Just connect to the server and use REST API to render a report.

Excample export PDF:
<img src="https://i.imgur.com/TrmiQbw.png" width="400px" height="700px">

## Setup

Server Nodejs (download environment): https://nodejs.org/en/

jsreport:
<img src="https://i.imgur.com/zwWeg3R.png" width="400px" height="700px">

start jsreport:
<img src="https://i.imgur.com/S4rZ6cN.png" width="400px" height="700px">

## Usage

```javascript

  // call remote http rest api
function fetchData(login,id_driver) {
	// Setting URL and headers for request
    var options = {
        url: 'link api'+id_driver,
        headers: {
            'User-Agent': 'request',
            'Content-Type': 'application/json',
			'x-access-token' : login.token
		},
		encoding: null, //  if you expect binary data
        responseType: 'buffer'
    };
	
	options.json = true;
	 
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err.toString());
				console.log(err.toString())
            } else {
				resolve(JSON.parse(JSON.stringify(body)));
            }
        })
    })
}
```
