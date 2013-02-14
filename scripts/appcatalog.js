
$(function () {

    $.ajax({
        url: 'http://buildserver1:8080/databases/VersionOneApplicationCatalog/docs/?entity-name=ApplicationEntry',
        dataType: 'jsonp',
        jsonp: 'jsonp',
        success: function (dataItems) {
            var list = $('#divResults');
            if (list == null || typeof (dataItems) === 'undefined' || dataItems.length == 0) return;
            $.each(dataItems,
                function (item) {
                    list.append('<p>' + this.Name + '</p>');
                });
            throw 'test';
        },
        error: function (jqXHR, textStatus, errorThrown ) { alert(errorThrown);}
    });

});
