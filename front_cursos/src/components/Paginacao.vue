<template>
    <nav aria-label="Navegação de páginas">
        <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: paginaAtual === 1 }">
                <a class="page-link" href="#" @click.prevent="mudarPagina(paginaAtual - 1)">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Anterior</span>
                </a>
            </li>

            <li v-for="pagina in paginas" :key="pagina" class="page-item" :class="{ active: pagina === paginaAtual }">
                <a class="page-link" href="#" @click.prevent="mudarPagina(pagina)">{{ pagina }}</a>
            </li>

            <li class="page-item" :class="{ disabled: paginaAtual === totalPaginas }">
                <a class="page-link" href="#" @click.prevent="mudarPagina(paginaAtual + 1)">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Próximo</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'Paginacao',
    props: {
        totalItens: {
            type: Number,
            required: true
        },
        itensPorPagina: {
            type: Number,
            default: 10
        },
        paginaAtual: {
            type: Number,
            required: true
        }
    },
    computed: {
        totalPaginas() {
            return Math.ceil(this.totalItens / this.itensPorPagina)
        },
        paginas() {
            const paginas = []
            for (let i = 1; i <= this.totalPaginas; i++) {
                paginas.push(i)
            }
            return paginas
        }
    },
    methods: {
        mudarPagina(pagina) {
            if (pagina >= 1 && pagina <= this.totalPaginas) {
                this.$emit('mudar-pagina', pagina)
            }
        }
    }
}
</script>

<style scoped>
.pagination {
    margin-top: 2rem;
}
</style>