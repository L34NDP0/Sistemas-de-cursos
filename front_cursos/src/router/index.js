import { createRouter, createWebHistory, formatarData } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AlunosView from '../views/AlunosView.vue'
import DetalheAlunoView from '../views/DetalheAlunoView.vue'
import MatriculasView from '../views/MatriculasView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/alunos',
    name: 'alunos',
    component: AlunosView
  },
  {
    path: '/alunos/:id',
    name: 'DetalheAluno',
    component: DetalheAlunoView
  },
  {
    path: '/matriculas',
    name: 'matriculas',
    component: MatriculasView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router