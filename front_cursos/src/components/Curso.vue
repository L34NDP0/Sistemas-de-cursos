<script>
export default {
    name: "Curso",
    props: {
        curso: {
            type: Object,
            required: true
        }
    },

    methods: {
        formatarData(data) {
            console.log("Data original:", data);
            if (!data) return 'Data não disponível';

            const dataUTC = new Date(data);
            console.log("Data UTC:", dataUTC);

            const dataAjustada = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);
            console.log("Data ajustada:", dataAjustada);

            const locale = 'pt-BR';
            const opcoes = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            };

            return dataAjustada.toLocaleDateString(locale, opcoes);
        }
    }
};
</script>