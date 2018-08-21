document.querySelector('#mobile-nav-button').addEventListener('click', a => {
    document.querySelector('#nav').classList.toggle('open');
    document.querySelector('#page').classList.toggle('overflow');
    document.querySelector('.cache').classList.toggle('active')
}), document.querySelector('.cache').addEventListener('click', a => {
    document.querySelector('#nav').classList.remove('open');
    document.querySelector('#page').classList.remove('overflow');
    document.querySelector('.cache').classList.remove('active')
});
window.addEventListener('DOMContentLoaded', function () {
	[...document.getElementsByTagName('a')].forEach(link => {
		if(link.href != "javascript:void(0)"){
			link.addEventListener('click',function(event){
					event.preventDefault();
					document.getElementById('preloader').classList.remove('none')
					document.getElementById('preloader').classList.remove('hidden')
					setTimeout(() => {
							window.location = link.href
					}, 250);
			})
		}
});
var x, i, j, selElmnt, a, b, c;
	x = document.getElementsByClassName("select-section");
	for (i = 0; i < x.length; i++) {
	  selElmnt = x[i].getElementsByTagName("select")[0];
	  a = document.createElement("div");
	  a.setAttribute("class", "select-selected");
	  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
	  x[i].appendChild(a);
	  b = document.createElement("div");
	  b.setAttribute("class", "select-items select-hide");
	  for (j = 1; j < selElmnt.length; j++) {
	    c = document.createElement("div");
	    c.innerHTML = selElmnt.options[j].innerHTML;
	    c.addEventListener("click", function(e) {
	        var y, i, k, s, h;
	        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
	        h = this.parentNode.previousSibling;
	        for (i = 0; i < s.length; i++) {
	          if (s.options[i].innerHTML == this.innerHTML) {
	            s.selectedIndex = i;
	            h.innerHTML = this.innerHTML;
	            y = this.parentNode.getElementsByClassName("same-as-selected");
	            for (k = 0; k < y.length; k++) {
	              y[k].removeAttribute("class");
	            }
	            this.setAttribute("class", "same-as-selected");
	            break;
	          }
	        }
	        h.click();
	    });
	    b.appendChild(c);
	  }
	  x[i].appendChild(b);
	  a.addEventListener("click", function(e) {
	      e.stopPropagation();
	      closeAllSelect(this);
	      this.nextSibling.classList.toggle("select-hide");
	      this.classList.toggle("select-arrow-active");
	  });
	}
	function closeAllSelect(elmnt) {
	  var x, y, i, arrNo = [];
	  x = document.getElementsByClassName("select-items");
	  y = document.getElementsByClassName("select-selected");
	  for (i = 0; i < y.length; i++) {
	    if (elmnt == y[i]) {
	      arrNo.push(i)
	    } else {
	      y[i].classList.remove("select-arrow-active");
	    }
	  }
	  for (i = 0; i < x.length; i++) {
	    if (arrNo.indexOf(i)) {
	      x[i].classList.add("select-hide");
	    }
	  }
	}
    document.addEventListener("click", closeAllSelect);
});