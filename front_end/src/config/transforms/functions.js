export const addDisplayName = (data, key, emptyValue = 'null') => {
  const newData = JSON.parse(JSON.stringify(data));
  newData.forEach(entry => {
    if (entry[key] && entry[key].firstName && entry[key].lastName) {
      entry[key].displayName = `${entry[key].firstName} ${entry[key].lastName}`;
    } else {
      Object.assign(entry, { [key]: { displayName: emptyValue } });
    }
  });
  return newData;
};

export default {
  addDisplayName,
};
