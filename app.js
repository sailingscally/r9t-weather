/*
 * Copyright 2022 Luis Martins <luis.martins@gmail.com>
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 */

const bme280 = require('bme280');
const mqtt = require('mqtt');

const run = async () => {
  console.log('Starting R nineT weather station...')

  const client = mqtt.connect('mqtt://localhost:1883', {
    clientId: 'r9t-weather'
  });

  let connected = false;

  client.on('connect', () => {
    console.log('Connected to MQTT broker.');

    client.options.reconnectPeriod = 1000;
    connected = true;
  });

  client.on('close', () => {
    if(connected) {
      console.log('Connection to MQTT broker lost.');
      connected = false;
    }
  });

  client.on('error', (error) => {
    switch(error.code) {
      case 'ECONNREFUSED':
        console.log(`Unable to connect to MQTT broker on ${error.address}:${error.port}.`);
        break;

      default:
        console.log(error);
        break;
    }
  });

  /*
   * Increase the time between connection attempts
   */
  client.on('reconnect', () => {
    client.options.reconnectPeriod *= 2;
  });

  const job = setInterval(async () => {
    const sensor = await bme280.open();
    const data = await sensor.read();
    await sensor.close();

    console.log('Weather [t/p/h]: ' + data.temperature.toFixed(1) + 'º / ' +
      data.pressure.toFixed(0) + 'hPa / ' + data.humidity.toFixed(0) + '%');

    if(connected) {
      client.publish('weather/temperature', data.temperature.toString());
      client.publish('weather/pressure', data.pressure.toString());
      client.publish('weather/humidity', data.humidity.toString());
    }
  }, 10000);
}

run();
