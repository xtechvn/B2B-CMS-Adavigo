var tour_global = {
    LocationStart: function (tour_type) {
        var result = tour_global.POSTSynchorus('/Tour/LocationStart', { tour_type: tour_type });
        if (result != null && result != undefined && result.data != null && result.data != undefined) {
            return result.data
        }
        return undefined
    },
    LocationEnd: function (tour_type, location_start) {
        var result = tour_global.POSTSynchorus('/Tour/LocationEnd', { tour_type: tour_type, start_point: location_start })
        if (result != null && result != undefined && result.data != null && result.data != undefined) {
            return result.data
        }
        return undefined
    },
    RemoveUnicode: function (str) {
        if (str == null || str == undefined || str.trim() == '') {
            return str
        }
        // remove accents
        var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ ",
            to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy ";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replaceAll(from[i], to[i]);
        }



        str = str.toLowerCase()
            .trim()
            .replace(/[^a-z0-9\- ]/g, '')
            .replace(/-+/g, '');

        return str;
    },
    RemoveSpecialCharacter: function (text) {
        return text.replaceAll(/[^a-zA-Z0-9àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ ]/g, '');
    },
    Comma: function (number) { //function to add commas to textboxes
        number = ('' + number).replace(/[^0-9.,]+/g, '');
        number += '';
        number = number.replace(',', ''); number = number.replace(',', ''); number = number.replace(',', '');
        number = number.replace(',', ''); number = number.replace(',', ''); number = number.replace(',', '');
        x = number.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1))
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        return x1 + x2;
    },
    POSTSynchorus: function (url, model) {
        var data = undefined
        $.ajax({
            url: url,
            type: "POST",
            data: model,
            success: function (result) {
                data = result;
            },
            error: function (err) {
                console.log(err)
            },
            async: false
        });
        return data
    },
    POST: function (url, model, callback) {
        $.ajax({
            url: url,
            type: "POST",
            data: model,
            success: function (result) {
                callback(result)
            },
            error: function (err) {
                console.log(err)
            }
        });
    },
}