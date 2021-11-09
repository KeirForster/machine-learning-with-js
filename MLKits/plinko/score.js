const OUTPUTS = [];
const K = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  OUTPUTS.push([dropPosition, bounciness, size, bucketLabel]);
}

function calcDistanceBetweenPoints(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

function runAnalysis() {
  const testSetSize = 10;
  const [testSet, trainingSet] = splitDataset(OUTPUTS, testSetSize);

  const accuracy = _.chain(testSet)
    .filter((testPoint) => knn(trainingSet, testPoint[0]) === testPoint[3])
    .size()
    .divide(testSetSize)
    .value();

  console.log(`Accuracy:`, `${accuracy * 100}%`);
}

function knn(data, point) {
  return _.chain(data)
    .map((row) => [calcDistanceBetweenPoints(row[0], point), row[3]])
    .sortBy((row) => row[0])
    .slice(0, K)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}
