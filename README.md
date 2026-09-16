# ChloroSync


## Chlorosync will use multiple different sensors to detect levels of light, humidity, soil moisture content, temperature, and possibly leaf color data. This data will be sent to a microcontroller (likely an ESP32), passing data to a Raspberry Pi which hosts a website. The website will be able to connect to as many plant's setups as a user would like, all remotely through the convenience of Wi-Fi. The website will display both current and historical data the sensors collect. 

## For now a raspberry pi acts as the data collector instead of the esp32 and the server is hosted on my personal laptop as I develop it. 

## I have a simple website for the server end to host using Node and Express

# 9/16-

## End to end connection using Websocket++ on the data node end (raspberry pi 1 with sensors connected). A one wire temperature sensor is configured to send data and on connection failure the node will attempt to reconnect. 

##      -Bug that happens over 12 hours of the raspberry pi 1 running that makes the data node believe it is correctly sending data to the server end, but the end never recieves it. Once it happens once it will continue to do that until the program is restarted. To recreate this, have the data node and server run for a day. Every time it happened was between 12-24 hours from program start. 


## Current successful workflow-
##        Temperature one wire sensor runs a c++ script to collect sensor data every few seconds and sends the data through websocket++ to the server host. 
##        The host recieves the message and sends the data to clients. If a client is connects through the webbrowser, a websocket connection is   established and the javascript front end recieves the websocket message. It uses the data to update the Temperature sensor area on the website. 

### Temperature sensor ----> (wired connection) ----> Raspberry pi 1 ----> (websocket++) ----> server (laptop) ----> websocket ----> website clients 

## Right now there is no differentiation between which clients are those connected to the browser, and the data nodes.

## This next coming week I will add temp/humidity sensor, soil water content sensor

## The raspberry pi 1 data scripts I will be pushing to a different branch


