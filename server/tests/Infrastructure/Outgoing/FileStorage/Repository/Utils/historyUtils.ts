import assert from 'node:assert/strict';

export const objectWithoutTimestamp = (obj: object): object => {
  let objWithoutTimestamp = { ...obj };
  if ('timestamp' in objWithoutTimestamp) delete objWithoutTimestamp.timestamp;
  return objWithoutTimestamp;
}

export const assertEqualWithoutId = (actual: object, expected: object) => {
  let actualWithoutId = { ...actual };
  if ('id' in actualWithoutId) delete actualWithoutId.id;

  assert.deepEqual(actualWithoutId, expected);
}

export const assertTimestamp = (timestampString: string) => {
  const actualTimestamp = new Date(timestampString);
  const now = new Date();
  assert(actualTimestamp <= now, 'Timestamp should be in the past');
  now.setSeconds(now.getSeconds() - 1);
  assert(actualTimestamp > now, 'Timestamp should be within the last second');
};