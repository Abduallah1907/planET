import { ITourist, ITouristCreateDTO, ITouristUpdateDTO } from "@/interfaces/ITourist";
import {
  IComment_Rating,
  IComment_RatingCreateDTOforActivity,
  IComment_RatingCreateDTOforItinerary,
  IComment_RatingCreateDTOforProduct,
  IComment_RatingCreateDTOfortourGuide,
} from "@/interfaces/IComment_rating";
import TouristService from "../../services/touristService";
import Container, { Inject, Service } from "typedi";
import { Request, Response } from "express";
import { start } from "repl";
import Comment_Rating from "@/models/Comment_rating";
import { Types } from "mongoose";
import { IComplaintCreateDTO } from "@/interfaces/IComplaint";
import { IOrderCartDTO } from "@/interfaces/IOrder";
import { IAddress } from "@/interfaces/IAddress";
@Service()
export class TouristController {
  public async getTourist(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const tourist = await touristService.getTouristService(email);
    res.status(tourist.status).json(tourist);
  }

  public async createTourist(req: any, res: any) {
    const touristData: ITouristCreateDTO = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const createdTourist = await touristService.createTouristService(touristData);
    res.status(createdTourist.status).json(createdTourist);
  }

  public async updateTourist(req: any, res: any) {
    const { searchEmail } = req.params;
    const touristUpdateData: ITouristUpdateDTO = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const updatedTourist = await touristService.updateTouristService(searchEmail, touristUpdateData);
    res.status(updatedTourist.status).json(updatedTourist);
  }

  public async deleteTouristAccountRequest(req: Request, res: Response): Promise<any> {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const deletionRequest = await touristService.requestTouristAccountDeletionService(email);
    res.status(deletionRequest.status).json(deletionRequest);
  }
  public async rateAndCommentTour_guide(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComment_RatingCreateDTOfortourGuide = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateAndCommentTour_guideService(tourist_id, data);
    res.status(ratedTourist.status).json(ratedTourist);
  }
  public async rateAndCommentItinerary(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComment_RatingCreateDTOforItinerary = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateAndCommentItineraryService(tourist_id, data);
    res.status(ratedTourist.status).json(ratedTourist);
  }
  public async rateAndCommentActivity(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComment_RatingCreateDTOforActivity = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateAndCommentActivityService(tourist_id, data);
    res.status(ratedTourist.status).json(ratedTourist);
  }

  public async bookActivity(req: any, res: any) {
    const { email, activity_id, payment_type, promoCode } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const bookedActivity = await touristService.bookActivityService(email, activity_id, payment_type, promoCode);
    res.status(bookedActivity.status).json(bookedActivity);
  }

  public async bookItinerary(req: any, res: any) {
    const { email, itinerary_id, time_to_attend, payment_type, promoCode } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const bookedItinerary = await touristService.bookItineraryService(email, itinerary_id, time_to_attend, payment_type, promoCode);
    res.status(bookedItinerary.status).json(bookedItinerary);
  }

  public async bookHistoricalLocation(req: any, res: any) {
    const { email, historical_location_id, payment_type } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const bookedHistoricalLocation = await touristService.bookHistoricalLocationService(email, historical_location_id, payment_type);
    res.status(bookedHistoricalLocation.status).json(bookedHistoricalLocation);
  }

  public async recievePoints(req: any, res: any) {
    const { tourist_id, amount } = req.body;
    const touristObjectID = new Types.ObjectId(tourist_id);
    const touristService: TouristService = Container.get(TouristService);
    const recievedPoints = await touristService.recievePointsService(touristObjectID, amount);
    res.status(200).json(recievedPoints);
  }

  public async recieveBadge(req: any, res: any) {
    const { tourist_id, points } = req.body;
    const touristObjectID = new Types.ObjectId(tourist_id);

    const touristService: TouristService = Container.get(TouristService);
    const recievedBadge = await touristService.recieveBadgeService(touristObjectID, points);
    res.status(recievedBadge.status).json(recievedBadge);
  }
  public async redeemPoints(req: any, res: any) {
    const { email, points } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const redeemedPoints = await touristService.redeemPointsService(email, points);
    res.status(redeemedPoints.status).json(redeemedPoints);
  }
  // check if the tourist went with the tour guide
  public async checkTourGuide(req: any, res: any) {
    const { tourist_id } = req.params;
    const { tour_guide_email } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const checkedTourGuide = await touristService.checkTourGuideService(tourist_id, tour_guide_email);
    //return true or false
    res.status(checkedTourGuide.status).json(checkedTourGuide);
  }
  // check if the tourist went with the itinerary
  public async checkItinerary(req: any, res: any) {
    const { tourist_id } = req.params;
    const { itinerary_id } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const checkedItinerary = await touristService.checkItineraryService(tourist_id, itinerary_id);
    //return true or false
    res.status(checkedItinerary.status).json(checkedItinerary);
  }
  // check if the tourist went to the activity
  public async checkActivity(req: any, res: any) {
    const { tourist_id } = req.params;
    const { activity_id } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const checkedActivity = await touristService.checkActivityService(tourist_id, activity_id);
    //return true or false
    res.status(checkedActivity.status).json(checkedActivity);
  }
  //create complaint
  public async fileComplaint(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComplaintCreateDTO = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const filedComplaint = await touristService.fileComplaintService(tourist_id, data);
    res.status(filedComplaint.status).json(filedComplaint);
  }
  //view all complaints
  public async viewComplaints(req: any, res: any) {
    const { tourist_id } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const complaints = await touristService.viewMyComplaintsService(tourist_id);
    res.status(complaints.status).json(complaints);
  }
  //flag for commenting on complaint
  public async flagToRateAndCommentProduct(req: any, res: any) {
    const { tourist_id } = req.params;
    const { product_id } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const flag = await touristService.flagToRateAndCommentProductService(tourist_id, product_id);
    res.status(flag.status).json(flag);
  }
  public async rateAndCommentProduct(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComment_RatingCreateDTOforProduct = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateAndCommentProductService(tourist_id, data);
    res.status(ratedTourist.status).json(ratedTourist);
  }
  public async cancelTicket(req: any, res: any) {
    const { tourist_id } = req.params;
    const { ticket_id } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const cancelledTicket = await touristService.cancelTicketService(tourist_id, ticket_id);
    res.status(cancelledTicket.status).json(cancelledTicket);
  }

  public async getPastActivityBookings(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const pastActivityBookings = await touristService.getPastActivityBookingsService(email);

    res.status(pastActivityBookings.status).json(pastActivityBookings);
  }

  public async getUpcomingActivityBookings(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const upcomingActivityBookings = await touristService.getUpcomingActivityBookingsService(email);

    res.status(upcomingActivityBookings.status).json(upcomingActivityBookings);
  }

  public async getPastItineraryBookings(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const pastItineraryBookings = await touristService.getPastItineraryBookingsService(email);

    res.status(pastItineraryBookings.status).json(pastItineraryBookings);
  }

  public async getUpcomingItineraryBookings(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const upcomingItineraryBookings = await touristService.getUpcomingItineraryBookingsService(email);

    res.status(upcomingItineraryBookings.status).json(upcomingItineraryBookings);
  }

  public async getPastHistoricalLocationBookings(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const pastHistoricalLocationBookings = await touristService.getPastHistoricalLocationBookingsService(email);

    res.status(pastHistoricalLocationBookings.status).json(pastHistoricalLocationBookings);
  }

  public async getUpcomingHistoricalLocationBookings(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const upcomingHistoricalLocationBookings = await touristService.getUpcomingHistoricalLocationBookingsService(email);

    res.status(upcomingHistoricalLocationBookings.status).json(upcomingHistoricalLocationBookings);
  }
  public async showMyTourGuides(req: any, res: any) {
    const { tourist_id } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const showTourGuides = await touristService.showMyTourGuidesService(tourist_id);
    res.status(showTourGuides.status).json(showTourGuides);
  }
  public async createOrder(req: any, res: any) {
    const orderData: IOrderCartDTO = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const order = await touristService.createOrderService(orderData);
    res.status(order.status).json(order);
  }

  public async getPastOrders(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const pastOrders = await touristService.getPastOrdersService(email);
    res.status(pastOrders.status).json(pastOrders);
  }

  public async addProductToWishlist(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const { product_id } = req.body;
    const productObjectID = new Types.ObjectId(product_id);
    const touristService: TouristService = Container.get(TouristService);
    const wishlist = await touristService.addProductToWishlistService(email, productObjectID);
    res.status(wishlist.status).json(wishlist);
  }

  public async removeProductFromWishlist(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const { product_id } = req.body;
    const productObjectID = new Types.ObjectId(product_id);
    const touristService: TouristService = Container.get(TouristService);
    const wishlist = await touristService.removeProductFromWishlistService(email, productObjectID);
    res.status(wishlist.status).json(wishlist);
  }

  public async viewWishlist(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const wishlist = await touristService.viewWishlistService(email);
    res.status(wishlist.status).json(wishlist);
  }

  public async addAddress(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const addressInfo: IAddress = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const addressResponse = await touristService.addDeliveryAddressService(email, addressInfo);
    res.status(addressResponse.status).json(addressResponse);
  }

  public async removeAddress(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const { address } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const addressResponse = await touristService.removeDeliveryAddressService(email, address);
    res.status(addressResponse.status).json(addressResponse);
  }

  public async getAddresses(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const addresses = await touristService.viewDeliveryAddressesService(email);
    res.status(addresses.status).json(addresses);
  }

  public async isValidCode(req: Request, res: Response) {
    const { code } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const validCode = await touristService.isValidCodeService(code);
    res.status(validCode.status).json(validCode);
  }
  public async getCurrentOrders(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const currentOrders = await touristService.getCurrentOrdersService(email);
    res.status(currentOrders.status).json(currentOrders);
  }

  public async bookmarkActivity(req: any, res: any) {
    const { email, activity_id } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const bookmarkedActivity = await touristService.bookmarkActivityService(email, activity_id);
    res.status(bookmarkedActivity.status).json(bookmarkedActivity);
  }

  public async unbookmarkActivity(req: any, res: any) {
    const { email, activity_id } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const unbookmarkedActivity = await touristService.unbookmarkActivityService(email, activity_id);
    res.status(unbookmarkedActivity.status).json(unbookmarkedActivity);
  }
  public async getBookmarkedActivities(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const bookmarkedActivities = await touristService.getBookmarkedActivitiesService(email);
    res.status(bookmarkedActivities.status).json(bookmarkedActivities);
  }
  public async getOrderDetails(req: any, res: any) {
    const { order_id } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const orderDetails = await touristService.getOrderDetailsService(order_id);
    res.status(orderDetails.status).json(orderDetails);
  }
  public async cancelOrder(req: any, res: any) {
    const { order_id } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const cancelledOrder = await touristService.cancelOrderService(order_id);
    res.status(cancelledOrder.status).json(cancelledOrder);
  }
}
