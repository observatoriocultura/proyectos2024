// Obtiene la URL actual
const url = window.location.href;
// Crea un nuevo objeto URLSearchParams a partir de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Obtiene el valor del parámetro 'horizonte_id'
const elementoIdInicial = urlParams.get('festival_id');
const baseUrl = window.location.origin + window.location.pathname;

// VueApp
//-----------------------------------------------------------------------------
var festivalesApp = createApp({
    data(){
        return{
            nombreElemento: 'festival',
            nombreElementos: 'festivales',
            elementos: dataFestivales,
        }
    },
    methods: {
        
    },
    mounted(){
        //this.startApp()
    },
    computed: {
        

    }
}).mount('#festivalesApp')