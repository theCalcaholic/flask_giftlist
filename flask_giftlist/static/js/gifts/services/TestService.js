angular.module("GiftsApp").factory("TestService", function() {

    testVar = "someString";

    result = {};

    testfunction = function() {
        console.log(this);
        console.log(testVar);
        (function() {
            console.log("insidefn");
            console.log(this);
            console.log(testVar);
        }).bind(result)();
    };

    result.testFunc1 = function() {
        console.log(this);
        console.log(testVar);
    };
    result.testFunc2 = function() {
        console.log(this);
        console.log(testVar);
    };
    result.testFunc3 = (function() {
        console.log(this);
        console.log(testVar);
    }).bind(this);
        /*testFunc4: (function() {
            console.log(this);
        }).bind(result),*/
    result.testFunc5 = testfunction.bind(result);
    result.testFunc6 = (testfunction).bind(this);
    return result;
})
