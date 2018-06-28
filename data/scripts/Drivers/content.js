// server side script fetching remote data and preparing report data source
const http = require('http');
const request = require('request');
 
 // call remote http rest api
function fetchToken() {
	// Setting URL and headers for request
    var options = {
        url: 'http://45.32.112.165:12356/auth/operator/login',
        headers: {
            'User-Agent': 'request',
            'Content-Type': 'application/json'
	  },
		encoding: null, //  if you expect binary data
        responseType: 'buffer'
    };
	
	options.json = true;
	 options.body = {
		"password": "P@ssw0rd",
        "email": "kha.operator@gmail.com"
	 };
	 
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.post(options, function(err, resp, body) {
            if (err) {
                reject(err.toString());
				console.log(err.toString())
            } else {
				resolve(JSON.parse(JSON.stringify(body)));
            }
        })
    })
}

// group the data for report
async function checkLogin() {
    const login = await fetchToken()
	console.log(login)
	if(login.success){
		return login;
	}
}

// call remote http rest api
function fetchDrivers(login) {
	// Setting URL and headers for request
    var options = {
        url: 'http://45.32.112.165:12356/driver/drivers-in-campaign',
        headers: {
            'User-Agent': 'request',
             'Content-Type': 'application/json',
			'x-access-token' : login.token
		},
		encoding: null, //  if you expect binary data
        responseType: 'buffer'
    };
	
	options.json = true;
	 options.body = {
			"id_list_only": true,
			"campaigns_id": login.profile.campaign_id
			
	 };
	 
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.post(options, function(err, resp, body) {
            if (err) {
                reject(err.toString());
				console.log(err.toString())
            } else {
				resolve(JSON.parse(JSON.stringify(body)));
            }
        })
    })
}

// call remote http rest api
function fetchDriversInfo(login,id_driver) {
	// Setting URL and headers for request
    var options = {
        url: 'http://45.32.112.165:12356/api/driver/'+id_driver,
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

function fetchDriversPhoto(login,id_driver) {
	// Setting URL and headers for request
    var options = {
        url: 'http://45.32.112.165:12356/api/photo-request/accepted/' + id_driver,
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

// group the data driver photo
async function prepareDriverPhoto(login, id_driver) {
    const driverPhoto = await fetchDriversPhoto(login,id_driver)
    // .then(data => console.log("prepareDriverPhoto "+data))
    // .catch(reason => console.log("prepareDriverPhoto "+reason.message))
    if(driverPhoto.success){
       return driverPhoto.photo_requests.slice(0, 2)
	}
}

// group the data driver info
async function prepareDriverInfo(login, id_driver) {
    const driverInfo = await fetchDriversInfo(login,id_driver)
    // .then(data => console.log("prepareDriverInfo "+data))
    // .catch(reason => console.log("prepareDriverInfo "+reason.message))
    if(driverInfo.success){
       return driverInfo.driver_info
	}
}

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }		

// function randomIntFromInterval(min,max)
// {
//     return Math.floor(Math.random()*(max-min+1)+min);
// }

function createDataChart(dataChart, keyChart, chartMode) {
    //add data listColor
    var listColor = ['#ffcd56','#8cc640','#0d9347','#16aa9d','#36a2eb','#663091','#ff6384','#f15a27','#f79421','#ffc1c1','#dacdcd'];
    var listColorChartColor = ['#f1fcfc','#d9d9d9','#757575','#a07d41','#ef865f','#36a2eb','#ffcd56','#2f2a1e'];
    var keyColorChartColor = ['Trắng', 'Bạc', 'Xám', 'Nâu', 'Đỏ', 'Xanh', 'Vàng', 'Đen'];
    var keyColorChartColorEN = ['White', 'Silver', 'Gray', 'Brown', 'Red', 'Blue', 'Gold', 'Black'];
            var color = keyChart;
             if(chartMode==1){
            	var foundColoENr = keyColorChartColor.findIndex(function(carColor) {
                  return carColor == color;
                });
                var color = keyColorChartColorEN[foundColoENr]; 
             }
            	console.log("Data: "+color)
            	var foundColor = dataChart.findIndex(function(carColor) {
                  return carColor.key == color;
                });
                console.log(foundColor)
            if(foundColor == -1){
                var dataColor = new Object();
                console.log("Tao Moi: "+color);
                    dataColor.key = color;
                dataColor.value = 1;
                dataColor.percen = String(Math.round((dataColor.value/52) * 100)) + "%";
                if(chartMode==1){
                    var foundIndexColor = keyColorChartColorEN.findIndex(function(objectColor) {
                      return objectColor == color;
                    });
                    dataColor.code = listColorChartColor[foundIndexColor];
                }else{
                        if(dataChart == null){
                          dataColor.code  = listColor[0];
                    }else{
                         dataColor.code  = listColor[dataChart.length];
                    }
                }
             
                dataColor.data = color + ' ('+1+') ' + dataColor.percen
                dataChart.push(dataColor);

            }else{
                console.log("Cong Them: "+ color);
                dataChart[foundColor].value = dataChart[foundColor].value+1;
                dataChart[foundColor].percen = String(Math.round((dataChart[foundColor].value/52) * 100)) + "%";
                dataChart[foundColor].data = color + ' ('+dataChart[foundColor].value+') ' + dataChart[foundColor].percen
            }
}

// group the data for report
async function prepareDataSource(dataChart) {
    const login = await checkLogin();
    const drivers = await fetchDrivers(login)
    // .then(data => console.log(data))
    // .catch(reason => console.log(reason.message))
    if(drivers.success){
        //data list drivers info
        const driversInfo = []
        //data chart
        var keyColor = 'listColor';
        dataChart[keyColor] = [];
        var keySeat = 'listSeat';
        dataChart[keySeat] = [];
         var keyModel = 'listModel';
        dataChart[keyModel] = [];
         var keyYear = 'listYear';
        dataChart[keyYear] = [];
        for (let i=0; i<drivers.results.slice(0,2).length; i++) {
            const info = await prepareDriverInfo(login,drivers.results[i]._id)
            // .then(data => console.log("prepareDataSource "+data))
            // .catch(reason => console.log("prepareDataSource "+reason.message));
             info.photo_requests = await prepareDriverPhoto(login,drivers.results[i]._id);
            
          createDataChart(dataChart[keyColor], info.carModelColor,1)
          createDataChart(dataChart[keySeat], info.carModelSeat,0)
            createDataChart(dataChart[keyYear], info.carModelYear,0)
             createDataChart(dataChart[keyModel], info.carModelMake+' '+info.carModel,0)
            
          driversInfo.push(info);
        }
      
      return driversInfo;
	}
	
}



// add jsreport hook which modifies the report input data
async function beforeRender(req, res) {
    var dataChart = new Object() // empty Object
    req.data.driversInfo = await prepareDataSource(dataChart)
    // .then(data => console.log("beforeRender "+data))
    // .catch(reason => console.log("beforeRender "+reason.message))
    
    
    req.data.charts = dataChart;
    // console.log(req)
    // console.log(dataChart)
}