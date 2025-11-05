// As documented in https://github.com/corpauration/mdbook-treesitter
// This enables tree-sitter based syntax highlighting

let t = document.getElementsByClassName("language-treesitter");
for (let i = 0; i < t.length; i++) {
  t[i].innerHTML = t[i].innerText;
}
