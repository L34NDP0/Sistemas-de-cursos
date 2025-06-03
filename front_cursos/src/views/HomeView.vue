<template>
  <div class="container mx-auto p-4">
    <!-- Cabeçalho e Filtros -->
    <div class="row mb-4">
      <div class="col-md-3">
        <h2>Cursos</h2>
      </div>
      <div class="col-md-3">
        <select v-model="categoriaSelecionada" class="form-select">
          <option value="">Todas as Categorias</option>
          <option v-for="categoria in categorias" :key="categoria" :value="categoria">
            {{ categoria }}
          </option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="ordenacao" class="form-select">
          <option value="">Ordenar por Duração</option>
          <option value="asc">Menor Duração</option>
          <option value="desc">Maior Duração</option>
        </select>
      </div>
      <div class="col-md-3 text-end">
        <button @click="showAddModal = true" class="btn btn-primary">
          Novo Curso
        </button>
      </div>
    </div>

    <!-- Tabela de Cursos -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Nº</th>
                <th scope="col">Nome</th>
                <th scope="col">Descrição</th>
                <th scope="col">Categoria</th>
                <th scope="col">Duração (h)</th>
                <th scope="col">Data Criação</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="curso in cursosPaginados" :key="curso.id">
                <th scope="row">{{ curso.id }}</th>
                <td>{{ curso.name }}</td>
                <td>{{ curso.descricao }}</td>
                <td>{{ curso.categoria }}</td>
                <td>{{ curso.duracao }}h</td>
                <td>{{ formatarData(curso.data_criacao) }}</td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-info me-2" @click="verDetalhes(curso.id)">
                      Ver
                    </button>
                    <button class="btn btn-sm btn-warning me-2" @click="editarCurso(curso)">
                      Editar
                    </button>
                    <button class="btn btn-sm btn-danger" @click="confirmarDelecao(curso)">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="cursosPaginados.length === 0">
                <td colspan="7" class="text-center py-4">
                  Nenhum curso encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal de Detalhes -->
        <div class="modal fade show" :class="{ 'd-block': showDetailModal }" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Detalhes do Curso</h5>
                <button type="button" class="btn-close" @click="fecharModalDetalhes"></button>
              </div>
              <div class="modal-body" v-if="cursoSelecionado">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title mb-3">{{ cursoSelecionado.name }}</h4>

                    <div class="mb-3">
                      <h6 class="text-muted">Categoria</h6>
                      <p>{{ cursoSelecionado.categoria }}</p>
                    </div>

                    <div class="mb-3">
                      <h6 class="text-muted">Descrição</h6>
                      <p>{{ cursoSelecionado.descricao }}</p>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-6">
                        <h6 class="text-muted">Duração</h6>
                        <p>{{ cursoSelecionado.duracao }} horas</p>
                      </div>
                      <div class="col-md-6">
                        <h6 class="text-muted">Data de Criação</h6>
                        <p>{{ formatarData(cursoSelecionado.data_criacao) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="fecharModalDetalhes">
                  Fechar
                </button>
                <button type="button" class="btn btn-primary" @click="editarCurso(cursoSelecionado)">
                  Editar
                </button>
              </div>
            </div>
          </div>
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

        <!-- Barra de pesquisa centralizada abaixo da paginação -->
        <div class="d-flex justify-content-center mt-4">
          <input type="text" v-model="termoPesquisa" class="form-control w-50" placeholder="Pesquisar cursos...">
        </div>
      </div>
    </div>

    <!-- Modal Adicionar/Editar -->
    <div class="modal fade show" :class="{ 'd-block': showAddModal }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- ... cabeçalho do modal ... -->
          <form @submit.prevent="salvarCurso">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nome do Curso</label>
                <input type="text" v-model="novoCurso.name" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Descrição</label>
                <textarea v-model="novoCurso.descricao" class="form-control" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Categoria</label>
                <select v-model="novoCurso.categoria" class="form-select" required>
                  <option value="">Selecione uma categoria</option>
                  <option v-for="categoria in categorias" :key="categoria" :value="categoria">
                    {{ categoria }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Duração (horas)</label>
                <input type="number" v-model="novoCurso.duracao" class="form-control" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="fecharModal">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                {{ cursoEmEdicao ? 'Atualizar' : 'Salvar' }}
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
            <p>Tem certeza que deseja excluir este curso?</p>
            <p class="text-muted" v-if="cursoParaDeletar">
              Nome: {{ cursoParaDeletar.name }}<br>
              Duração: {{ cursoParaDeletar.duracao }}h
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deletarCurso">
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
  name: 'HomeView',
  data() {
    return {
      cursos: [],
      showAddModal: false,
      showDeleteModal: false,
      showDetailModal: false,
      cursoSelecionado: null,
      cursoEmEdicao: null,
      cursoParaDeletar: null,
      novoCurso: {
        name: '',
        descricao: '',
        duracao: '',
        categoria: ''
      },
      categorias: ['Programação', 'Design', 'Marketing', 'Negócios', 'Data Science'],
      categoriaSelecionada: '',
      ordenacao: '',
      termoPesquisa: '',
      paginaAtual: 1,
      itensPorPagina: 10
    }
  },
  computed: {
    cursosFiltrados() {
      let cursosFiltrados = [...this.cursos];

      // Filtro por texto
      if (this.termoPesquisa) {
        const termo = this.termoPesquisa.toLowerCase();
        cursosFiltrados = cursosFiltrados.filter(curso =>
          curso.name.toLowerCase().includes(termo) ||
          curso.descricao.toLowerCase().includes(termo)
        );
      }

      // Filtro por categoria
      if (this.categoriaSelecionada) {
        cursosFiltrados = cursosFiltrados.filter(curso =>
          curso.categoria === this.categoriaSelecionada
        );
      }

      // Ordenação por duração
      if (this.ordenacao) {
        cursosFiltrados.sort((a, b) => {
          if (this.ordenacao === 'asc') {
            return a.duracao - b.duracao;
          } else {
            return b.duracao - a.duracao;
          }
        });
      }

      return cursosFiltrados;
    },

    mostrarBackdrop() {
      return this.showAddModal || this.showDeleteModal || this.showDetailModal;
    },

    cursosPaginados() {
      const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
      const fim = inicio + this.itensPorPagina;
      return this.cursosFiltrados.slice(inicio, fim);
    },

    totalPaginas() {
      return Math.ceil(this.cursosFiltrados.length / this.itensPorPagina);
    }
  },

  watch: {
    termoPesquisa() {
      this.paginaAtual = 1;
    },
    categoriaSelecionada() {
      this.paginaAtual = 1;
    },
    ordenacao() {
      this.paginaAtual = 1;
    }
  },
  methods: {
    async buscarCursos() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/cursos`);
        this.cursos = await response.json();
      } catch (erro) {
        console.error('Erro ao buscar cursos:', erro);
        this.mostrarErro('Erro ao carregar cursos');
      }
    },

    formatarData(data) {
      if (!data) return '-';

      const [ano, mes, dia] = data.split('-');
      const dataUTC = new Date(Date.UTC(ano, mes - 1, dia));

      const locale = 'pt-BR';
      const opcoes = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
      };

      return dataUTC.toLocaleDateString(locale, opcoes);
    },
    // salvar cursos puxando a rota do .env
    async salvarCurso() {
      try {
        const url = this.cursoEmEdicao
          ? `${process.env.VUE_APP_API_URL}/cursos/${this.cursoEmEdicao.id}`
          : `${process.env.VUE_APP_API_URL}/cursos`;

        const method = this.cursoEmEdicao ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.novoCurso)
        });

        if (response.ok) {
          await this.buscarCursos();
          this.fecharModal();
        } else {
          const erro = await response.json();
          throw new Error(erro.message || 'Erro ao salvar curso');
        }
      } catch (erro) {
        console.error('Erro ao salvar curso:', erro);
        this.mostrarErro(erro.message);
      }
    },

    editarCurso(curso) {
      this.cursoEmEdicao = curso;
      this.novoCurso = { ...curso };
      this.showAddModal = true;
    },

    confirmarDelecao(curso) {
      this.cursoParaDeletar = curso;
      this.showDeleteModal = true;
    },
    async verDetalhes(cursoId) {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/cursos/${cursoId}`);
        if (response.ok) {
          this.cursoSelecionado = await response.json();
          this.showDetailModal = true;
        } else {
          throw new Error('Erro ao carregar detalhes do curso');
        }
      } catch (erro) {
        console.error('Erro ao carregar detalhes:', erro);
        this.mostrarErro('Erro ao carregar detalhes do curso');
      }
    },
    fecharModalDetalhes() {
      this.showDetailModal = false;
      this.cursoSelecionado = null;
    },

    async deletarCurso() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/cursos/${this.cursoParaDeletar.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await this.buscarCursos();
          this.showDeleteModal = false;
          this.cursoParaDeletar = null;
        } else {
          throw new Error('Erro ao excluir curso');
        }
      } catch (erro) {
        console.error('Erro ao deletar curso:', erro);
        this.mostrarErro(erro.message);
      }
    },

    fecharModal() {
      this.showAddModal = false;
      this.cursoEmEdicao = null;
      this.novoCurso = {
        name: '',
        descricao: '',
        duracao: ''
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
    this.buscarCursos();
  },
  watch: {
    termoPesquisa() {
      this.paginaAtual = 1;
    }
  }
}
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

.modal .card {
  border: none;
  box-shadow: none;
}

.modal .card-title {
  color: #2c3e50;
  font-weight: 600;
}

.modal h6.text-muted {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.modal p {
  margin-bottom: 0;
  font-size: 1rem;
}

.modal .row {
  margin-top: 1rem;
}

.modal .card {
  border: none;
  box-shadow: none;
}

.modal .card-title {
  color: #2c3e50;
  font-weight: 600;
}

.modal h6.text-muted {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.modal p {
  margin-bottom: 0;
  font-size: 1rem;
}

.modal .row {
  margin-top: 1rem;
}
</style>