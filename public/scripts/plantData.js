let webSocketServer;

function connect() {
    webSocketServer = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/browser`);

    webSocketServer.onmessage = async (message) => {
        console.log( new Date().toLocaleString() + ` Received: ${message.data}` );
        jsonData = JSON.parse(message.data);
        updatePlantData(jsonData.NODE_ID, jsonData);
    }

    webSocketServer.onopen = () => {
        console.log('WebSocket connection established');
    }

    webSocketServer.onclose = () => {
        console.log('WebSocket connection closed, attempting to reconnect...');

        setTimeout(() => {
            connect();
        }, 5000); 
    };
}

connect();




function updatePlantData(NODE_ID, plantData) {

    //if there is no instantiated plantSectionX template for this NODE_ID, create one
    let plantSection;
    if(!document.getElementById(`plantSection${NODE_ID}`)) {
        const template = document.getElementById('plantTemplate');
        plantSection = template.content.cloneNode(true);
        plantSection.querySelector('#plantSectionX').id = `plantSection${NODE_ID}`;
        plantSection.querySelector('#plantSectionHeader').textContent = `${NODE_ID}`;
        document.getElementById('plantSectionContainer').appendChild(plantSection);
        plantSection = document.getElementById(`plantSection${NODE_ID}`);
    }
    else {
        console.log(`Plant section ${NODE_ID} already exists, updating data`);
        plantSection = document.getElementById(`plantSection${NODE_ID}`);
    }
    
    if (plantData.temp !== undefined) {
        updateTempData(plantSection, plantData.temp);
    }
    if (plantData.humidity !== undefined) {
        updateHumidityData(plantSection, plantData.humidity);
    }
    if (plantData.groundMoisture !== undefined) {
        updateGroundMoistureData(plantSection, plantData.groundMoisture);
    }
    
    
}



function updateTempData(plantSection, newTemp) {
    console.log(`Updating plant section ${plantSection.id} data`);
    const currTempElement = plantSection.querySelector('.temperatureValue');
    currTempElement.textContent = newTemp;
}

function updateHumidityData(plantSection, newHumidity) {
    console.log(`Updating plant section ${plantSection.id} data`);
    const currHumidityElement = plantSection.querySelector('.humidityValue');
    currHumidityElement.textContent = newHumidity;
}

function updateGroundMoistureData(plantSection, newGroundMoisture) {
    newGroundMoisture = JSON.parse(newGroundMoisture);
    console.log(`Updating plant section ${plantSection.id} data`);
    for (let i = 0; i < newGroundMoisture.length; i++) {
        const readingNumber = i + 1;
        let currGroundMoistureElement = plantSection.querySelector(`#moistureReading${readingNumber}`);
        if (!currGroundMoistureElement) {
            console.log('adding new ground moisture element');
            currGroundMoistureElement = document.createElement('div');
            currGroundMoistureElement.className = 'moistureReading';
            currGroundMoistureElement.id = `moistureReading${readingNumber}`;
            currGroundMoistureElement.innerHTML = `<h1>Plant ${readingNumber}</h1>
                <h2>Ground Moisture</h2>
                <p><span class="value" id="groundMoistureValue${readingNumber}"></span>%</p>
                <button>delete</button>
                <button>edit</button>`;
            const readingContainer = plantSection.querySelector('.sensorReadingContainer');
            if (!readingContainer) {
                throw new Error('Could not find the sensor reading container');
            }
            readingContainer.appendChild(currGroundMoistureElement);
        }
        if(newGroundMoisture[i] == 1) {
            groundMoistureValue = 'DRY';
        } else if(newGroundMoisture[i] == 0) {
            groundMoistureValue = 'WET';
        }
        currGroundMoistureElement.querySelector('.value').textContent = groundMoistureValue;
    }
}
