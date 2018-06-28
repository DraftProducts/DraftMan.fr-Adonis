const scrolling = document.getElementById('menu');
const products_list = document.getElementsByClassName('content')[0];

window.addEventListener('scroll', function () {
    const bottom = products_list.offsetTop + products_list.offsetHeight;
    const margin = products_list.offsetHeight - scrolling.offsetHeight;
    const scrollTop = window.scrollY;
    if (scrollTop > document.getElementById('become').offsetHeight) {
        if (scrollTop > (bottom - 98)) {
            scrolling.style.marginTop = margin + "px";
            scrolling.style.position = 'static';
            return;
        }
        scrolling.style.position = 'fixed';
        scrolling.style.top = '98px';
        scrolling.style.marginTop = 'auto';
        return;
    }
    scrolling.style.position = 'static';
    scrolling.style.top = '0px';
    scrolling.style.marginTop = 'auto';
});