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
};
