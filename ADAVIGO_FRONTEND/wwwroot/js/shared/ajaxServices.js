const ajaxServices = {
    post: function (url, data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'post',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data),
                processData: false,
                success: function (data) {
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    },


    get: function (url) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'get',
                contentType: 'application/json',
                processData: false,
                success: function (data) {
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    },
     
    
}