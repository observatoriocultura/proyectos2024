// Obtiene la URL actual
const url = window.location.href;
// Crea un nuevo objeto URLSearchParams a partir de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Obtiene el valor del parámetro 'horizonte_id'
const elementoIdInicial = urlParams.get('horizonte_id');
const baseUrl = window.location.origin + window.location.pathname;

// VueApp
//-----------------------------------------------------------------------------
var horizontesApp = createApp({
    data(){
        return{
            nombreElemento: 'conclusión',
            nombreElementos: 'horizontes',
            menu:[
                {name: 'horizontes.html', title: 'Horizontes', active: true},
                {name: 'entrevistas.html', title: 'Entrevistas', active: false},
                {name: 'explorar.html', title: 'Explorar', active: false},
                {name: 'balance.html', title: 'Balance', active: false},
            ],
            submenu:[
                {name: 'resumen', title: 'Resumen', active: true, display: true},
                {name: 'conclusiones', title: 'Conclusiones', active: false, display: true},
                {name: 'nubes', title: 'Nube de palabras', active: false, display: true},
                {name: 'conclusionesN2', title: 'Detalles', active: false, display: true},
                {name: 'conclusionesDetalladas', title: 'Detalles', active: false, display: false},
            ],
            contenidos: dataContenidos,
            loading: false,
            section:'lista',
            elementos: dataHorizontes,
            conclusionesGenerales: dataConclusionesGenerales,
            conclusionesN2: dataConclusionesN2,
            conclusiones: dataConclusiones,
            parrafos: dataParrafos,
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
            axios.get('projects/entrevistas-pdc2038/data/horizontes.json')
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
        setCurrent: function(horizonteId, newSection = ''){
            if ( newSection.length > 0 ) this.section = newSection
            this.currentId = horizonteId
            this.currentElement = this.elementos.find(elemento => elemento['id'] == horizonteId)
            this.scrollToTop()
            history.pushState(null, null, baseUrl +'?horizonte_id=' + horizonteId)
        },
        resetCurrent: function(){
            this.section = 'lista'
            this.currentId = 0
            this.currentElement = {'id':0,'nombre':'Cargando...'},
            this.scrollToTop()
            history.pushState(null, null, baseUrl)
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
        sentimientoPercent: function(sentimiento){
            var sentimientoPercent = 100 * Math.abs(-1-sentimiento)/2;
            return sentimientoPercent;
        },
        classSentimiento: function(sentimiento){
            if (sentimiento > 0.2 ) { return 'sentimiento-positivo' }
            if (sentimiento < -0.2 ) { return 'sentimiento-negativo' }
            return 'sentimiento-neutral'
        },
        setSubmenu: function(newSubmenu){
            this.section = newSubmenu
        },
        startApp: function(){
            //this.setCurrent(1)
            //this.section = 'resumen'
        },
    },
    mounted(){
        this.startApp()
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
            listaFiltrada = listaFiltrada.filter(conclusion => conclusion.horizonte_id == this.currentElement.id)
            return listaFiltrada
        },
        conclusionesN2Filtradas: function() {
            var listaFiltrada = this.conclusionesN2
            listaFiltrada = listaFiltrada.filter(conclusion => conclusion.horizonte_id == this.currentElement.id)
            return listaFiltrada
        },
        conclusionesGeneralesFiltradas: function() {
            var listaFiltrada = this.conclusionesGenerales
            listaFiltrada = listaFiltrada.filter(conclusion => conclusion.horizonte_id == this.currentElement.id)
            return listaFiltrada
        },

    }
}).mount('#horizontesApp')