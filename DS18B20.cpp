#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <filesystem>
#include "methods.h"

using namespace std;

      string FileHandler::getwslavePath(){
	 return "/sys/bus/w1/devices/28-03168a1decff/w1_slave";
      }
      string FileHandler::getTemplogPath(){
	 return "./temperature_log.csv";
      }

      string FileHandler::recordTempData(){
	    
	    string line;
	    string crc;
	    string temp;
	    getline(wslave, line);
	    stringstream s(line);
	    while(s >> crc && !crc.empty() && crc[1] != 'r'){}	    
	    s.clear();
	    getline(wslave, line);
	    s.str(line);
	    while(s >> temp && !temp.empty() && temp[0] != 't'){}
	    s.clear(); 
	    
	    wslave.clear();
	    wslave.seekg(0);
	    auto fsize = filesystem::file_size(getTemplogPath());
	    if(fsize > maxLogSize){
	       cout << "log file hit max file size of " + maxLogSize;
	    }
	    temp = temp.substr(2);
	    crc = crc.substr(4);
	    std::string message = "{\"crc\": \"" + crc + "\", \"temp\": " + temp + "}";

	    cout << message;
	    templog << message << flush;
	    return message;
      }

      int FileHandler::w1TempOpenLogs() {
	 
	 ifstream w1slave(getwslavePath());
	 if(!w1slave.is_open()) {
	      cout << "  w1_slave failed to open  ";
	      return 1;
	 }

	 ofstream w1templog(getTemplogPath());

	 if(!w1templog.is_open()) {
	      cout << "  templog failed to open  ";
	      return 1;
	 }

	 templog = std::move(w1templog);
	 wslave = std::move(w1slave);
	 
	 
	 return 0;
      }



