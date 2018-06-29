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
                const bottom = vm.$refs.products_list.offsetTop + vm.$refs.products_list.offsetHeight;
                const margin = vm.$refs.products_list.offsetHeight - vm.$refs.scrolling.offsetHeight;
                const scrollTop = window.scrollY;
                if (scrollTop > 98) {
                    if (scrollTop > ((bottom - vm.$refs.scrolling.clientHeight) - 60)) {
                        vm.$refs.scrolling.style.marginTop = margin + "px";
                        vm.$refs.scrolling.style.position = 'static';
                        return;
                    }
                    vm.$refs.scrolling.style.position = 'fixed';
                    vm.$refs.scrolling.style.top = '60px';
                    vm.$refs.scrolling.style.marginTop = 'auto';
                    return;
                }
                vm.$refs.scrolling.style.position = 'static';
                vm.$refs.scrolling.style.top = '0px';
                vm.$refs.scrolling.style.marginTop = 'auto';
            });
        },
        toggleMenu: function(){
            this.open = !this.open
        }
    }
});