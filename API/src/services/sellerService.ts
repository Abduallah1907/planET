import { ISellerInputDTO, ISellerOutputDTO } from "@/interfaces/ISeller";
import UserRoles from "@/types/enums/userRoles";
import response from "@/types/responses/response";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";
import Container, { Inject, Service } from "typedi";
import { IUserInputDTO } from "@/interfaces/IUser";
import UserService from "./userService";
import { ISellerUpdateDTO } from "@/interfaces/ISeller";
import bcrypt from "bcryptjs";
import { IProduct } from "@/interfaces/IProduct";
import UserStatus from "@/types/enums/userStatus";
import { ISalesReport, ISalesReportTotal } from "@/interfaces/IReport";

@Service()
export default class SellerService {
  constructor(
    @Inject("sellerModel") private sellerModel: Models.SellerModel,
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("orderModel") private orderModel: Models.OrderModel
  ) {}
  //input email of seller retrun seller data
  public async getSellerService(email: string) {
    const user = await this.userModel.findOne({
      email: email,
      role: UserRoles.Seller,
    });
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");

    if (user == null) throw new NotFoundError("User not found");
    // throw new Error("User not found");

    const seller = await this.sellerModel.findOne({ user_id: user._id });
    if (seller instanceof Error)
      throw new InternalServerError("Internal server error");

    if (seller == null) throw new NotFoundError("Seller not found");

    const sellerOutput: ISellerOutputDTO = {
      email: user.email,
      name: user.name,
      username: user.username,
      phone_number: user.phone_number,
      logo: seller.logo,
      description: seller.description,
      products: seller.products,
    };
    return new response(true, sellerOutput, "Seller found", 200);
  }
  //Any seller need to be cerated as a user first role seller so we need to call createUserService first then seller will be created
  public async createSellerService(newSellerData: ISellerInputDTO) {
    const userData: IUserInputDTO = {
      email: newSellerData.email,
      name: newSellerData.name,
      username: newSellerData.username,
      password: newSellerData.password,
      role: UserRoles.Seller,
      phone_number: newSellerData.phone_number,
    };
    const userService: UserService = Container.get(UserService);
    const newUserResponse = await userService.createUserService(userData);

    const newUser = new this.userModel(newUserResponse.data);
    // newUser.role = UserRoles.Seller;
    newUser.save();
    if (newUser instanceof Error)
      throw new InternalServerError("Internal server error");

    if (newUser == null) throw new NotFoundError("User not found");
    const newSeller = new this.sellerModel({
      user_id: newUser._id,
      documents_required: newSellerData.documents_required,
    });

    await newSeller.save();

    const sellerOutput: ISellerOutputDTO = {
      email: newUser.email,
      name: newUser.name,
      username: newUser.username,
      phone_number: newUser.phone_number,
      logo: newSeller.logo,
      description: newSeller.description,
      products: [],
    };
    return new response(true, sellerOutput, "Seller created", 201);
  }

  //Takes old and new name and description of seller
  //update seller data with new attributes in dto
  public async updateSellerService(
    searchEmail: string,
    updatedSellerData: ISellerUpdateDTO
  ) {
    const { name, username, email, phone_number, description, password, logo } =
      updatedSellerData;
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Await bcrypt.hash here
    }
    const checkApprovedUser = await this.userModel.findOne({
      email: searchEmail,
      role: UserRoles.Seller,
      status: UserStatus.APPROVED,
    });
    if (!checkApprovedUser) {
      throw new ForbiddenError(
        "Seller cannot update account because not approved yet"
      );
    }
    const user = await this.userModel.findOneAndUpdate(
      { email: searchEmail, role: UserRoles.Seller },
      {
        name: name,
        email: email,
        username: username,
        phone_number: phone_number,
        password: hashedPassword,
      },
      { new: true }
    );
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");

    const updatedSeller = await this.sellerModel.findOneAndUpdate(
      { user_id: user._id },
      { description: description, logo: logo },
      { new: true }
    );

    if (updatedSeller instanceof Error)
      throw new InternalServerError("Internal server error");
    if (updatedSeller == null) throw new NotFoundError("Seller not found");

    const sellerOutput: ISellerOutputDTO = {
      email: user.email,
      name: user.name,
      username: user.username,
      phone_number: user.phone_number,
      logo: updatedSeller.logo,
      description: updatedSeller.description,
      products: updatedSeller.products,
    };
    return new response(true, sellerOutput, "Seller updated", 200);
  }

  public async deleteSellerAccountRequest(email: string): Promise<any> {
    const sellerUser = await this.userModel.findOne({ email });
    if (!sellerUser || sellerUser.role !== UserRoles.Seller)
      throw new NotFoundError("Seller user account was not found");
    const sellerData = await this.sellerModel
      .findOne({ user_id: sellerUser._id })
      .populate("products");

    if (!sellerData) throw new NotFoundError("Seller account was not found");

    const products = sellerData.products as unknown as IProduct[];
    products.forEach(async (product) => {
      product.archieve_flag = true;
      await product.save();
    });

    const deletedSeller = await this.sellerModel.findByIdAndDelete(
      sellerData._id
    );
    const deletedSellerUser = await this.userModel.findByIdAndDelete(
      sellerUser._id
    );

    return new response(true, {}, "Seller successfully deleted", 200);
  }
  public async getSalesReportService(
    email: string,
    start_date: string,
    end_date: string
  ) {
    const convertDate = (date: string): string => {
      const [day, month, year] = date.split("/");
      return `${month}-${day}-${year}`;
    };

    start_date = start_date ? convertDate(start_date) : start_date;
    end_date = end_date ? convertDate(end_date) : end_date;

    let isoStartDate = start_date ? new Date(start_date) : null;

    let isoEndDate = end_date
      ? new Date(new Date(end_date).setDate(new Date(end_date).getDate() + 1))
      : null;

    const userSeller = await this.userModel.findOne({
      email: email,
      role: UserRoles.Seller,
    });
    if (userSeller instanceof Error)
      throw new InternalServerError("Internal server error");

    if (userSeller == null) throw new NotFoundError("Seller not found");

    const seller = await this.sellerModel.findOne({ user_id: userSeller._id });
    if (seller instanceof Error)
      throw new InternalServerError("Internal server error");

    if (seller == null) throw new NotFoundError("Seller not found");

    const productReport = await this.orderModel.aggregate([
      // Step 1: Unwind the items array to process each product separately
      {
        $unwind: "$products.items",
      },

      // Step 2: Lookup product details from the Product collection
      {
        $lookup: {
          from: "products", // Product collection name
          localField: "products.items.product_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      // Step 3: Flatten the productDetails array
      {
        $unwind: "$productDetails",
      },

      {
        $match: {
          "productDetails.seller_id": seller._id,
        },
      },
      // Step 4: Group to calculate global first_buy and last_buy for each product
      {
        $group: {
          _id: "$productDetails._id", // Group by product ID
          name: { $first: "$productDetails.name" },
          average_rating: { $first: "$productDetails.average_rating" },
          image: { $first: "$productDetails.image" },
          first_buy: { $min: "$createdAt" }, // Earliest purchase date
          last_buy: { $max: "$createdAt" }, // Latest purchase date
          orders: { $push: "$$ROOT" }, // Collect all order details
        },
      },

      // Step 5: Re-process the orders to apply the date range filter
      {
        $project: {
          _id: 1,
          name: 1,
          average_rating: 1,
          image: 1,
          first_buy: 1,
          last_buy: 1,
          orders: {
            $filter: {
              input: "$orders",
              as: "order",
              cond: {
                $and: [
                  isoStartDate
                    ? { $gte: ["$$order.createdAt", isoStartDate] }
                    : true,
                  isoEndDate
                    ? { $lte: ["$$order.createdAt", isoEndDate] }
                    : true,
                ],
              },
            },
          },
        },
      },

      // Step 6: Flatten the filtered orders back for revenue calculation
      {
        $unwind: "$orders",
      },

      // Step 7: Calculate revenue for each filtered order
      {
        $project: {
          _id: 1,
          name: 1,
          average_rating: 1,
          image: 1,
          first_buy: 1,
          last_buy: 1,
          revenue: {
            $multiply: [
              "$orders.products.items.quantity",
              "$orders.productDetails.price",
            ],
          },
        },
      },

      // Step 8: Group again to sum up total revenue for each product
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          average_rating: { $first: "$average_rating" },
          image: { $first: "$image" },
          first_buy: { $first: "$first_buy" }, // Use the first grouping results
          last_buy: { $first: "$last_buy" }, // Use the first grouping results
          revenue: { $sum: "$revenue" }, // Sum up the revenue
        },
      },

      // Step 9: Final projection
      {
        $project: {
          _id: 1,
          name: 1,
          average_rating: 1,
          image: 1,
          type: "PRODUCT",
          revenue: 1,
          total_revenue: { $multiply: ["$revenue", 0.1] }, // 10% for admin
          first_buy: 1,
          last_buy: 1,
        },
      },
    ]);

    const salesReports: ISalesReport[] = [...productReport];
    let totalRevenue = 0;
    for (const salesReport of salesReports) {
      totalRevenue += salesReport.total_revenue;
    }
    const salesReportTotal: ISalesReportTotal = { salesReports, totalRevenue };
    return new response(true, salesReportTotal, "Sales report generated", 200);
  }
}
