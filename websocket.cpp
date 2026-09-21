#include <websocketpp/config/asio_no_tls_client.hpp>
#include <websocketpp/client.hpp>
#include <iostream>
#include "methods.h"
#include <chrono>
#include <thread>
#include <string>
#include <stdexcept>
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

typedef websocketpp::client<websocketpp::config::asio_client> client;

websocketpp::connection_hdl global_hdl;
bool wsconnected = false;

void sendMessage(client* c, websocketpp::connection_hdl hdl, std::string msg){
   c->send(hdl, msg, websocketpp::frame::opcode::text);
   std::cout << " sending ws message:" + msg;
}

void gatherData(client* c){
   FileHandler fh;
   fh.w1TempOpenLogs();
   
   DHT22 dht;
   std::string currTemp;
   while(true){
      std::this_thread::sleep_for(std::chrono::milliseconds(3000));
      try{
         if(wsconnected){
            
            //this is for one wire temp sensor
            /*
            currTemp = fh.recordTempData();
            sendMessage(c, global_hdl, currTemp);
            */
            
            
            //this is for the DHT22 
            std::string tempHumData = dht.getSensorData();
            sendMessage(c, global_hdl, tempHumData);
            
         }
      } 
      catch(const websocketpp::exception& e){
         std::cout << "data gathered but not sent: conenction error";
      }
   }
   
   std::cout << "  gatherDataloop function failed  ";
}

void on_open(client* c, websocketpp::connection_hdl hdl){
   global_hdl = hdl;
   wsconnected = true;
}

void connectLoop(client &c, websocketpp::connection_hdl hdl){
   websocketpp::lib::error_code ec;
   while(true){
      try{
         c.connect(c.get_connection("ws://192.168.1.163:3000/ws", ec));
         c.run();
         c.reset();
      }
      catch(const websocketpp::exception& e){}
      std::cout << "\n connection failed. Attempting reconnect... \n ";
      std::this_thread::sleep_for(std::chrono::milliseconds(5000));
   }
}

void on_fail(client &c, websocketpp::connection_hdl hdl){
   wsconnected = false;
   std::cout << "\n handshake to server failed. Attempting reconnect... \n ";
}

void on_close(client &c, websocketpp::connection_hdl hdl){
   wsconnected = false;
   std::cout << "\n connection to server failed. Attempting reconnect... \n ";
}

int main() {
   client c;
   c.init_asio();
   c.set_open_handler(bind(&on_open, &c, _1));
   c.set_fail_handler(bind(&on_fail, websocketpp::lib::ref(c), _1));
   c.set_close_handler(bind(&on_close, websocketpp::lib::ref(c), _1));
   
   std::thread t(gatherData, &c);
   t.detach();
   websocketpp::connection_hdl hdl;
   connectLoop(websocketpp::lib::ref(c), hdl);
   
}

   
   
   
   
