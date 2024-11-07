using System;
using System.Collections.Generic;

namespace ADAVIGO_FRONTEND.ViewModels
{
    public class DetailRequestModel
    {
        public List<HotelBookingRooms> Rooms { get; set; }
        public List<HotelBookingRoomRates> Rates { get; set; }
        public List<HotelBookingRoomExtraPackages> ExtraPackages { get; set; }
    }
    public class HotelBookingRooms
    {
        public long Id { get; set; }
        public long HotelBookingId { get; set; }
        public string RoomTypeId { get; set; }
        public double Price { get; set; }
        public double Profit { get; set; }
        public double TotalAmount { get; set; }
        public string RoomTypeCode { get; set; }
        public string RoomTypeName { get; set; }
        public int? NumberOfAdult { get; set; }
        public int? NumberOfChild { get; set; }
        public int? NumberOfInfant { get; set; }
        public string PackageIncludes { get; set; }
        public double? ExtraPackageAmount { get; set; }
        public int? Status { get; set; }
        public double? TotalUnitPrice { get; set; }
        public short? NumberOfRooms { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public long? SupplierId { get; set; }
        public bool? IsRoomFund { get; set; }
    }
    public class HotelBookingRoomRates
    {
        public long Id { get; set; }
        public long HotelBookingRoomId { get; set; }
        public string RatePlanId { get; set; }
        public DateTime StayDate { get; set; }
        public double Price { get; set; }
        public double Profit { get; set; }
        public double TotalAmount { get; set; }
        public string AllotmentId { get; set; }
        public string RatePlanCode { get; set; }
        public string PackagesInclude { get; set; }
        public double? UnitPrice { get; set; }
        public short? Nights { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public double? OperatorPrice { get; set; }
        public double? SalePrice { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
    public class HotelBookingRoomExtraPackages
    {
        public long Id { get; set; }
        public string PackageId { get; set; }
        public string PackageCode { get; set; }
        public long? HotelBookingId { get; set; }
        public long? HotelBookingRoomId { get; set; }
        public double? Amount { get; set; }
        public double? UnitPrice { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public double? Profit { get; set; }
        public int? PackageCompanyId { get; set; }
        public double? OperatorPrice { get; set; }
        public double? SalePrice { get; set; }
        public short? Nights { get; set; }
        public int? Quantity { get; set; }
        public int? SupplierId { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
