#ifndef METHODS_H
#define METHODS_H
#include <string>
#include <fstream>
#include <cstdint>


class FileHandler{
	private:
		std::ifstream wslave;
		std::ofstream templog;
		
		std::string getwslavePath();
		std::string getTemplogPath();
		
	public:
		uintmax_t maxLogSize = 2000000;
		
		std::string recordTempData();
		int w1TempOpenLogs();
};


class DHT22{
	private:
		std::string getTempInputPath();
		std::string getHumInputPath();
		
	public:
		std::string getSensorData();
		
};


#endif
