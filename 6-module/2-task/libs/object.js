const removeProperty = (prop) => ({[prop]: undefined, ...object}) => object;
module.exports.removeProperty = removeProperty;
