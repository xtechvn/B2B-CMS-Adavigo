$(document).ready(function () {
   
    var Request_Id = $('#Request_Id').val()
    _request_detail_hotel_booking.getcomment(Request_Id)
    _request_detail_hotel_booking.setTime()
})

var _request_detail_hotel_booking = {


    getRoomOrdered: function () {
        let arrRoom = [];
        $('.detail-order-flight__left ul').each(function () {
            let seft = $(this);
            arrRoom.push({
                room_number: seft.find('.NumberOfRooms').text(),
                room_id: seft.find('.RoomTypeId').val(),
                room_name: seft.find('.room-name').text().trim(),
                package_id: seft.find('.RoomTypeId').val(),
                package_name: seft.find('.RoomTypeName').val(),
                package_code: seft.find('.RoomTypeCode').val(),
                amount: parseFloat(seft.find('.selected_room_price').data('amount'))
            });
        });
        return arrRoom;
    },
    summit: function () {
        var bookingId = $('#BookingId').val();
        _ajax_caller.post('/hotel/SaveCustomerData', { BookingId: bookingId }, function (result) {
            if (result.isSuccess) {
                sessionStorage.removeItem(hotel_constants.CONSTATNTS.STORAGE.OrderID)
                sessionStorage.setItem(hotel_constants.CONSTATNTS.STORAGE.HotelDetailURL, window.location.href)

                window.location.href = result.url;
            } else {
                _msgalert.error(result.message);
            }
        });
    },
    newYear: function () {
        /*Lấy thời gian ngày hiện tại (mily giây) */
        var thoigianConLai = new Date($('#endtime').val()).getTime();
        if (parseFloat(thoigianConLai) < 0) { thoigianConLai = 0; }
        /*Tính thời gian còn lại (mily giây) */
        const now = new Date().getTime();
        thoigianConLai = thoigianConLai - now;
        console.log("thoigianConLai:" +thoigianConLai)
        /*Chuyển đơn vị thời gian tương ứng sang mili giây*/
        var giay = 1000;
        var phut = giay * 60;
        var gio = phut * 60;
        var ngay = gio * 24;
        if (thoigianConLai <= 0) {
            $('#end_time').hide();
        }
        /*Tìm ra thời gian theo ngày, giờ, phút giây còn lại thông qua cách chia lấy dư(%) và làm tròn số(Math.floor) trong Javascript*/
        var h = Math.floor((thoigianConLai % (ngay)) / (gio));
        var m = Math.floor((thoigianConLai % (gio)) / (phut));
        var s = Math.floor((thoigianConLai % (phut)) / (giay));

        /*Hiển thị kết quả ra các thẻ Div với ID tương ứng*/
  
        document.getElementById("minute").innerText = m+":";
        document.getElementById("second").innerText = s;
    },

    /*Thiết Lập hàm sẽ tự động chạy lại sau 1s*/
    setTime: function () {
        setInterval(function () {
            _request_detail_hotel_booking.newYear()
        }, 1000)
    },
    
    getcomment: function (id) {
        $.ajax({
            
            url: "/Booking/CommentRequest",
            type: "post",
            data: { id: parseFloat(id) },
            success: function (result) {
             
                $('#Comment_request').html(result)

            }
        });
    },
};
