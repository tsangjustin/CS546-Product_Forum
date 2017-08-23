var parser = new Parser(
  { whitespace: /\s+/,
    clothing: /#([^\[]+)\[([^\]]+)\]/,
    user: /@[\w-]+/,
    other: /\S+/ } );
var textArea = document.getElementById("content");
if (textArea) {
    new TextareaDecorator( textArea, parser );
}