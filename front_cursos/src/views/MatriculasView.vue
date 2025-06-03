<template>
    <div class="container mx-auto p-4">
        <!-- Cabeçalho e Filtros -->
        <div class="row mb-4">
            <div class="col-md-6">
                <h2>Matrículas</h2>
            </div>
            <div class="col-md-6 text-end">
                <button @click="showAddModal = true" class="btn btn-primary">
                    Nova Matrícula
                </button>
            </div>
        </div>

        <!-- Tabela de Matrículas -->
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Nº</th>
                                <th scope="col">Aluno</th>
                                <th scope="col">Curso</th>
                                <th scope="col">Data Matrícula</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="matricula in matriculasPaginadas" :key="matricula.id">
                                <th scope="row">{{ matricula.id }}</th>
                                <td>{{ matricula.aluno_nome }}</td>
                                <td>{{ matricula.curso_nome }}</td>
                                <td>{{ formatarData(matricula.data_matricula) }}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-danger" @click="confirmarDelecao(matricula)">
                                            Cancelar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="matriculasPaginadas.length === 0">
                                <td colspan="5" class="text-center py-4">
                                    Nenhuma matrícula encontrada
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Paginação -->
                <nav aria-label="Navegação de páginas" class="mt-4">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: paginaAtual === 1 }">
                            <a class="page-link" href="#" @click.prevent="mudarPagina(paginaAtual - 1)">
                                Anterior
                            </a>
                        </li>
                        <li v-for="pagina in totalPaginas" :key="pagina" class="page-item"
                            :class="{ active: pagina === paginaAtual }">
                            <a class="page-link" href="#" @click.prevent="mudarPagina(pagina)">
                                {{ pagina }}
                            </a>
                        </li>
                        <li class="page-item" :class="{ disabled: paginaAtual === totalPaginas }">
                            <a class="page-link" href="#" @click.prevent="mudarPagina(paginaAtual + 1)">
                                Próximo
                            </a>
                        </li>
                    </ul>
                    <!-- Barra de pesquisa centralizada abaixo da paginação -->
                    <div class="d-flex justify-content-center mt-4">
                        <input type="text" v-model="termoPesquisa" class="form-control w-50"
                            placeholder="Pesquisar matrículas por aluno ou curso...">
                    </div>
                </nav>
            </div>
        </div>

        <!-- Modal Nova/Editar Matrícula -->
        <div class="modal fade show" :class="{ 'd-block': showAddModal }" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ matriculaEmEdicao ? 'Editar' : 'Nova' }} Matrícula
                        </h5>
                        <button type="button" class="btn-close" @click="fecharModal"></button>
                    </div>
                    <form @submit.prevent="salvarMatricula">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Curso</label>
                                <select v-model="novaMatricula.curso_id" class="form-select" required>
                                    <option value="">Selecione um curso</option>
                                    <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                                        {{ curso.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Aluno</label>
                                <select v-model="novaMatricula.aluno_id" class="form-select" required>
                                    <option value="">Selecione um aluno</option>
                                    <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
                                        {{ aluno.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="fecharModal">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                {{ matriculaEmEdicao ? 'Atualizar' : 'Salvar' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Modal de Confirmação de Deleção -->
        <div class="modal fade show" :class="{ 'd-block': showDeleteModal }" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar Cancelamento</h5>
                        <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <p>Tem certeza que deseja cancelar esta matrícula?</p>
                        <p class="text-muted" v-if="matriculaParaDeletar">
                            Aluno: {{ matriculaParaDeletar.aluno_nome }}<br>
                            Curso: {{ matriculaParaDeletar.curso_nome }}
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
                            Não
                        </button>
                        <button type="button" class="btn btn-danger" @click="deletarMatricula">
                            Sim, Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Overlay dos Modais -->
        <div class="modal-backdrop fade show" v-if="showAddModal || showDeleteModal"></div>
    </div>
</template>

<script>
export default {
    name: 'MatriculasView',
    data() {
        return {
            matriculas: [],
            cursos: [],
            alunos: [],
            showAddModal: false,
            showDeleteModal: false,
            matriculaEmEdicao: null,
            matriculaParaDeletar: null,
            novaMatricula: {
                curso_id: '',
                aluno_id: ''
            },
            paginaAtual: 1,
            itensPorPagina: 10,
            termoPesquisa: ''
        };
    },
    computed: {
        matriculasFiltradas() {
            if (!this.termoPesquisa) {
                return this.matriculas;
            }

            const termo = this.termoPesquisa.toLowerCase();
            return this.matriculas.filter(matricula =>
                matricula.aluno_nome.toLowerCase().includes(termo) ||
                matricula.curso_nome.toLowerCase().includes(termo)
            );
        },

        matriculasPaginadas() {
            const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
            const fim = inicio + this.itensPorPagina;
            return this.matriculasFiltradas.slice(inicio, fim);
        },

        totalPaginas() {
            return Math.ceil(this.matriculasFiltradas.length / this.itensPorPagina);
        }
    },
    methods: {
        async buscarDados() {
            try {
                // Buscar cursos
                const respCursos = await fetch(`${process.env.VUE_APP_API_URL}/cursos`);
                this.cursos = await respCursos.json();

                // Buscar alunos
                const respAlunos = await fetch(`${process.env.VUE_APP_API_URL}/alunos`);
                this.alunos = await respAlunos.json();

                // Buscar matrículas iniciais
                await this.buscarMatriculas();
            } catch (erro) {
                console.error('Erro ao carregar dados:', erro);
                this.mostrarErro('Erro ao carregar dados');
            }
        },

        async buscarMatriculas() {
            try {
                let url = `${process.env.VUE_APP_API_URL}/matriculas`;
                if (this.cursoSelecionado) {
                    url += `?curso_id=${this.cursoSelecionado}`;
                }
                const response = await fetch(url);
                const matriculas = await response.json();

                // Adicionar nomes de alunos e cursos
                this.matriculas = matriculas.map(m => ({
                    ...m,
                    aluno_nome: this.alunos.find(a => a.id === m.aluno_id)?.name || 'Desconhecido',
                    curso_nome: this.cursos.find(c => c.id === m.curso_id)?.name || 'Desconhecido'
                }));
            } catch (erro) {
                console.error('Erro ao buscar matrículas:', erro);
                this.mostrarErro('Erro ao carregar matrículas');
            }
        },

        formatarData(data) {
            if (!data) return 'Data não disponível';

            const locale = 'pt-BR';
            return new Date(data + 'T00:00:00').toLocaleDateString(locale);
        },

        async salvarMatricula() {
            try {
                const url = this.matriculaEmEdicao
                    ? `${process.env.VUE_APP_API_URL}/matriculas/${this.matriculaEmEdicao.id}`
                    : `${process.env.VUE_APP_API_URL}/matriculas`;

                const method = this.matriculaEmEdicao ? 'PUT' : 'POST';

                // validação dados matricula
                if (!this.novaMatricula.curso_id || !this.novaMatricula.aluno_id) {
                    throw new Error('Curso e Aluno são obrigatórios!');
                }

                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.novaMatricula)
                });
                // atualiza matriculas e fecha o modal
                if (response.ok) {
                    await this.buscarMatriculas();
                    this.fecharModal();
                } else {
                    const erro = await response.json();
                    throw new Error(erro.message || 'Erro ao salvar matrícula');
                }
            } catch (erro) {
                console.error('Erro ao salvar matrícula:', erro);
                this.mostrarErro(erro.message);
            }
        },

        confirmarDelecao(matricula) {
            this.matriculaParaDeletar = matricula;
            this.showDeleteModal = true;
        },

        async deletarMatricula() {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/matriculas/${this.matriculaParaDeletar.id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await this.buscarMatriculas();
                    this.showDeleteModal = false;
                    this.matriculaParaDeletar = null;
                } else {
                    throw new Error('Erro ao cancelar matrícula');
                }
            } catch (erro) {
                console.error('Erro ao deletar matrícula:', erro);
                this.mostrarErro(erro.message);
            }
        },

        fecharModal() {
            this.showAddModal = false;
            this.matriculaEmEdicao = null;
            this.novaMatricula = {
                curso_id: '',
                aluno_id: ''
            };
        },

        mudarPagina(pagina) {
            if (pagina >= 1 && pagina <= this.totalPaginas) {
                this.paginaAtual = pagina;
            }
        },

        mostrarErro(mensagem) {
            alert(mensagem);
        }
    },
    mounted() {
        this.buscarDados();
    },
    watch: {
        termoPesquisa() {
            this.paginaAtual = 1;
        },
    },
};
</script>

<style scoped>
.badge {
    font-size: 0.875rem;
    padding: 0.35em 0.65em;
}

.table th {
    background-color: #f8f9fa;
}

.table-responsive {
    margin-bottom: 1rem;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1040;
}

.modal {
    z-index: 1050;
}
</style>