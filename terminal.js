function enterText(input, output) {
  let text = input.value
  input.value = ""
  if (!input.value) {
    return;
  }
  output.innerText += ("\n" + text)
  input.value = ""
}

function initTerminal() {  
  input = document.getElementById("input");
  output = document.getElementById("output");
  
  input.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      enterText(input, output);
    }
  });
}
