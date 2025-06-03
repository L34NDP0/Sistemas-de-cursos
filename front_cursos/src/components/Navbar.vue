<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <img alt="Vue logo" src="../assets/logo.png" class="logo" width="110" height="100" />
            <!-- Título com Router Link -->
            <router-link to="/" class="navbar-brand text-xl font-bold">Sistema de Cursos</router-link>

            <!-- Botão para versão responsiva -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Itens da Navbar -->
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <!-- Dropdown -->
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Selecione a Categoria
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <li><router-link to="/" class="dropdown-item">Cursos</router-link></li>
                            <li><router-link to="/alunos" class="dropdown-item">Alunos</router-link></li>
                            <li><router-link to="/matriculas" class="dropdown-item">Matrículas</router-link></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Navbar",
};
</script>

<style scoped>
.logo {
    opacity: 0.9;
    margin-right: 16px;
    /* Ajuste o valor como desejar */
}
</style>