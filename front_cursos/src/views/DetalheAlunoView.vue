<template>
    <div class="aluno-detalhes">
        <h1>Detalhes do Aluno</h1>
        <div v-if="aluno.name">
            <p><strong>Nome:</strong> {{ aluno.name }}</p>
            <p><strong>Email:</strong> {{ aluno.email }}</p>
            <p><strong>Criado em:</strong> {{ formatarData(aluno.data_criacao) }}</p>
            <p><strong>Última Atualização:</strong> {{ formatarData(aluno.data_atualizacao) }}</p>


            <button @click="voltar">Voltar</button>
        </div>
        <div v-else>
            <p>Carregando dados do aluno...</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DetalheAluno',
    data() {
        return {
            aluno: {}
        }
    },
    methods: {
        voltar() {
            this.$router.push({ name: 'alunos' });
        },
        formatarData(data) {
            if (!data) return '-'
            return new Date(data).toLocaleDateString('pt-BR')
        },
        async carregarAluno() {
            try {
                const alunoId = this.$route.params.id
                const responseAluno = await fetch(`${process.env.VUE_APP_API_URL}/alunos/${alunoId}`)
                if (!responseAluno.ok) {
                    throw new Error('Falha ao carregar o aluno')
                }
                this.aluno = await responseAluno.json()

            } catch (erro) {
                console.error('Erro ao carregar dados:', erro)
            }
        }
    },
    mounted() {
        this.carregarAluno()
    }
}
</script>




<style scoped>
.card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-secondary:hover {
    background-color: #5a6268;
}
</style>