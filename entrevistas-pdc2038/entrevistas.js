// Obtiene la URL actual
const url = window.location.href;
// Crea un nuevo objeto URLSearchParams a partir de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Obtiene el valor del parámetro 'entrevistado_id'
const elementoIdInicial = urlParams.get('entrevistado_id');
const baseUrl = window.location.origin + window.location.pathname;

// VueApp
//-----------------------------------------------------------------------------
var entrevistasApp = createApp({
    data(){
        return{
            nombreElemento: 'conclusión',
            nombreElementos: 'entrevistas',
            menu:[
                {name: 'horizontes.html', title: 'Horizontes', active: false},
                {name: 'explorar.html', title: 'Explorar', active: false},
                {name: 'balance.html', title: 'Balance', active: false},
                {name: 'info.html', title: 'Información', active: false},
            ],
            loading: false,
            section:'lista',
            elementos: dataEntrevistas,
            conclusiones: dataConclusiones,
            currentId: elementoIdInicial,
            currentElement: {'id':0,'nombre':'Cargando...'},
            q: '',
            filters: {
                status: '' 
            },
            filtroEstados: ['en-revision','finalizado'],
        }
    },
    methods: {
        setSection: function(newSection){
            this.section = newSection
            if ( newSection = 'lista' ) {
                history.pushState(null, null, baseUrl)
            }
        },
        getList: function(){
            this.loading = true
            axios.get('projects/entrevistas-pdc2038/data/entrevistas.json')
            .then(response => {
                this.elementos = response.data
            })
            .catch(function(error) { console.log(error) })
        },
        checkCurrent: function(){
            if ( elementoIdInicial > 0) {
                this.setCurrent(elementoIdInicial)
            }
        },
        clearSearch: function(){
            this.q = ''
            this.setSection('lista')
            history.pushState(null, null, baseUrl)
        },
        textToClass: function(text, prefix = null){
            if ( prefix == null) {
                return Pcrn.textToClass(text)
            }
            return prefix + '-' + Pcrn.textToClass(text)
        },
        setCurrent: function(entrevistadoId){
            this.section = 'conclusiones'
            this.currentId = entrevistadoId
            this.currentElement = this.elementos.find(elemento => elemento['id'] == entrevistadoId)
            this.scrollToTop()
            history.pushState(null, null, baseUrl +'?entrevistado_id=' + entrevistadoId)

        },
        scrollToTop: function(){
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        relevanciaPercent: function(relevancia){
            var percent = relevancia * 100
            return `width: ${percent}%;`;
        },
        classSentimiento: function(sentimiento){
            if (sentimiento > 0.2 ) { return 'sentimiento-positivo' }
            if (sentimiento < -0.2 ) { return 'sentimiento-negativo' }
            return 'sentimiento-neutral'
        },
    },
    mounted(){
        //this.getList()
    },
    computed: {
        elementosFiltrados: function() {
            var listaFiltrada = this.elementos
            //listaFiltrada = listaFiltrada.filter(elemento => this.filtroEstados.includes(elemento['estado']))
            if (this.q.length > 0) {
                var fieldsToSearch = ['nombre','descripcion']
                listaFiltrada = PmlSearcher.getFilteredResults(this.q, listaFiltrada, fieldsToSearch)
            }
            return listaFiltrada
        },
        conclusionesFiltradas: function() {
            var listaFiltrada = this.conclusiones
            //listaFiltrada = listaFiltrada.filter(elemento => this.filtroEstados.includes(elemento['estado']))
            listaFiltrada = listaFiltrada.filter(conclusion => conclusion.entrevistado_id == this.currentElement.id)
            /*if (this.q.length > 0) {
                var fieldsToSearch = ['nombre','descripcion']
                listaFiltrada = PmlSearcher.getFilteredResults(this.q, listaFiltrada, fieldsToSearch)
            }*/
            return listaFiltrada
        },

    }
}).mount('#entrevistasApp')