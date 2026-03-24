// Check for substrings for iOS 9 compatibility using ES5-compatible methods
var someString = 'Hello World';

// Replacing .includes() with .indexOf()
if (someString.indexOf('World') !== -1) {
    console.log('Found World');
}

// Replacing .endsWith() with .substring() method
if (someString.substring(someString.length - 5) === 'World') {
    console.log('String ends with World');
}