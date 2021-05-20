const express = require('express');
const app = express();
const path = require("path");
const AtomicKafka = require('atomic-kafka')

const port = 3001;


app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.get('/', (req, res) => {
  console.log('*** serving root of demo app ( / )');
  res.sendFile(path.resolve(__dirname + '/index.html'))
})

/**
 * 404 handler
 */
app.use('*', (req, res) => {
  return res.status(404).send('********** GLOBAL BAD REQUEST / 404 ERROR **********');
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const atomicKafkaInstance = new AtomicKafka(server);
atomicKafkaInstance.newConsumer('truck-group');
atomicKafkaInstance.socketConsume('truck-group', 'test_topic');
// atomicKafkaInstance.newProducer('test_topic');
// atomicKafkaInstance.socketProduce('test_topic', 4000);
