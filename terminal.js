input = document.getElementById("input");
output = document.getElementById("output"); 


function enterText() {
  let text = input.value
  input.value = ""
  if (!input.value) {
    return;
  }
  output.innerText += ("\n" + text)
  input.value = ""
}

function initTerminal() {  
  input.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      enterText();
    }
  });
}
