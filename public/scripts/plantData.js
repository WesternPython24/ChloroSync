const webSocketServer = new WebSocket('ws://localhost:3000');

webSocketServer.onmessage = async (message) => {
    console.log(`Received: ${message.data}`);
    updatePlantData(1, message.data);
}


async function updatePlantData(plantNum, plantData) {
    plantData = await plantData.text();
    plant = plantData.substring(plantData.indexOf('{'), plantData.lastIndexOf('}') + 1);
    const dataObject = JSON.parse(plantData);
    updateTempData(plantNum, dataObject.temp);
}

function updateTempData(plantNum, newTemp) {
    console.log(`Updating plant ${plantNum} data`);
    const currTempElement = document.getElementById(`temperatureValue`);
    currTempElement.textContent = newTemp;
}
