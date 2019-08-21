/* eslint-disable no-console */
'use strict';
const superagent = require('superagent');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/location', (request, response) => {
  try {
   superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODEAPI_KEY}`)
   .then((geoData) => {
     const location = new Location(request.query.data, geoData.body);
     response.send(location);
   });
    
  } catch(error) {
    response.status(500).send('Dis website is broke. Call someone who cares.');
  }
});

function Location(query, geoData){
  this.search_query = query;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function Event(eventData) {
  this.link = eventData.url;
  this.name = eventData.name.text;
  this.event_date = eventData.url;
  this.summary = eventData.description.text;
};

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);

  }


app.get('/weather', (request, response) => {
  try {
    const url = `https://api.darksky.net/forecast/${process.env.DARKSKYAPI_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;

    return superagent.get(url)
      .then((result) => {
        const weatherSummaries = result.body.daily.data.map((day) => new Weather(day));
          response.send(weatherSummaries);
        });
        
      } catch(error) {
          response.status(500).send('Dis website is broke. Call someone who cares.');
      } 
      
});
app.get('/event', (request, response) => {
  try {
    const url = `https://www.eventbriteapi.com/v3/events/search/?token=${process.env.EVENTBRITE_API_KEY}&location.latitude=${request.query.data.latitude}&location.longitude=${request.query.data.longitude}&location.within=10km`;

    return superagent.get(url)
      .then((result) => {
        const eventSummaries = result.body.events.map((event) => new Event(event));
          response.send(eventSummaries);
        });
        
      } catch(error) {
          response.status(500).send('Shit\'s on fire yo.');
      } 
});
      

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('I know that you came to party baby, baby, baby, baby');
});
