// Obtiene la URL actual
const url = window.location.href;
// Crea un nuevo objeto URLSearchParams a partir de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Obtiene el valor del parámetro 'entrevistado_id'
const elementoIdInicial = urlParams.get('entrevistado_id');
const baseUrl = window.location.origin + window.location.pathname;

// VueApp
//-----------------------------------------------------------------------------
var balanceApp = createApp({
    data(){
        return{
            nombreElemento: 'conclusión',
            nombreElementos: 'entrevistas',
            menu:[
                {name: 'horizontes.html', title: 'Horizontes', active: false},
                {name: 'explorar.html', title: 'Explorar', active: false},
                {name: 'balance.html', title: 'Balance', active: true},
                {name: 'info.html', title: 'Información', active: false},
            ],
            loading: false,
            section:'lista',
        }
    },
    methods: {
        
    },
    mounted(){
        //this.getList()
    },
    computed: {
        

    }
}).mount('#balanceApp')