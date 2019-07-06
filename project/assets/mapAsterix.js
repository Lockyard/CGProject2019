const startingPoint = [9, 6]

//doors: d-number-horizontal/vertical
var d01 = 'd-1-v'
var d02 = 'd-2-v'
var d03 = 'd-3-h'
var d04 = 'd-4-h' 
var d05 = 'd-5-h'
//levers
var l01 = 'l-1-e-0.75'
var l03 = 'l-3-n-0.75'
var l05 = 'l-5-n-0.75' //lever 5, connected to door 5, placed north in that tile, 0.75 from left to right
//keys
var k04 = 'k-4' //golden key, key connected to door 4
var k02 = 'k-2' //copper key

/**the same file as Map asterix converted in array of strings
 * x grows right, z grows down. Player starts from coord in startingPoint constant
 */
var mapAsterix = [
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w',k04,'f','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','f','f','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','f','f','f','w','w','f','f','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','f','w','f','f','f','w','f','w','w','w','w','w'],
    ['w','w','w','w','w','w','f','w','w','w','w','w','f','w','w','f','f','f','f','f','w','w','w','w'],
    ['w','w','w','w','w','w','f','w','w','w','f','f','f','f','f','w','w','w','f','f','w','w','w','w'],
    ['w','w','w','w','w','w','f','w','w','w',d05,'w','w','w','f','w','f','w','f','w','w','w','w','w'],
    ['w','w','w','w','w','w','f','w','w',l05,'f','w','f','f','f','w','f','w','f','w','w','w','w','w'],
    ['w','w','w','w','w','w','f','f','f','f','f','f','w','f','f','w','f','f','f','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','f','f','w','w','f','w','f','f','w','f','w','w','w','w','w'],
    ['w','w','w','w','w','w','f','f',l01,'w','w','f','w','f','w','f','f','w','f','w','w','w','w','w'],
    ['w','w','w','w','f','f','f','f','f','f',d01,'f','f','f','w',d03,'w','f','f','f','w',k02,'w','w'],
    ['w','w','w','w','f','w','f','f','f','w','w','f','w','w',l03,'f','w','w',d04,'w','f','f','f','w'],
    ['w','w','w','w','f','w','w','w','w','w','w','w','f','f','f','f','w','f','f','f','w','f','w','w'],
    ['w','w','f','f','f','f','f','f','f','f','f','f','f','w','w','f','w','f','f','f','w','f','w','w'],
    ['w','w','f','w','f','w','w','w','w','w','w','w','w','w','w','f','f','w','f','w','f','f','w','w'],
    ['w','w','f','w','f','f','f','f','f','f','f','f','f',d02,'e','w','f','f','f','f','f','w','w','w'],
    ['w','w','f','w','f','f','f','w','w','w','f','f','f','w','w','w','w','w','f','w','w','w','w','w'],
    ['w','w','f','w','w','w','w','w','f','w','f','w','w','f','f','f','f','f','f','w','w','w','w','w'],
    ['w','f','f','f','w','w','w','f','f','f','f','f','f','f','w','w','w','w','w','w','w','w','w','w'],
    ['w','f','f','f','f','f','f','f','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','f','f','f','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w']
    ];

