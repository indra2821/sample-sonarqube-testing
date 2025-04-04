// test.js - A faulty JavaScript file with intentional errors

// Unused variable
let unusedVar = "This variable is never used";

// Missing semicolon
console.log("Hello, world")

// Undefined variable usage
console.log(notDefinedVar);

// Function with missing return statement
function faultyFunction() {
  if (true) {
    console.log("This function is missing a return statement")
  }
}

// Unreachable code
return;
console.log("This will never run");

// Bad indentation and missing brackets
function indentationIssue() 
  console.log("This should be inside a block");

// Infinite loop
while(true) {
  console.log("This will run forever");
}
