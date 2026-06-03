using System;
using System.Collections.Generic;
using System.Text;

namespace LIB.ENTITIES.ViewModels.Hotels
{
    public class HotelRoomFundDetailModel
    {
        public int Id { get; set; }
        public int HotelRoomFundId { get; set; }
        public int HotelRoomId { get; set; }
        public decimal NumberOfRooms { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string RoomName { get; set; }
        public int TotalRoomNights { get; set; }
        public int TotalBookedRooms { get; set; }
        public int NumberOfRoomsAvailable { get; set; }
    }
}
