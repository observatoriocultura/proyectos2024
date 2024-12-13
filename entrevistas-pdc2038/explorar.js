// Obtiene la URL actual
const url = window.location.href;
// Crea un nuevo objeto URLSearchParams a partir de la URL actual
const urlParams = new URLSearchParams(window.location.search);
// Obtiene el valor del parámetro 'horizonte_id'
const elementoIdInicial = urlParams.get('horizonte_id');
const baseUrl = window.location.origin + window.location.pathname;

// VueApp
//-----------------------------------------------------------------------------
var explorarApp = createApp({
    data(){
        return{
            nombreElemento: 'conclusión',
            nombreElementos: 'horizontes',
            menu:[
                {name: 'horizontes.html', title: 'Horizontes', active: false},
                {name: 'entrevistas.html', title: 'Entrevistas', active: false},
                {name: 'explorar.html', title: 'Explorar', active: true},
                {name: 'balance.html', title: 'Balance', active: false},
                {name: 'info.html', title: 'Información', active: false},
            ],
            prospectivas: [
                {name:'Oportunidad', title:'Oportunidad'},
                {name:'Fortaleza', title:'Fortaleza'},
                {name:'Amenaza', title:'Amenaza'},
                {name:'Debilidad', title:'Debilidad'},
            ],
            tiposConclusion:[
                {name:'Identificación del Problema',title:'Identificación del Problema'},
                {name:'Otra Perspectiva',title:'Otra Perspectiva'},
                {name:'Soluciones Propuestas',title:'Soluciones Propuestas'},
            ],
            contenidos: dataContenidos,
            loading: false,
            section:'conclusionesN2',
            horizontes: dataHorizontes,
            conclusionesGenerales: dataConclusionesGenerales,
            conclusionesN2: dataConclusionesN2,
            conclusiones: dataConclusiones,
            currentId: elementoIdInicial,
            currentElement: {'id':0,'nombre':'Cargando...'},
            q: '',
            filters: {
                horizonteId: 0,
                prospectiva: '',
                tipoConclusion: '',
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
            this.section = 'conclusionesN2'
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
            if (this.filters.horizonteId > 0) {
                listaFiltrada = listaFiltrada.filter(conclusion => conclusion.horizonte_id == this.filters.horizonteId)
            }
            if (this.filters.prospectiva != '') {
                listaFiltrada = listaFiltrada.filter(conclusion => conclusion['Prospectiva'] == this.filters.prospectiva)
            }
            if (this.filters.tipoConclusion != '') {
                listaFiltrada = listaFiltrada.filter(conclusion => conclusion['Tipo de Conclusión'] == this.filters.tipoConclusion)
            }
            return listaFiltrada
        },
        conclusionesGeneralesFiltradas: function() {
            var listaFiltrada = this.conclusionesGenerales
            listaFiltrada = listaFiltrada.filter(conclusion => conclusion.horizonte_id == this.currentElement.id)
            return listaFiltrada
        },

    }
}).mount('#explorarApp')