var parser = new Parser(
  { whitespace: /\s+/,
    clothing: /#([^\[]+)\[([^\]]+)\]/,
    user: /@[\w-]+/,
    other: /\S+/ } );
var textAreas = document.getElementsByTagName("textarea");
for(el of textAreas) {
    new TextareaDecorator( el, parser );
}