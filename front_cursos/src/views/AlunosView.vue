<template>
    <div class="container mx-auto p-4">
        <!-- Cabeçalho e Filtros -->
        <div class="row mb-4">
            <div class="col-md-4">
                <h2>Alunos</h2>
            </div>
            <div class="col-md-4"></div>
            <div class="col-md-4 text-end">
                <button @click="showAddModal = true" class="btn btn-primary">
                    Novo Aluno
                </button>
            </div>
        </div>

        <!-- Tabela de Alunos -->
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Nº</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Email</th>
                                <th scope="col">Data Cadastro</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="aluno in alunosPaginados" :key="aluno.id">
                                <th scope="row">{{ aluno.id }}</th>
                                <td>{{ aluno.name }}</td>
                                <td>{{ aluno.email }}</td>
                                <td>{{ formatarData(aluno.data_criacao) }}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-warning me-2" @click="editarAluno(aluno)">
                                            Editar
                                        </button>
                                        <button class="btn btn-sm btn-danger" @click="confirmarDelecao(aluno)">
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="alunosPaginados.length === 0">
                                <td colspan="5" class="text-center py-4">
                                    Nenhum aluno encontrado
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
                </nav>
                <!-- Barra de pesquisa abaixo da paginação -->
                <div class="d-flex justify-content-center mt-4">
                    <input type="text" v-model="termoPesquisa" class="form-control w-50"
                        placeholder="Pesquisar Alunos...">
                </div>
            </div>
        </div>

        <!-- Modal Adicionar/Editar -->
        <div class="modal fade show" :class="{ 'd-block': showAddModal }" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ alunoEmEdicao ? 'Editar' : 'Novo' }} Aluno</h5>
                        <button type="button" class="btn-close" @click="fecharModal"></button>
                    </div>
                    <form @submit.prevent="salvarAluno">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Nome do Aluno</label>
                                <input type="text" v-model="novoAluno.name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" v-model="novoAluno.email" class="form-control" required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="fecharModal">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                {{ alunoEmEdicao ? 'Atualizar' : 'Salvar' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Modal de Confirmação de delete -->
        <div class="modal fade show" :class="{ 'd-block': showDeleteModal }" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar Exclusão</h5>
                        <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <p>Tem certeza que deseja excluir este aluno?</p>
                        <p class="text-muted" v-if="alunoParaDeletar">
                            Nome: {{ alunoParaDeletar.name }}<br>
                            Email: {{ alunoParaDeletar.email }}
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-danger" @click="deletarAluno">
                            Confirmar Exclusão
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
    name: "AlunosView",
    data() {
        return {
            alunos: [],
            showAddModal: false,
            showDeleteModal: false,
            alunoEmEdicao: null,
            alunoParaDeletar: null,
            novoAluno: {
                name: '',
                email: ''
            },
            termoPesquisa: '',
            paginaAtual: 1,
            itensPorPagina: 10
        };
    },
    computed: {
        alunosFiltrados() {
            if (!this.termoPesquisa) return this.alunos;

            const termo = this.termoPesquisa.toLowerCase();
            return this.alunos.filter(aluno =>
                aluno.name.toLowerCase().includes(termo) ||
                aluno.email.toLowerCase().includes(termo)
            );
        },
        alunosPaginados() {
            const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
            const fim = inicio + this.itensPorPagina;
            return this.alunosFiltrados.slice(inicio, fim);
        },
        totalPaginas() {
            return Math.ceil(this.alunosFiltrados.length / this.itensPorPagina);
        }
    },
    methods: {
        async buscarAlunos() {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/alunos`);
                const data = await response.json();
                this.alunos = data;
            } catch (erro) {
                console.error("Erro ao buscar alunos:", erro);
                this.mostrarErro("Erro ao carregar alunos");
            }
        },

        async salvarAluno() {
            try {
                const url = this.alunoEmEdicao
                    ? `${process.env.VUE_APP_API_URL}/alunos/${this.alunoEmEdicao.id}`
                    : `${process.env.VUE_APP_API_URL}/alunos`;
                const method = this.alunoEmEdicao ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.novoAluno)
                });

                if (response.ok) {
                    await this.buscarAlunos();
                    this.fecharModal();
                } else {
                    const erro = await response.json();
                    if (erro.campo && erro.mensagem) {
                        this.mostrarErro(erro.mensagem);
                    } else {
                        this.mostrarErro('Erro ao salvar aluno');
                    }
                }
            } catch (erro) {
                console.error("Erro ao salvar aluno:", erro);
                this.mostrarErro('E-mail inválido');
            }
        },

        editarAluno(aluno) {
            this.alunoEmEdicao = aluno;
            this.novoAluno = { ...aluno };
            this.showAddModal = true;
        },

        confirmarDelecao(aluno) {
            this.alunoParaDeletar = aluno;
            this.showDeleteModal = true;
        },

        async deletarAluno() {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/alunos/${this.alunoParaDeletar.id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await this.buscarAlunos();
                    this.showDeleteModal = false;
                    this.alunoParaDeletar = null;
                } else {
                    throw new Error('Erro ao excluir aluno');
                }
            } catch (erro) {
                console.error("Erro ao deletar aluno:", erro);
                this.mostrarErro(erro.message);
            }
        },

        fecharModal() {
            this.showAddModal = false;
            this.alunoEmEdicao = null;
            this.novoAluno = {
                name: '',
                email: ''
            };
        },

        mudarPagina(pagina) {
            if (pagina >= 1 && pagina <= this.totalPaginas) {
                this.paginaAtual = pagina;
            }
        },

        formatarData(data) {
            if (!data) return 'Data não disponível';

            const locale = 'pt-BR';
            return new Date(data + 'T00:00:00').toLocaleDateString(locale);
        },

        mostrarErro(mensagem) {
            alert(mensagem);
        }
    },
    mounted() {
        this.buscarAlunos();
    },
    watch: {
        termoPesquisa() {
            this.paginaAtual = 1;
        }
    }
};
</script>

<style scoped>
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

.btn-group .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}
</style>