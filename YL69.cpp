#include <iostream>
#include <wiringPi.h>
#include <string>
#include "methods.h"

int GPIOnum = 27;

std::string YL69::getSensorData(){
	wiringPiSetupGpio();
	std::string groundMoisture ="\"groundMoisture\": \"[" + std::to_string(digitalRead(GPIOnum)) + "]";
	std::cout << groundMoisture;
	return groundMoisture;
}


