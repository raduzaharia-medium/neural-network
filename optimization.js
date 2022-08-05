let data = [[0, 0, 0], [0.1, 0.1, 0.2], [0.1, 0.2, 0.2], [0.2, 0.2, 0.4], [0.2, 0.3, 0.6], [0.2, 0.4, 0.8], [0.2, 0.6, 1.2], 
  [0.3, 0.3, 0.9], [0.3, 0.2, 0.6], [0.3, 0.4, 1.2], 
  [0.4, 0.4, 1.6]];  // sample training data [input1, input2, expectedOutput]
let globalBestNetwork = generatePosition();
let currentNetworks = [];
let bestNetworks = [];

function processSignals(weights, inputs) {
	let result = 0;
  
  for (let i = 0; i < weights.length; i++) result += weights[i] * inputs[i];
  return result; //1.0 / (1.0 + Math.exp(result));     // we applied the famous sigmoid function to keep the result between 0 and 1
}

function sendSignalsThroughNetwork(network, inputs) {
	let result = [...inputs];
  let nextValues = [...inputs];
  
  for (let i = 0; i < network.length; i++) {
    const networkLayer = network[i];
    
    for (let j = 0; j < networkLayer.length; j++) {
    	nextValues[j] = processSignals(networkLayer[j], result);
    }
    result = [...nextValues];
  }
  
  return (result[0] + result[1]) / 2;
}

function generatePosition() {
	return [
  	[[Math.random(), Math.random(), Math.random()], [Math.random(), Math.random(), Math.random()]], 
  	[[Math.random(), Math.random(), Math.random()], [Math.random(), Math.random(), Math.random()]],
    [[Math.random(), Math.random(), Math.random()], [Math.random(), Math.random(), Math.random()]],
    [[Math.random(), Math.random(), Math.random()], [Math.random(), Math.random(), Math.random()]]
  ];
}

function approach(currentPosition, bestPosition, position) {
  let result = currentPosition;
  
  for (let i = 0; i < result.length; i++) 
    for (let j = 0; j < result[i].length; j++) 
      for (let k = 0; k < result[i][j].length; k++)
        result[i][j][k] += 
          2 * Math.random() * (bestPosition[i][j][k] - currentPosition[i][j][k]) + 
          2 * Math.random() * (position[i][j][k] - currentPosition[i][j][k]);
          
  return result;
}

function evaluate(position) {
  let error = 0;
  
  for (let i = 0; i < data.length ; i++) {
    let result = sendSignalsThroughNetwork(position, data[i]);
    error += Math.abs(result - data[i][2]);
  }
  
  return error;
}

function draw(position) {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  context.strokeStyle = "#F4F776";
  context.lineWidth = 2;

  context.beginPath();
  context.arc(
    Math.abs(position[0]) < 100 ? Math.abs(position[0]) * 150 : Math.abs(position[0]), 
    Math.abs(position[1]) < 100 ? Math.abs(position[1]) * 150 : Math.abs(position[1]), 
    5, 0, 2 * Math.PI);
  context.stroke();
}

function clearCanvas() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function optimize() {
  clearCanvas();

  for (var i = 0; i < currentNetworks.length; i++) {
    currentNetworks[i] = approach(currentNetworks[i], bestNetworks[i], globalBestNetwork);

    if (evaluate(currentNetworks[i]) < evaluate(bestNetworks[i])) bestNetworks[i] = currentNetworks[i];
    if (evaluate(currentNetworks[i]) < evaluate(globalBestNetwork)) globalBestNetwork = currentNetworks[i];

    for (let j = 0; j < currentNetworks[i].length; j++) 
      for (let k = 0; k < currentNetworks[i][j].length; k++)
        draw(currentNetworks[i][j][k]);
  }

  requestAnimationFrame(optimize);
}

// we generate 20 agents in the swarm
for (let i = 0; i < 20; i++) {
	currentNetworks.push(generatePosition());
  bestNetworks.push(generatePosition());
}

requestAnimationFrame(optimize);
