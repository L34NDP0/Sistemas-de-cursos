<template>
    <div class="card mb-3 cursor-pointer" @click="verDetalhes">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="card-title mb-0">{{ aluno.name }}</h5>
                <span class="badge bg-secondary">{{ aluno.email }}h</span>
            </div>

            <p class="card-text">{{ aluno.descricao }}</p>

            <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                <small class="text-muted">
                    Criado em: {{ formatarData(aluno.data_criacao) }}
                </small>
                <div class="btn-group">
                    <button @click.stop="$emit('editar', aluno)" class="btn btn-primary btn-sm">
                        Editar
                    </button>
                    <button @click.stop="$emit('deletar', aluno.id)" class="btn btn-danger btn-sm ms-2">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "aluno",
    props: {
        aluno: {
            type: Object,
            required: true
        }
    },
    methods: {
        formatarData(data) {
            if (!data) return '';
            return new Date(data).toLocaleDateString('pt-BR');
        },
        verDetalhes() {
            this.$router.push(`/aluno/${this.aluno.id}`);
        }
    }
};
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.card {
    min-height: 180px;

}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}
</style>