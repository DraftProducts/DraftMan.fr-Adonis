document.querySelector('#mobile-nav-button').addEventListener('click', a => {
    document.querySelector('#nav').classList.toggle('open');
    document.querySelector('#page').classList.toggle('overflow');
    document.querySelector('.cache').classList.toggle('active')
}), document.querySelector('.cache').addEventListener('click', a => {
    document.querySelector('#nav').classList.remove('open');
    document.querySelector('#page').classList.remove('overflow');
    document.querySelector('.cache').classList.remove('active')
});