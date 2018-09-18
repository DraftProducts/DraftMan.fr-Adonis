const dashboard = new Vue({
    el: '#dashboard',
    delimiters: ['@{', '}'],
    data: {
        open: localStorage.getItem('open'),
        profil: false,
        name: '',
        type: '',
        description: '',
        message: '',
        refuse: false
    },
    mounted(){
        this.addEvents(this);
    },
    methods: {
        addEvents(vm) {
            window.addEventListener('scroll', function() {
                const bottom = vm.$refs.corps.offsetTop + vm.$refs.corps.offsetHeight;
                const margin = vm.$refs.corps.offsetHeight - vm.$refs.content.offsetHeight;
                const scrollTop = window.scrollY;
                if (scrollTop > 98) {
                    if (scrollTop > ((bottom - vm.$refs.content.clientHeight))) {
                        vm.$refs.content.style.marginTop = margin + "px";
                        vm.$refs.content.style.position = 'static';
                        return;
                    }
                    vm.$refs.content.style.position = 'fixed';
                    vm.$refs.content.style.top = '0';
                    vm.$refs.content.style.marginTop = 'auto';
                    return;
                }
                vm.$refs.content.style.position = 'static';
                vm.$refs.content.style.top = '0px';
                vm.$refs.content.style.marginTop = 'auto';
            });
            const inputs = document.querySelectorAll("form div input,form div textarea")
            inputs.forEach(input => {
                if(input.value !== "")input.classList.add("filled")
                input.addEventListener('change', () => {
                    if(input.value === ""){
                        input.classList.remove("filled")
                    } else {
                        input.classList.add("filled")
                    }
                })
            });
            const filesSection = document.querySelectorAll(".visu")
            filesSection.forEach(filesSec => {

                const file = filesSec.getElementsByClassName('file_input')[0]
                const preview = filesSec.getElementsByClassName('image')[0]
                file.addEventListener('change', () => {

                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        preview.style.backgroundImage = `url('${reader.result}')`
                    }, false);

                    if (file.files[0]) reader.readAsDataURL(file.files[0]);
                    if(filesSec.classList.contains('upload')){
                      filesSec.parentElement.submit()
                    }
                });
            });
        },
        toggleProfil: function(){
            this.profil = !this.profil
        },
        toggleRefuse: function(){
            this.refuse = !this.refuse
        }
    },
    watch: {
      toggleMenu: function () {
        localStorage.setItem('open', !this.open)
      }
    }
});
