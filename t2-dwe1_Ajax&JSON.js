$(document).ready(function () {

    // URLs fornecidas no documento PDF
    const URL_LIST = "https://epansani.com.br/2025/dwe1/ajax/list.php";
    const URL_INS = "https://epansani.com.br/2025/dwe1/ajax/ins.php";
    const URL_REM = "https://epansani.com.br/2025/dwe1/ajax/rem.php";

    // Função para carregar os dados na tabela (Listagem)
    function carregarTabela() {
        $.ajax({
            url: URL_LIST,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Limpa a tabela antes de preencher
                $('#tabelaCorpo').empty();

                // Itera sobre o array de objetos retornado
                $.each(data, function (index, item) {
                    let linha = `
                        <tr>
                            <td>${item.nome}</td>
                            <td>${item.email}</td>
                            <td>
                                <button class="btn-apagar" data-id="${item.id}">Apagar</button>
                            </td>
                        </tr>
                    `;
                    $('#tabelaCorpo').append(linha);
                });
            },
            error: function (xhr, status, error) {
                console.error("Erro ao carregar dados:", error);
                // alert("Erro ao carregar a lista de dados."); // Opcional: comentar se incomodar no inicio
            }
        });
    }

    // Carregar a tabela assim que a página abrir
    carregarTabela();

    // Evento do botão "Atualizar dados tabela"
    $('#btnAtualizar').click(function () {
        carregarTabela();
    });

    // Evento do botão "Limpar"
    $('#btnLimpar').click(function () {
        $('#nome').val('');
        $('#email').val('');
        $('#mensagem').html('');
    });

    // Evento do botão "Gravar" (Inserção)
    $('#btnGravar').click(function () {
        let nome = $('#nome').val();
        let email = $('#email').val();

        if (nome === '' || email === '') {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // Cria o objeto JSON conforme pedido
        let dadosEnvio = {
            nome: nome,
            email: email
        };

        $.ajax({
            url: URL_INS,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dadosEnvio),
            success: function (resposta) {
                if (resposta === true) {
                    // Exibe mensagem de sucesso
                    $('#mensagem').html('<div class="alert alert-success">Dados gravados com sucesso.</div>');

                    // Limpa o formulário
                    $('#nome').val('');
                    $('#email').val('');

                    // Atualiza a tabela automaticamente
                    carregarTabela();

                    // Remove a mensagem após 3 segundos
                    setTimeout(function () { $('#mensagem').html(''); }, 3000);
                } else {
                    alert("Erro ao gravar os dados no servidor.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Erro na inserção:", error);
                alert("Erro de conexão ao tentar salvar.");
            }
        });
    });

    // Evento do botão "Apagar" (Exclusão)
    $(document).on('click', '.btn-apagar', function () {
        let idParaApagar = $(this).data('id');

        // CORREÇÃO: Definindo o objeto com o ID a ser apagado
        let dadosEnvio = {
            id: idParaApagar
        };

        $.ajax({
            url: URL_REM,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dadosEnvio),
            success: function (resposta) {
                if (resposta === true) {
                    // Recarrega a tabela para sumir com o item
                    carregarTabela();
                } else {
                    alert("Não foi possível apagar o registro.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Erro na exclusão:", error);
                alert("Erro de conexão ao tentar apagar.");
            }
        });
    });

});