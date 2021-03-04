input = document.getElementById("input");
output = document.getElementById("output"); 


function enterText() {
  output.innerText += ("\n" + input.value)
  input.value = ""
}

function initTerminal() {  
  input.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      enterText()
    }
  });
}
