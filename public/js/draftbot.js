window.addEventListener('DOMContentLoaded', function () {
  const headline = document.getElementById('annimated-texts')
  const animationDelay = 2500;

  setTimeout(function(){ hideWord( headline.querySelector('.is-visible'))}, animationDelay);

  function hideWord($word) {
    var nextWord = $word !== headline.lastElementChild ? $word.nextElementSibling : $word.parentElement.children[0];

    $word.classList.remove('is-visible')
    $word.classList.add('is-hidden')

    nextWord.classList.add('is-visible')
    nextWord.classList.remove('is-hidden')
    setTimeout(function(){ hideWord(nextWord) }, animationDelay);
  }
})
