using System;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class BookingViewModel
    {
    }


    public class BookingSearchModel
    {
        public DateTime from_date { get; set; }
        public DateTime to_date { get; set; }
        public string code { get; set; }
        public int page_index { get; set; }
        public int page_size { get; set; }
    }

    public class BookingModel
    {
        public long orderId { get; set; }
        public DateTime createdDate { get; set; }
        public DateTime? createTime { get; set; }
        public string orderNo { get; set; }
        public string hotelName { get; set; }
        public int orderStatus { get; set; }
        public int hotelBookingStatus { get; set; }
        public string hotelBookingStatusName { get; set; }
        public string contactClientName { get; set; }
        public DateTime arrivalDate { get; set; }
        public DateTime departureDate { get; set; }
        public int numberOfRoom { get; set; }
        public int roomNights { get; set; }
        public int numberOfPeople { get; set; }
        public decimal amount { get; set; }
    }

    public class BookingDetailModel
    {
        public Order order { get; set; }
        public Booking booking { get; set; }
        public Contact contact { get; set; }
    }

    public class Order
    {
        public int orderId { get; set; }
        public string orderNo { get; set; }
        public DateTime createTime { get; set; }
        public decimal amount { get; set; }
    }

    public class Booking
    {
        public string bookingId { get; set; }
        public string hotelName { get; set; }
        public int status { get; set; }
        public DateTime arrivalDate { get; set; }
        public DateTime departureDate { get; set; }
        public int numberOfRoom { get; set; }
        public int numberOfAdult { get; set; }
        public int numberOfChild { get; set; }
        public int numberOfInfant { get; set; }
        
    }

    public class Contact
    {
        public string name { get; set; }
        public string mobile { get; set; }
        public string email { get; set; }
    }
}
