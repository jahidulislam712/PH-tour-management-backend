import { StatusCodes } from "http-status-codes"
import { envVars } from "../../config/env"
import AppError from "../../errorHelpers/appError"
import axios from "axios"
import { ISSLCommerz } from "./sslCommerz.interface"


const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {

    const data = {
      store_id: envVars.SSL.STORE_ID,
      store_passwd: envVars.SSL.STORE_PASS ,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
      cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
      emi_option: "N/A",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_city: "Dhaka",
      cus_postcode: 1000,
      cus_country: "Bangladesh",
      cus_phone: payload.phone,
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_city: "N/A",
      ship_postcode: "N/A",
      ship_country: "N/A",
      shipping_method: "N/A",
      num_of_item: "N/A",
      weight_of_items: "N/A",
      logistic_pickup_id: "N/A",
      logistic_delivery_type: "N/A",
      product_name: "Tour",
      product_category: "Service",
      product_profile: "General",
    }


    const response = await axios({
      method: "post",
      url: envVars.SSL.SSL_PAYMENT_API,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })

    return response.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(StatusCodes.BAD_REQUEST, error.message)
  }
}

export const SSLService = {
  sslPaymentInit
}