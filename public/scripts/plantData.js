const webSocketServer = new WebSocket('ws://localhost:3000/ws?type=browser');

webSocketServer.onmessage = async (message) => {
    console.log( new Date().toLocaleString() + ` Received: ${message.data}` );
    updatePlantData(1, message.data);
}


async function updatePlantData(plantNum, plantData) {
    plantData = await plantData.text();
    plant = plantData.substring(plantData.indexOf('{'), plantData.lastIndexOf('}') + 1);
    const dataObject = JSON.parse(plantData);

    updateTempData(plantNum, dataObject.temp / 1000);
    updateHumidityData(plantNum, dataObject.humidity / 1000);
    updateGroundMoistureData(plantNum, dataObject.groundMoisture);
}



function updateTempData(plantNum, newTemp) {
    console.log(`Updating plant ${plantNum} data`);
    const currTempElement = document.getElementById(`temperatureValue`);
    currTempElement.textContent = newTemp;
}

function updateHumidityData(plantNum, newHumidity) {
    console.log(`Updating plant ${plantNum} data`);
    const currHumidityElement = document.getElementById(`humidityValue`);
    currHumidityElement.textContent = newHumidity;
}

function updateGroundMoistureData(plantNum, newGroundMoisture) {
    newGroundMoisture = JSON.parse(newGroundMoisture);
    console.log(`Updating plant ${plantNum} data`);
    for (let i = 0; i < newGroundMoisture.length; i++) {
        const readingNumber = i + 1;
        let currGroundMoistureElement = document.getElementById(`moistureReading${readingNumber}`);
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
            const readingContainer = document.querySelector('.sensorReadingContainer');
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
