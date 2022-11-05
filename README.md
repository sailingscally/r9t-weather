# Weather Station

The weather station microservice for the R nineT Scrambler navigation tower collects environment data from
the [BME280](https://www.embeddedadventures.com/datasheets/BME280.pdf) sensor and publishes it to the
following MQTT topics:

- `weather/temperature` - ambient temperature in Celsius
- `weather/pressure` - atmospheric pressure in hectoPascals (hPa), also called millibars
- `weather/humidity` - relative humidity

## Running the Service

To run the service on system startup, the [PM2](https://pm2.keymetrics.io/) process manager for Node.JS
applications is used. It provides process monitoring capabilities which are great for this application.
To start the service run:

```
pm2 start app.js --name weather --watch --time
```
