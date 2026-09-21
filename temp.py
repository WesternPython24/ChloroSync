#!/usr/bin/python
import os
import glob
import time
import csv
from datetime import datetime

# Initialize the 1-Wire drivers in the Linux kernel
os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

# Base directory where Linux stores 1-Wire device files
BASE_DIR = '/sys/bus/w1/devices/'
# CSV file path where data will be stored
LOG_FILE = 'temperature_log.csv'
# Logging interval in seconds (e.g., 60 seconds = 1 minute)
LOG_INTERVAL = 3 

def get_sensor_paths():
    """Finds all connected DS18B20 sensors (their folders start with '28-')."""
    return glob.glob(BASE_DIR + '28-*')

def read_temp_raw(sensor_path):
    """Reads the raw text file from the sensor."""
    with open(os.path.join(sensor_path, 'w1_slave'), 'r') as f:
        return f.readlines()

def read_temp(sensor_path):
    """Parses the raw data to extract the temperature in Celsius and Fahrenheit."""
    lines = read_temp_raw(sensor_path)
    
    # Wait until the sensor finishes rendering a valid temperature reading (YES)
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw(sensor_path)
        
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return temp_c, temp_f
    return None, None

def setup_log_file():
    """Creates the CSV file and adds headers if it does not already exist."""
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Timestamp', 'Sensor_ID', 'Temperature_C', 'Temperature_F'])

def log_data():
    """Main execution loop that writes sensor data to the CSV log."""
    setup_log_file()
    print(f"Logging data to {LOG_FILE}... Press Ctrl+C to stop.")
    
    try:
        while True:
            sensor_paths = get_sensor_paths()
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            if not sensor_paths:
                print(f"[{current_time}] No sensors detected. Check your wiring.")
            
            for path in sensor_paths:
                # Extract the unique sensor hardware ID from the directory path
                sensor_id = os.path.basename(path)
                
                try:
                    temp_c, temp_f = read_temp(path)
                    if temp_c is not None:
                        # Append the reading to the file
                        with open(LOG_FILE, 'a', newline='') as f:
                            writer = csv.writer(f)
                            writer.writerow([current_time, sensor_id, round(temp_c, 2), round(temp_f, 2)])
                        print(f"[{current_time}] Sensor: {sensor_id} | {temp_c:.2f}°C | {temp_f:.2f}°F")
                except Exception as e:
                    print(f"Error reading sensor {sensor_id}: {e}")
            
            time.sleep(LOG_INTERVAL)
            
    except KeyboardInterrupt:
        print("\nLogging stopped by user.")

if __name__ == '__main__':
    log_data()

