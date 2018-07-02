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
                    if (scrollTop > ((bottom - vm.$refs.content.clientHeight) - 60)) {
                        vm.$refs.content.style.marginTop = margin + "px";
                        vm.$refs.content.style.position = 'static';
                        return;
                    }
                    vm.$refs.content.style.position = 'fixed';
                    vm.$refs.content.style.top = '60px';
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
        },
        toggleMenu: function(){
            this.open = !this.open
        }
    }
});