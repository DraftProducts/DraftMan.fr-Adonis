var element = document.querySelector(".parallax");
element.style.backgroundPositionY = window.pageYOffset / 0.8 - element.offsetHeight * 0.7 + "px";
document.addEventListener("scroll", function () {
  element.style.backgroundPositionY = window.pageYOffset / 0.8 - element.offsetHeight * 0.7 + "px"
});

function insert(commentR,post_id,token,auth) {
  const ele = document.getElementById(commentR);
  if (ele.children[0].classList.contains("has-replies")) {
    ele.children[0].classList.remove("has-replies");
    ele.children[0].classList.add("had-replies")
  }
  if(auth === "1"){
    ele.children[1].innerHTML = `<form class="comment-form" replyto="${commentR}" action="/blog/${post_id}/comment" method="post"><input type="hidden" name="parent_id" id="parent_id" value="${commentR}"><textarea name="content" cols="30" rows="10" placeholder="Commentaire" required></textarea><input type="hidden" name="_csrf" value="${token}"><div> <input type="submit" value="Répondre au commentaire"></div></form>`;
  }else{
    ele.children[1].innerHTML = `<form class="comment-form" replyto="${commentR}" action="/blog/${post_id}/comment" method="post"><div class="compact"><div class="required"> <input type="text" name="name" placeholder="Pseudo" required/></div><div class="required"> <input type="text" name="email" placeholder="Email" required/></div><div> <input type="text" name="website" placeholder="Votre site"/></div></div><div class="compact"><div> <input type="text" name="twitter" placeholder="Twitter"/></div><div> <input type="text" name="github" placeholder="GitHub"/></div><div> <input type="text" name="linkedin" placeholder="Linkedin"/></div></div> <input type="hidden" name="parent_id" id="parent_id" value="${commentR}"><textarea name="content" cols="30" rows="10" placeholder="Commentaire" required></textarea><input type="hidden" name="_csrf" value="${token}"><div> <input type="submit" value="Répondre au commentaire"></div></form>`;
  }
  document.querySelector(".comment-form").style.opacity = 0;
  setTimeout(function () {
    document.querySelector(".comment-form").style.opacity = 1
  }, 300)
}
const reply = document.querySelectorAll(".reply");
reply.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const parent_id = item.getAttribute("replyto");
    const post_id = item.getAttribute("post_id");
    const token = item.getAttribute("token");
    const auth = item.getAttribute("auth");
    if (document.body.contains(document.querySelector(".comment-form"))) {
      const form = document.querySelector(".comment-form");
      form.style.opacity = 0;
      setTimeout(function () {
        form.remove()
      }, 300);
      if (form.getAttribute("replyto") != parent_id) {
        insert(parent_id,post_id,token,auth);
        document.getElementById(form.getAttribute("replyto")).children[0].classList.add("has-replies")
      } else if (document.getElementById(parent_id).children[0].classList.contains("had-replies")) {
        document.getElementById(parent_id).children[0].classList.add("has-replies")
      }
    } else {
      insert(parent_id,post_id,token,auth)
    }
  })
})
