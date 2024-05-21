const net = require('net');

let bloomAddress = null;
let bloomPort = null;

const bloomService = {
  initialize: async (address, port, urls, firstLine) => {
    try {
      console.log('Initializing service...');
      // Perform any async initialization tasks here
      let client = await connectToTCPServer(address, port);
      console.log('Connected to TCP server');

      const result = await sendMessage(client, firstLine);
      if (result === 'OK') {
        console.log('firstLine OK');
        const urlsArr = urls.split(',');
        for (let i = 0; i < urlsArr.length; i++) {
          let client = await connectToTCPServer(address, port);
          const message = "1 " + urlsArr[i];
          const result = await sendMessage(client, message);
          if (result === "true") {
            console.log('url ' + urlsArr[i] + ' added');
          } else {
            console.log('url ' + urlsArr[i] + ' not added');
          }
        }
      } else {
        console.log('firstLine NOK');
      }

      bloomAddress = address;
      bloomPort = port;

      console.log('Service initialized successfully');
    } catch (error) {
      console.error('Error initializing service:', error);
    }
  },

  checkUrl: async (url) => {
    if (bloomAddress === null || bloomPort === null) {
      throw new Error('service is not connected');
    }

    const client = await connectToTCPServer(bloomAddress, bloomPort);
    const message = "2 " + url;
    const result = await sendMessage(client, message);
    if (result === 'true') {
      return true;
    } else {
      return false;
    }
  }
};

function connectToTCPServer(host, port) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ host, port }, () => {
      resolve(client);
    });

    client.on('error', (err) => {
      reject(err);
    });
  });
}

// Function to send a message to the TCP server
function sendMessage(client, message) {
  return new Promise((resolve, reject) => {
    client.write(message, (err) => {
      if (err) {
        return reject(err);
      }
      client.once('data', (data) => {
        console.log(`Received response: ${data.toString()}`);
        resolve(data.toString());
      });
    });
  });
}

module.exports = bloomService;
