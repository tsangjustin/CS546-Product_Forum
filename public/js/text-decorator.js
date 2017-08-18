var parser = new Parser(
  { whitespace: /\s+/,
    clothing: /#[\S ]+\[[\S ]+\]/,
    user: /@[\w-]+/,
    other: /\S+/ } );
var textArea = document.getElementById("post");
if (textArea) {
    new TextareaDecorator( textArea, parser );
}