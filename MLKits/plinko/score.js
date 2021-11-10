const OUTPUTS = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  OUTPUTS.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 100;
  const [testSet, trainingSet] = splitDataset(OUTPUTS, testSetSize);

  _.range(1, 20).forEach((k) => {
    const accuracy = _.chain(testSet)
      .filter(
        (testPoint) =>
          knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
      )
      .size()
      .divide(testSetSize)
      .value();

    console.log(`For k of ${k}, accuracy is: `, `${accuracy * 100}%`);
  });
}

function knn(data, testRow, k) {
  return _.chain(data)
    .map((row) => {
      return [calcDistanceBetweenPoints(_.initial(row), testRow), _.last(row)];
    })
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

function calcDistanceBetweenPoints(pointA, pointB) {
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}
