const dashboard = new Vue({
    el: '#dashboard',
    data: {
        open: true,
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
            const inputs = document.querySelectorAll("form div input")
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
            
            vm.$refs.file.addEventListener('change', () => {
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                    console.log(reader.result)
                    vm.$refs.preview.style.backgroundImage = `url('${reader.result}')`
                }, false);
    
                if (vm.$refs.file.files[0]) reader.readAsDataURL(vm.$refs.file.files[0]);
            });
        },
        toggleMenu: function(){
            this.open = !this.open
        }
    }
});