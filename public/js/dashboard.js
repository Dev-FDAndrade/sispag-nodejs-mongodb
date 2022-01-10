$(document).ready(function () {
    //Apresentar ou ocultar o menu
    $('.sidebar-toggle').on('click', function () {
        $('.sidebar').toggleClass('toggled');
    });
    
    //Carregar aberto o submenu
    var active = $('.sidebar .active');
    if (active.length && active.parent('.collapse').length) {
        var parent = active.parent('.collapse');

        parent.prev('a').attr('aria-expanded', true);
        parent.addClass('show');
    }

    //Carregar Modal Apagar Registro
    $('a[data-confirm]').click(function (ev) {
        var href = $(this).attr('href');
        var item = $(this).attr('data-confirm');
        if (!$('#confirm-delete').length) {
            $('body').append('<div class="modal fade" id="confirm-delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header bg-default">Excluir Item<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body">Tem certeza de que deseja excluir o pagamento "'+item+'"?</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button><a class="btn btn-success text-white" id="dataComfirmOK">Sim, excluir!</a></div></div></div></div>');
        }
        //attr = usar para definir um atributo para o elemento dataComfirmOK.
        $('#dataComfirmOK').attr('href', href)
        $('#confirm-delete').modal({ show: true })
        return false
    });
});

