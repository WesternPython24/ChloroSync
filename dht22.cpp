#include <iostream>
#include <filesystem>
#include <string>
#include <fstream>
#include <sstream>
#include "methods.h"


std::string DHT22::getHumInputPath(){
	return "/sys/bus/iio/devices/iio:device0/in_humidityrelative_input";
}
std::string DHT22::getTempInputPath(){
	return "/sys/bus/iio/devices/iio:device0/in_temp_input";
}

std::string DHT22::getSensorData(){
	std::ifstream in_temp_input(getTempInputPath());
	if(!in_temp_input.is_open()) {
	      std::cout << getTempInputPath() + "  failed to open temp file\n";
	 }
	 std::ifstream in_humidityrelative_input(getHumInputPath());
	 if(!in_humidityrelative_input.is_open()) {
	      std::cout << getHumInputPath() + "  failed to open humidity file\n";
	 }
	 
	std::string message;
	std::string tempData;
	std::string humData;
	std::getline(in_temp_input, tempData);
	std::getline(in_humidityrelative_input, humData);
	message = std::string("{\"") + "temp\": \"" + tempData + "\", \"" + "humidity\": \"" + humData + "\"}";
	return message; 
	
}




