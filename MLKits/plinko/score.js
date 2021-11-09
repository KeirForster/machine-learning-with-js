const OUTPUTS = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  OUTPUTS.push([dropPosition, bounciness, size, bucketLabel]);
}

function calcDistanceBetweenPoints(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

function runAnalysis() {
  const testSetSize = 100;
  const [testSet, trainingSet] = splitDataset(OUTPUTS, testSetSize);

  _.range(1, 20).forEach((k) => {
    const accuracy = _.chain(testSet)
      .filter((testPoint) => knn(trainingSet, testPoint[0], k) === testPoint[3])
      .size()
      .divide(testSetSize)
      .value();

    console.log(`For k of ${k}, accuracy is: `, `${accuracy * 100}%`);
  });
}

function knn(data, point, k) {
  return _.chain(data)
    .map((row) => [calcDistanceBetweenPoints(row[0], point), row[3]])
    .sortBy((row) => row[0])
    .slice(0, k)
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
